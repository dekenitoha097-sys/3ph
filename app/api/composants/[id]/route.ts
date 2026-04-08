import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

interface UpdateComposantRequest {
  nom: string;
  reference: string;
  photo_lien?: string;
  quantite: number;
  Statut_Disponibilite: string;
  commentaire?: string;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    const body: UpdateComposantRequest = await request.json();

    // Validation
    if (!body.nom || body.nom.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }

    if (!body.reference || body.reference.trim().length === 0) {
      return NextResponse.json(
        { error: 'La référence est requise' },
        { status: 400 }
      );
    }

    if (typeof body.quantite !== 'number' || body.quantite < 0) {
      return NextResponse.json(
        { error: 'La quantité doit être un nombre positif' },
        { status: 400 }
      );
    }

    if (!['DIS', 'IND', 'EN_ATTENTE'].includes(body.Statut_Disponibilite)) {
      return NextResponse.json(
        { error: 'Statut de disponibilité invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le composant existe
    const [[existing]] = await pool.query(
      'SELECT id_composant FROM composant WHERE id_composant = ?',
      [id]
    ) as any;

    if (!existing) {
      return NextResponse.json(
        { error: 'Composant non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le composant
    const updateQuery = `
      UPDATE composant 
      SET 
        nom = ?,
        reference = ?,
        photo_lien = ?,
        quantite = ?,
        Statut_Disponibilite = ?,
        commentaire = ?
      WHERE id_composant = ?
    `;

    await pool.query(updateQuery, [
      body.nom.trim(),
      body.reference.trim(),
      body.photo_lien || null,
      body.quantite,
      body.Statut_Disponibilite,
      body.commentaire || null,
      id
    ]);

    // Retourner le composant mis à jour
    const [[updated]] = await pool.query(
      `SELECT 
        id_composant,
        nom,
        reference,
        photo_lien AS image_url,
        existe,
        quantite AS disponibilite,
        commentaire AS description,
        Statut_Disponibilite AS statut_disponibilite,
        created_at
      FROM composant 
      WHERE id_composant = ?`,
      [id]
    ) as any;

    console.log('Composant mis à jour:', updated);
    return NextResponse.json(updated);

  } catch (error) {
    console.error('Error updating composant:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le composant existe
    const [[existing]] = await pool.query(
      'SELECT id_composant, nom FROM composant WHERE id_composant = ?',
      [id]
    ) as any;

    if (!existing) {
      return NextResponse.json(
        { error: 'Composant non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier qu'il n'est pas utilisé dans des demandes
    const [[usage]] = await pool.query(
      'SELECT COUNT(*) as count FROM ligne_demande WHERE id_composant = ?',
      [id]
    ) as any;

    if (usage.count > 0) {
      return NextResponse.json(
        { error: `Ce composant est utilisé dans ${usage.count} demande(s) et ne peut pas être supprimé` },
        { status: 409 }
      );
    }

    // Supprimer le composant
    await pool.query('DELETE FROM composant WHERE id_composant = ?', [id]);

    console.log('Composant supprimé:', id, existing.nom);
    return NextResponse.json({ 
      message: `Composant "${existing.nom}" supprimé avec succès`,
      id_composant: id
    });

  } catch (error) {
    console.error('Error deleting composant:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
