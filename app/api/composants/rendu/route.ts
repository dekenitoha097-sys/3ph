import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(request: Request) {
  let connection;

  try {
    const body = await request.json();
    const idDemande = Number(body?.id_demande);

    if (!Number.isInteger(idDemande) || idDemande <= 0) {
      return NextResponse.json(
        { error: "L'ID de la demande est requis" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. NOUVEAU : Mettre à jour le statut et la date de retour dans recuperation_composant
    await connection.execute(
      `UPDATE recuperation_composant 
       SET statut = 'RENDU', date_retour = NOW() 
       WHERE id_demande = ?`,
      [idDemande]
    );

    // 2. Récupérer les lignes de la demande pour réincrémenter le stock
    const [lines] = await connection.execute(
      'SELECT id_composant, quantite_demandee FROM ligne_demande WHERE id_demande = ?',
      [idDemande]
    );

    const ligneDemandes = Array.isArray(lines)
      ? (lines as Array<{ id_composant: number; quantite_demandee: number }>)
      : [];

    if (ligneDemandes.length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { message: 'Aucune ligne de demande trouvée pour ce rendu' },
        { status: 404 }
      );
    }

    // 3. Boucle de mise à jour des stocks composants
    for (const ligne of ligneDemandes) {
      const idComposant = Number(ligne.id_composant);
      const quantiteDemandee = Number(ligne.quantite_demandee || 0);

      if (!Number.isInteger(idComposant) || idComposant <= 0) {
        continue;
      }

      const [composantRows] = await connection.execute(
        'SELECT id_composant, quantite FROM composant WHERE id_composant = ?',
        [idComposant]
      );

      const composants = Array.isArray(composantRows)
        ? (composantRows as Array<{ quantite: number }>)
        : [];

      if (composants.length === 0) {
        continue;
      }

      const stockActuel = Number(composants[0].quantite || 0);
      const nouveauStock = stockActuel + quantiteDemandee;

      await connection.execute(
        'UPDATE composant SET quantite = ? WHERE id_composant = ?',
        [nouveauStock, idComposant]
      );
    }

    await connection.commit();

    return NextResponse.json(
      {
        message: 'Composants retournés et stocks remis à jour avec succès',
        id_demande: idDemande,
      },
      { status: 200 }
    );
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error('Error restoring composant stocks:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}