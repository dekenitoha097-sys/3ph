import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get('type')?.trim() || '';
        const typeCondition = (type === 'LABO' || type === '3PH') ? `AND c.type = '${type}'` : '';

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
    FROM composant c WHERE existe = 1 ${typeCondition}
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
        const { nom, reference, photo_lien, quantite, commentaire, type } = body;
        if (!nom || !reference || quantite === undefined) {
            return NextResponse.json(
                { error: 'Données manquantes: nom, reference et quantite sont requis' },
                { status: 400 }
            );
        }

        const typeValue = ['LABO', '3PH'].includes(type) ? type : 'LABO';

        const [result] = await pool.query(
            `INSERT INTO composant (nom, reference, photo_lien, quantite, commentaire, type, created_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [nom, reference, photo_lien || null, quantite, commentaire || null, typeValue]
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

export async function PUT(request: Request) {
    let connection;

    try {
        const body = await request.json();
        const idDemande = Number(body?.id_demande);

        if (!Number.isInteger(idDemande) || idDemande <= 0) {
            return NextResponse.json(
                { error: 'L\'ID de la demande est requis' },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [lines] = await connection.execute(
            'SELECT id_composant, quantite_demandee FROM ligne_demande WHERE id_demande = ?',
            [idDemande]
        );

        const ligneDemandes = Array.isArray(lines) ? lines as Array<{ id_composant: number; quantite_demandee: number }> : [];

        if (ligneDemandes.length === 0) {
            await connection.rollback();
            return NextResponse.json(
                { message: 'Aucune ligne de demande trouvée pour cette récupération' },
                { status: 404 }
            );
        }

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

            const composants = Array.isArray(composantRows) ? composantRows as Array<{ quantite: number }> : [];

            if (composants.length === 0) {
                continue;
            }

            const stockActuel = Number(composants[0].quantite || 0);
            const nouveauStock = Math.max(0, stockActuel - quantiteDemandee);

            await connection.execute(
                'UPDATE composant SET quantite = ? WHERE id_composant = ?',
                [nouveauStock, idComposant]
            );
        }

        await connection.commit();

        return NextResponse.json({
            message: 'Stocks des composants mis à jour avec succès',
            id_demande: idDemande,
        }, { status: 200 });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error('Error updating composant stocks:', error);
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

