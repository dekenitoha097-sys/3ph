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
    const { nom, prenom, sexe } = body;

    // Validation
    if (!nom || !prenom) {
      return NextResponse.json(
        { error: 'Le nom et le prénom sont requis' },
        { status: 400 }
      );
    }

    if (nom.trim().length === 0 || prenom.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom et le prénom ne peuvent pas être vides' },
        { status: 400 }
      );
    }

    if (nom.length > 100 || prenom.length > 100) {
      return NextResponse.json(
        { error: 'Le nom et le prénom ne doivent pas dépasser 100 caractères' },
        { status: 400 }
      );
    }

    // Mettre à jour les informations
    const updateQuery = `
      UPDATE utilisateur 
      SET nom = ?, prenom = ?${sexe ? ', sexe = ?' : ''}
      WHERE id_utilisateur = ?
    `;

    const params = sexe 
      ? [nom.trim(), prenom.trim(), sexe, userId]
      : [nom.trim(), prenom.trim(), userId];

    await pool.query(updateQuery, params);

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
