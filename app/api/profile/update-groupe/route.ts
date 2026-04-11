import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Récupérer et vérifier le token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    } catch (err) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const userId = decoded.id;
    const body = await request.json();
    const { code_groupe } = body;

    console.log('update-groupe API called with:', { userId, body, code_groupe, type: typeof code_groupe });

    // Validation
    if (!code_groupe || typeof code_groupe !== 'string' || code_groupe.trim().length === 0) {
      console.log('Validation failed:', { code_groupe, isEmpty: !code_groupe, isString: typeof code_groupe === 'string', trimmedLength: code_groupe?.trim().length });
      return NextResponse.json(
        { error: 'Le code du groupe est requis' },
        { status: 400 }
      );
    }

    if (code_groupe.trim().length > 50) {
      return NextResponse.json(
        { error: 'Le code du groupe ne doit pas dépasser 50 caractères' },
        { status: 400 }
      );
    }

    // Chercher l'id_groupe correspondant au code_groupe
    const selectQuery = 'SELECT id_groupe FROM groupe WHERE code_groupe = ?';
    const [groupeRows]: any = await pool.query(selectQuery, [code_groupe.trim()]);

    if (!groupeRows || groupeRows.length === 0) {
      return NextResponse.json(
        { error: 'Groupe non trouvé' },
        { status: 404 }
      );
    }

    const id_groupe = groupeRows[0].id_groupe;

    // Mettre à jour l'id_groupe dans la base de données
    const updateQuery = `
      UPDATE utilisateur 
      SET id_groupe = ?
      WHERE id_utilisateur = ?
    `;

    await pool.query(updateQuery, [id_groupe, userId]);

    console.log(`Groupe mis à jour pour l'utilisateur ${userId}: ${code_groupe}`);

    return NextResponse.json({
      message: 'Numéro de groupe mis à jour avec succès',
      code_groupe: code_groupe.trim(),
    });

  } catch (error) {
    console.error('Error updating groupe:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
