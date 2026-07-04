import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }

    const [rows] = await pool.query(
      `
        SELECT
          rc.id_recuperation,
          rc.id_demande,
          rc.id_groupe,
          rc.date_recuperation,
          rc.date_retour,
          rc.statut,
          d.titre,
          d.description,
          g.code_groupe,
          g.nom AS nom_groupe,
          g.filiere,
          g.annee,
          u.nom AS nom_etudiant,
          u.prenom AS prenom_etudiant,
          u.email AS email_etudiant
        FROM recuperation_composant rc
        LEFT JOIN demande d ON rc.id_demande = d.id_demande
        LEFT JOIN groupe g ON rc.id_groupe = g.id_groupe
        LEFT JOIN utilisateur u ON d.id_etudiant = u.id_utilisateur
        WHERE rc.id_recuperation = ?
      `,
      [id]
    );

    const recuperationRows = Array.isArray(rows) ? rows : [];
    const recuperation = recuperationRows.length > 0 ? recuperationRows[0] as any : null;

    if (!recuperation) {
      return NextResponse.json({ message: 'Récupération introuvable' }, { status: 404 });
    }

    const [componentsRows] = await pool.query(
      `
        SELECT
          ld.id_ligne,
          ld.id_composant,
          ld.quantite_demandee,
          ld.commentaire_labo,
          c.nom,
          c.reference,
          c.photo_lien,
          c.quantite AS quantite_stock,
          c.commentaire,
          c.existe,
          c.Statut_Disponibilite
        FROM ligne_demande ld
        LEFT JOIN composant c ON ld.id_composant = c.id_composant
        WHERE ld.id_demande = ?
      `,
      [recuperation.id_demande]
    );

    return NextResponse.json({
      recuperation,
      composants: componentsRows,
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors du chargement du détail de récupération:', error);
    return NextResponse.json(
      { message: 'Erreur serveur lors du chargement du détail' },
      { status: 500 }
    );
  }
}
