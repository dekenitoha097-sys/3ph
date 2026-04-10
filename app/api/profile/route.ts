import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function GET() {
    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value;

    if (!token) {
        return new Response(
            JSON.stringify({ message: "Non autorisé" }),
            { status: 401 }
        );
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        // Récupérer les données mises à jour de la base de données
        const [rows]: any = await pool.query(
            'SELECT id_utilisateur, id_groupe FROM utilisateur WHERE id_utilisateur = ?',
            [decoded.id]
        );

        if (rows.length === 0) {
            return new Response(
                JSON.stringify({ message: "Utilisateur non trouvé" }),
                { status: 404 }
            );
        }

        const userData = rows[0];

        // Combiner les données du token avec les données de la base de données
        const user = {
            ...decoded,
            id_groupe: userData.id_groupe
        };

        return new Response(
            JSON.stringify({ user }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Token invalide" }),
            { status: 401 }
        );
    }
}