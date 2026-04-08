import {pool} from '@/lib/db';
import {NextResponse, NextRequest} from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: number;
  role: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
    try {
        // Récupère le token
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        // Vérifie et décode le token
        let user: DecodedToken;
        try {
            user = jwt.verify(token, JWT_SECRET) as DecodedToken;
        } catch (error) {
            return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
        }

        // Récupère les query parameters
        const searchParams = request.nextUrl.searchParams;
        const filiere = searchParams.get('filiere');
        const annee = searchParams.get('annee');
        const status = searchParams.get('status');
        const code_groupe = searchParams.get('code_groupe');
        const search = searchParams.get('search');
        const date_soumission = searchParams.get('date_soumission'); // Format: YYYY-MM-DD ou YYYY-MM ou YYYY

        // Récupère les demandes selon le rôle
        let query = `
            SELECT 
                d.id_demande,
                d.titre,
                d.description,
                d.progression,
                d.date_soumission,
                d.date_modification,
                s.libelle AS status,
                g.id_groupe,
                g.code_groupe,
                g.nom AS nom_groupe,
                g.filiere,
                g.annee,
                u_etudiant.nom AS nom_etudiant,
                u_etudiant.prenom AS prenom_etudiant,
                u_etudiant.email AS email_etudiant
            FROM demande d
            JOIN status s ON d.id_status = s.id_status
            JOIN groupe g ON d.id_groupe = g.id_groupe
            JOIN utilisateur u_etudiant ON d.id_etudiant = u_etudiant.id_utilisateur
            WHERE 1=1
        `;

        let params: any[] = [];

        // Filtre par rôle
        if (user.role === 'etudiant') {
            query += ' AND d.id_etudiant = ?';
            params.push(user.id);
        } else if (user.role === 'encadrant') {
            query += ' AND d.id_encadrant = ?';
            params.push(user.id);
        } else if (user.role === 'laboratoire') {
            query += ' AND d.id_laboratoire = ?';
            params.push(user.id);
        }
        // admin voit toutes les demandes

        // Filtres supplémentaires
        if (filiere) {
            query += ' AND g.filiere = ?';
            params.push(filiere);
        }

        if (annee) {
            query += ' AND g.annee = ?';
            params.push(annee);
        }

        if (status) {
            query += ' AND s.libelle = ?';
            params.push(status);
        }

        if (code_groupe) {
            query += ' AND g.code_groupe = ?';
            params.push(code_groupe);
        }

        if (search) {
            query += ' AND (d.titre LIKE ? OR d.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (date_soumission) {
            // Supporte YYYY, YYYY-MM, YYYY-MM-DD
            if (date_soumission.length === 4) {
                // Année seulement
                query += ' AND YEAR(d.date_soumission) = ?';
                params.push(parseInt(date_soumission));
            } else if (date_soumission.length === 7) {
                // Année-Mois
                query += ' AND DATE_FORMAT(d.date_soumission, "%Y-%m") = ?';
                params.push(date_soumission);
            } else {
                // Date complète
                query += ' AND DATE(d.date_soumission) = ?';
                params.push(date_soumission);
            }
        }

        query += ' ORDER BY d.date_soumission DESC';

        const [demandes]: any = await pool.query(query, params);

        return NextResponse.json({ demandes, count: demandes.length });

    } catch (error) {
        console.error('Error fetching demands:', error);
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