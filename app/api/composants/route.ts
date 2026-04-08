import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [composants] = await pool.query(`
    SELECT
        c.id_composant,
        c.nom,
        c.reference,
        c.photo_lien AS image_url,
        c.existe,
        c.quantite AS disponibilite,
        c.commentaire AS description,
        c.Statut_Disponibilite AS statut_disponibilite,
        c.created_at
    FROM composant c WHERE existe = 1
`);
        return NextResponse.json({ composants });

    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nom, reference, photo_lien, quantite, commentaire } = body;
        if (!nom || !reference || quantite === undefined) {
            return NextResponse.json(
                { error: 'Données manquantes: nom, reference et quantite sont requis' },
                { status: 400 }
            );
        }

        const [result] = await pool.query(
            `INSERT INTO composant (nom, reference, photo_lien, quantite, commentaire, created_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [nom, reference, photo_lien || null, quantite, commentaire || null]
        );
        const id_composant = (result as any).insertId;

        return NextResponse.json({ message: 'Composant créé avec succès', id_composant }, { status: 201 });
    } catch (error) {
        console.error('Error creating composant:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }   
}