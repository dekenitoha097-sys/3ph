import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
            if (err) reject(err);
            resolve(isMatch === true);
        });
    });
}

export async function POST(request: Request) {
    try {
        // Récupérer et vérifier le token
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        } catch (err) {
            return NextResponse.json(
                { error: 'Token invalide' },
                { status: 401 }
            );
        }

        const userId = decoded.id;
        const body = await request.json();
        const { currentPassword, newPassword, confirmPassword } = body;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 6 caractères' },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: 'Les mots de passe ne correspondent pas' },
                { status: 400 }
            );
        }

        if (currentPassword === newPassword) {
            return NextResponse.json(
                { error: 'Le nouveau mot de passe doit être différent de l\'ancien' },
                { status: 400 }
            );
        }

        // Récupérer l'utilisateur
        const [rows]: any = await pool.query(
            'SELECT mot_de_passe FROM utilisateur WHERE id_utilisateur = ?',
            [userId]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        // Vérifier le mot de passe actuel
        const isMatch = await comparePasswords(currentPassword, rows[0].mot_de_passe);

        if (!isMatch) {
            return NextResponse.json(
                { error: 'Le mot de passe actuel est incorrect' },
                { status: 400 }
            );
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe
        await pool.query(
            'UPDATE utilisateur SET mot_de_passe = ? WHERE id_utilisateur = ?',
            [hashedPassword, userId]
        );

        return NextResponse.json({
            message: 'Mot de passe mis à jour avec succès',
        });

    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
