import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface ComposantDemande {
  id_composant: number;
  quantite_demandee: number;
}

interface CreateDemandeRequest {
  titre: string;
  description: string;
  id_groupe: number;
  id_etudiant: number;
  id_encadrant?: number | null;
  composants: ComposantDemande[];
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  let connection;
  try {
    const body: CreateDemandeRequest = await request.json();

    console.log('Body reçu:', JSON.stringify(body, null, 2));

    const { titre, description, id_groupe, id_etudiant, composants } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    let user: any;
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const [encadrantResult] = await pool.query(
      `SELECT id_encadrant FROM encadrant_groupe WHERE id_groupe = ?`,
      [id_groupe]
    );

    const id_encadrant = (encadrantResult as any[])[0]?.id_encadrant || null;

    console.log({
      titre: !!titre,
      description: !!description,
      id_groupe: typeof id_groupe,
      id_etudiant: typeof id_etudiant,
      composants: Array.isArray(composants) ? `Array de ${composants.length}` : typeof composants,
    });

    // Validation
    if (!titre || !description || !id_groupe || !id_etudiant || !composants || composants.length === 0) {
      return NextResponse.json(
        {
          error: 'Données manquantes: titre, description, id_groupe, id_etudiant et composants requis',
          received: { titre: !!titre, description: !!description, id_groupe, id_etudiant, composants: composants?.length }
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(composants)) {
      return NextResponse.json(
        { error: 'composants doit être un tableau' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // Démarrer une transaction
    await connection.beginTransaction();

    try {
      // 1. Insérer la demande avec status par défaut (1 = soumise)
      const [demandeResult] = await connection.execute(
        `INSERT INTO demande 
  (titre, description, id_groupe, id_status, id_etudiant, id_encadrant, date_soumission, date_modification, progression)
  VALUES (?, ?, ?, 1, ?, ?, NOW(), NOW(), 0)`,
        [
          titre || null,
          description || null,
          id_groupe ?? null,
          id_etudiant ?? null,
          id_encadrant ?? null
        ]
      );

      const id_demande = (demandeResult as any).insertId;

      if (!id_demande) {
        throw new Error('Impossible de créer la demande');
      }

      // 2. Insérer chaque composant dans ligne_demande
      for (const composant of composants) {
        const { id_composant, quantite_demandee } = composant;

        // Validation de chaque composant
        if (!id_composant || !quantite_demandee || quantite_demandee <= 0) {
          throw new Error(`Erreur dans composant: id_composant=${id_composant}, quantite=${quantite_demandee}`);
        }

        // Vérifier que le composant existe
        const [composantCheck] = await connection.execute(
          `SELECT id_composant FROM composant WHERE id_composant = ?`,
          [id_composant]
        );

        if ((composantCheck as any[]).length === 0) {
          throw new Error(`Composant ${id_composant} n'existe pas`);
        }

        // Insérer la ligne de demande
        await connection.execute(
          `INSERT INTO ligne_demande 
          (id_demande, id_composant, quantite_demandee, created_at)
          VALUES (?, ?, ?, NOW())`,
          [id_demande, id_composant, quantite_demandee]
        );
      }

      // Valider la transaction
      await connection.commit();

      return NextResponse.json(
        {
          success: true,
          id_demande,
          message: `Demande créée avec succès (${composants.length} composant(s))`,
        },
        { status: 201 }
      );
    } catch (transactionError) {
      // Rollback en cas d'erreur
      await connection.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error('Erreur lors de la création de la demande:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}