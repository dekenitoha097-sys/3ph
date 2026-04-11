import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/discussions/[id_demande]
 * Récupérer tous les messages d'une discussion
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_demande: string }> }
) {
  let connection;
  try {
    const { id_demande } = await params;

    if (!id_demande) {
      return NextResponse.json({ error: 'ID demande requis' }, { status: 400 });
    }

    connection = await pool.getConnection();

    // Vérifier que la demande existe
    const [demandeCheck] = await connection.execute(
      'SELECT id_demande FROM demande WHERE id_demande = ?',
      [id_demande]
    );

    if ((demandeCheck as any[]).length === 0) {
      return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 });
    }

    // Récupérer tous les messages de cette discussion
    const [messages] = await connection.execute(
      `SELECT 
        d.id_discussion,
        d.id_demande,
        d.id_etudiant,
        d.id_encadrant,
        d.auteur_type,
        d.auteur_id,
        d.message,
        d.date_envoi,
        u.nom,
        u.prenom,
        u.email,
        u.role
      FROM discussion d
      JOIN utilisateur u ON u.id_utilisateur = d.auteur_id
      WHERE d.id_demande = ?
      ORDER BY d.date_envoi ASC`,
      [id_demande]
    );

    const discussionMessages = (messages as any[]) || [];

    return NextResponse.json({
      id_demande,
      messages: discussionMessages.map((msg) => ({
        id_discussion: msg.id_discussion,
        auteur_type: msg.auteur_type,
        auteur: {
          id: msg.auteur_id,
          nom: msg.nom,
          prenom: msg.prenom,
          email: msg.email,
          role: msg.role,
        },
        message: msg.message,
        date_envoi: msg.date_envoi,
      })),
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
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
