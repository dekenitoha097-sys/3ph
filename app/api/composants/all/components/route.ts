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
        c.type,
        c.created_at
    FROM composant c 
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
