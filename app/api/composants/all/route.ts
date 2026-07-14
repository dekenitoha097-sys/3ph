import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        // Récupérer les paramètres de filtre
        const search = searchParams.get('search')?.trim() || '';
        const status = searchParams.get('status')?.trim() || ''; // DIS, IND, EN_ATTENTE
        const minQuantite = searchParams.get('minQuantite');
        const maxQuantite = searchParams.get('maxQuantite');
        const existe = searchParams.get('existe'); // true, false
        const type = searchParams.get('type'); // LABO, 3PH
        const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
        const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

        // Construire les conditions WHERE
        let whereConditions = [];
        let params: (string | number)[] = [];

        // Filtre recherche (nom ou référence)
        if (search) {
            whereConditions.push(`(c.nom LIKE ? OR c.reference LIKE ?)`);
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        // Filtre statut disponibilité
        if (status && ['DIS', 'IND', 'EN_ATTENTE'].includes(status)) {
            whereConditions.push(`c.Statut_Disponibilite = ?`);
            params.push(status);
        }

        // Filtre quantité minimale
        if (minQuantite && !isNaN(Number(minQuantite))) {
            whereConditions.push(`c.quantite >= ?`);
            params.push(Number(minQuantite));
        }

        // Filtre quantité maximale
        if (maxQuantite && !isNaN(Number(maxQuantite))) {
            whereConditions.push(`c.quantite <= ?`);
            params.push(Number(maxQuantite));
        }

        // Filtre existe (catalog vs student-created)
        if (existe === 'true' || existe === 'false') {
            const existValue = existe === 'true' ? 1 : 0;
            whereConditions.push(`c.existe = ?`);
            params.push(existValue);
        }

        // Filtre type (LABO, 3PH)
        if (type === 'LABO' || type === '3PH') {
            whereConditions.push(`c.type = ?`);
            params.push(type);
        }

        const whereClause = whereConditions.length > 0 
            ? `WHERE ${whereConditions.join(' AND ')}`
            : '';

        // Requête pour compter le total (avant pagination)
        const countQuery = `
            SELECT COUNT(*) AS total FROM composant c ${whereClause}
        `;

        const [[{ total }]] = await pool.query(countQuery, params) as any;

        // Requête principale avec pagination
        const query = `
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
            ${whereClause}
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const composantParams = [...params, limit, offset];
        const [composants] = await pool.query(query, composantParams);

        return NextResponse.json({
            composants,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total
            }
        });

    } catch (error) {
        console.error('Error fetching composants:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}