import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filiere = searchParams.get('filiere') || '';
    const annee = searchParams.get('annee') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const dateSoumission = searchParams.get('date_soumission') || '';

    let query = `
      SELECT
        rc.id_recuperation,
        rc.id_demande,
        rc.id_groupe,
        d.titre,
        d.description,
        g.code_groupe,
        g.nom AS nom_groupe,
        g.filiere,
        g.annee,
        u.nom AS nom_etudiant,
        u.prenom AS prenom_etudiant,
        u.email AS email_etudiant,
        rc.date_recuperation,
        rc.date_retour,
        rc.statut
      FROM recuperation_composant rc
      LEFT JOIN demande d ON rc.id_demande = d.id_demande
      LEFT JOIN groupe g ON rc.id_groupe = g.id_groupe
      LEFT JOIN utilisateur u ON d.id_etudiant = u.id_utilisateur
      WHERE 1 = 1
    `;

    const params: Array<string | number> = [];

    if (filiere) {
      query += ' AND g.filiere = ?';
      params.push(filiere);
    }

    if (annee) {
      query += ' AND g.annee = ?';
      params.push(annee);
    }

    if (status) {
      query += ' AND rc.statut = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (d.titre LIKE ? OR d.description LIKE ? OR g.nom LIKE ? OR u.nom LIKE ? OR u.prenom LIKE ?)';
      const searchValue = `%${search}%`;
      params.push(searchValue, searchValue, searchValue, searchValue, searchValue);
    }

    if (dateSoumission) {
      query += ' AND DATE(rc.date_recuperation) = ?';
      params.push(dateSoumission);
    }

    query += ' ORDER BY rc.date_recuperation DESC';

    const [rows] = await pool.query(query, params);

    return NextResponse.json({ recuperation_composant: rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching recuperations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      {
        message: 'Erreur serveur',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id_demande,
      id_groupe,
      date_recuperation,
      date_retour,
      statut = 'RECUPERE',
    } = body;

    if (!id_demande || !id_groupe) {
      return NextResponse.json(
        { message: 'id_demande et id_groupe sont requis' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      `
        INSERT INTO recuperation_composant (
          id_demande,
          id_groupe,
          date_recuperation,
          date_retour,
          statut
        ) VALUES (?, ?, ?, ?, ?)
      `,
      [
        Number(id_demande),
        Number(id_groupe),
        date_recuperation || new Date(),
        date_retour || null,
        statut,
      ]
    );

    return NextResponse.json(
      {
        message: 'Récupération ajoutée avec succès',
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating recuperation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      {
        message: 'Erreur serveur',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
