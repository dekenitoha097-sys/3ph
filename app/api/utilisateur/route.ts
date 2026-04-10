import {pool} from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET as string) as any;
        } catch (err) {
            return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
        }

        const role = decoded.role;
        
        // Vérifier que l'utilisateur est admin
        if (role !== 'admin') {
            return NextResponse.json({ error: 'Accès refusé - Admin uniquement' }, { status: 403 });
        }

        // Récupérer les paramètres de filtrage
        const url = new URL(request.url);
        const searchNom = url.searchParams.get('nom')?.trim() || '';
        const searchPrenom = url.searchParams.get('prenom')?.trim() || '';
        const searchEmail = url.searchParams.get('email')?.trim() || '';
        const searchRole = url.searchParams.get('role')?.trim() || '';

        // Construire la requête SQL avec filtres
        let query = 'SELECT id_utilisateur, nom, prenom, email, role, created_at FROM utilisateur WHERE 1=1';
        const params: any[] = [];

        if (searchNom) {
            query += ' AND nom LIKE ?';
            params.push(`%${searchNom}%`);
        }

        if (searchPrenom) {
            query += ' AND prenom LIKE ?';
            params.push(`%${searchPrenom}%`);
        }

        if (searchEmail) {
            query += ' AND email LIKE ?';
            params.push(`%${searchEmail}%`);
        }

        if (searchRole) {
            query += ' AND role = ?';
            params.push(searchRole);
        }

        query += ' ORDER BY nom ASC, prenom ASC';

        // Exécuter la requête
        let rows;
        if (params.length > 0) {
            [rows] = await pool.query(query, params);
        } else {
            [rows] = await pool.query(query);
        }

        return NextResponse.json({
            utilisateurs: rows,
            total: (rows as any[]).length,
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des utilisateurs' }, { status: 500 });
    }
}