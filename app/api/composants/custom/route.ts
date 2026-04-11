import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

interface CreateComposantRequest {
  nom: string;
  reference: string;
  photo_lien?: string | null;
  quantite: number;
  commentaire?: string | null;
}

export async function POST(req: Request) {
  try {
    const body: CreateComposantRequest = await req.json();
    const { nom, reference, photo_lien, quantite, commentaire } = body;

    // Validation stricte
    if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom est requis et doit être une chaîne non vide' },
        { status: 400 }
      );
    }

    if (!reference || typeof reference !== 'string' || reference.trim().length === 0) {
      return NextResponse.json(
        { error: 'La référence est requise et doit être une chaîne non vide' },
        { status: 400 }
      );
    }

    if (typeof quantite !== 'number' || quantite < 1 || !Number.isInteger(quantite)) {
      return NextResponse.json(
        { error: 'La quantité doit être un nombre entier positif' },
        { status: 400 }
      );
    }

    if (nom.length > 255) {
      return NextResponse.json(
        { error: 'Le nom ne doit pas dépasser 255 caractères' },
        { status: 400 }
      );
    }

    if (reference.length > 100) {
      return NextResponse.json(
        { error: 'La référence ne doit pas dépasser 100 caractères' },
        { status: 400 }
      );
    }

    // Validation optionnelle de l'URL
    if (photo_lien && typeof photo_lien === 'string') {
      try {
        new URL(photo_lien);
      } catch {
        return NextResponse.json(
          { error: 'Le lien photo est une URL invalide' },
          { status: 400 }
        );
      }
    }

    const [result] = await pool.query(
      `INSERT INTO composant (nom, reference, existe, photo_lien, quantite, commentaire, Statut_Disponibilite, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [nom.trim(), reference.trim(), false, photo_lien || null, quantite, commentaire || null, 'IND']
    );

    const id_composant = (result as any).insertId;

    console.log(`Composant créé: ID ${id_composant}, Nom: ${nom}, Référence: ${reference}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Composant créé avec succès',
        id_composant,
        composant: {
          id_composant,
          nom: nom.trim(),
          reference: reference.trim(),
          existe: false,
          photo_lien: photo_lien || null,
          quantite,
          commentaire: commentaire || null,
          statut_disponibilite: 'IND',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur création composant:', error);

    // Détection des erreurs spécifiques
    if (error instanceof Error) {
      if (error.message.includes('Duplicate entry')) {
        return NextResponse.json(
          { error: 'Un composant avec cette référence existe déjà' },
          { status: 409 }
        );
      }
      if (error.message.includes('FOREIGN KEY')) {
        return NextResponse.json(
          { error: 'Erreur de contrainte de clé étrangère' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du composant' },
      { status: 500 }
    );
  }
}