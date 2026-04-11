
import {pool} from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
    try {
        // Récupère le token depuis les cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'Authentification requise' },
                { status: 401 }
            );
        }

        // Vérifie et décode le JWT
        let user: any;
        try {
            user = jwt.verify(token, JWT_SECRET);
        } catch {
            return NextResponse.json(
                { message: 'Token invalide' },
                { status: 401 }
            );
        }

        // Vérifie que l'utilisateur est un étudiant
        if (user.role !== 'etudiant') {
            return NextResponse.json(
                { message: 'Accès refusé: non autorisé' },
                { status: 403 }
            );
        }

        // Récupère les stats pour cet étudiant spécifiquement
        const [stats]: any = await pool.query(
            'SELECT * FROM etudiant_dashboard_stats WHERE id_utilisateur = ?',
            [user.id]
        );

        if (!stats || stats.length === 0) {
            return NextResponse.json(
                { message: 'Aucune statistique disponible', stats: {} },
                { status: 200 }
            );
        }

        // Retourne uniquement les stats de l'étudiant (premier et unique résultat)
        return NextResponse.json(
            { message: 'Statistiques récupérées avec succès', stats: stats[0] },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching stats:', error);
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