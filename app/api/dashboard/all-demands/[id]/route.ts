import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    connection = await pool.getConnection();

    // Récupérer les infos de la demande
    const [demandes] = await connection.execute(
      `SELECT 
        d.id_demande,
        d.titre,
        d.description,
        d.progression,
        d.date_soumission,
        d.date_modification,
        s.libelle as status,
        d.id_groupe,
        g.code_groupe,
        g.nom as nom_groupe,
        g.filiere,
        g.annee,
        u_etudiant.nom as nom_etudiant,
        u_etudiant.prenom as prenom_etudiant,
        u_etudiant.email as email_etudiant,
        u_encadrant.nom as nom_encadrant,
        u_encadrant.prenom as prenom_encadrant,
        u_labo.nom as nom_laboratoire,
        u_labo.email as email_laboratoire
      FROM demande d
      LEFT JOIN status s ON d.id_status = s.id_status
      LEFT JOIN groupe g ON d.id_groupe = g.id_groupe
      LEFT JOIN utilisateur u_etudiant ON d.id_etudiant = u_etudiant.id_utilisateur
      LEFT JOIN utilisateur u_encadrant ON d.id_encadrant = u_encadrant.id_utilisateur
      LEFT JOIN utilisateur u_labo ON d.id_laboratoire = u_labo.id_utilisateur
      WHERE d.id_demande = ?`,
      [id]
    );

    const demandesArray = (demandes as any[]) || [];

    if (demandesArray.length === 0) {
      return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 });
    }

    const demandeInfo = demandesArray[0];

    // Récupérer les composants demandés
    const [lignes] = await connection.execute(
      `SELECT 
        ld.id_ligne,
        ld.id_composant,
        ld.quantite_demandee,
        ld.disponible,
        ld.commentaire_labo,
        c.nom as nom_composant,
        c.reference,
        c.photo_lien,
        c.existe,
        c.Statut_Disponibilite,
        c.quantite as quantite_stock,
        c.commentaire
      FROM ligne_demande ld
      LEFT JOIN composant c ON ld.id_composant = c.id_composant
      WHERE ld.id_demande = ?`,
      [id]
    );

    const composants = (lignes as any[]) || [];

    return NextResponse.json({
      demande: {
        id_demande: demandeInfo.id_demande,
        titre: demandeInfo.titre,
        description: demandeInfo.description,
        progression: demandeInfo.progression || 0,
        date_soumission: demandeInfo.date_soumission,
        date_modification: demandeInfo.date_modification,
        status: demandeInfo.status || 'en_attente',
        groupe: {
          id_groupe: demandeInfo.id_groupe,
          code_groupe: demandeInfo.code_groupe,
          nom: demandeInfo.nom_groupe,
          filiere: demandeInfo.filiere,
          annee: demandeInfo.annee,
        },
        etudiant: {
          nom: demandeInfo.nom_etudiant,
          prenom: demandeInfo.prenom_etudiant,
          email: demandeInfo.email_etudiant,
        },
        encadrant: demandeInfo.nom_encadrant ? {
          nom: demandeInfo.nom_encadrant,
          prenom: demandeInfo.prenom_encadrant,
        } : null,
        laboratoire: demandeInfo.nom_laboratoire ? {
          nom: demandeInfo.nom_laboratoire,
          email: demandeInfo.email_laboratoire,
        } : null,
        composants: composants.map((comp: any) => ({
          id_ligne: comp.id_ligne,
          id_composant: comp.id_composant,
          nom: comp.nom_composant || 'Composant sans nom',
          reference: comp.reference,
          photo_lien: comp.photo_lien,
          quantite_demandee: comp.quantite_demandee,
          quantite_stock: comp.quantite_stock,
          disponible: comp.disponible,
          existe: comp.existe !== null ? Boolean(comp.existe) : null,
          statut_disponibilite: comp.Statut_Disponibilite || 'DIS',
          commentaire_labo: comp.commentaire_labo,
          commentaire: comp.commentaire,
        })),
      },
    });
  } catch (error) {
    console.error('Erreur lors du chargement de la demande:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de la demande' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
