import { pool } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    id: number;
    role: string;
    email: string;
}


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
    let connection;
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

        connection = await pool.getConnection();

        // Récupère les query parameters
        const searchParams = request.nextUrl.searchParams;
        const filiere = searchParams.get('filiere');
        const annee = searchParams.get('annee');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const date_soumission = searchParams.get('date_soumission');

        // Construction de la query pour les demandes
        let query = `
            SELECT DISTINCT
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
            WHERE (
                d.id_laboratoire = ? 
                OR g.id_groupe IN (
                    SELECT id_groupe 
                    FROM encadrant_groupe 
                    WHERE id_encadrant = ?
                )
            )
        `;

        const params: any[] = [user.id, user.id];

        // Applique les filtres
        if (filiere) {
            query += ` AND g.filiere = ?`;
            params.push(filiere);
        }

        if (annee) {
            query += ` AND g.annee = ?`;
            params.push(annee);
        }

        if (status) {
            query += ` AND s.libelle = ?`;
            params.push(status);
        }

        if (search) {
            query += ` AND (d.titre LIKE ? OR d.description LIKE ? OR u_etudiant.nom LIKE ? OR u_etudiant.prenom LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (date_soumission) {
            query += ` AND DATE_FORMAT(d.date_soumission, '%Y-%m-%d') LIKE ?`;
            params.push(`${date_soumission}%`);
        }

        query += ` ORDER BY d.date_modification DESC`;

        const [demandes] = await connection.execute(query, params);

        return NextResponse.json({ 
            demandes: demandes || [], 
            count: (demandes as any[]).length 
        });

    } catch (error) {
        console.error('Erreur dans la route demandes-lab-encadrant:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

