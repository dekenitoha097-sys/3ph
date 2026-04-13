import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, newPassword, confirmPassword } = await req.json();

        // Validation
        if (!token || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: "Token and passwords are required" },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: "Les mots de passe ne correspondent pas" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Le mot de passe doit contenir au moins 6 caractères" },
                { status: 400 }
            );
        }

        // Hasher le token reçu pour le comparer avec celui en BD
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Chercher l'utilisateur avec ce token
        const [rows] = await pool.query(
            "SELECT id_utilisateur FROM utilisateur WHERE reset_token = ? AND reset_token_expires > NOW()",
            [tokenHash]
        ) as any;

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Token invalide ou expiré" },
                { status: 400 }
            );
        }

        const userId = rows[0].id_utilisateur;

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe et supprimer le token
        await pool.query(
            "UPDATE utilisateur SET mot_de_passe = ?, reset_token = NULL, reset_token_expires = NULL WHERE id_utilisateur = ?",
            [hashedPassword, userId]
        );

        return NextResponse.json(
            { message: "Mot de passe réinitialisé avec succès" },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur dans reset-password:', error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de la réinitialisation" },
            { status: 500 }
        );
    }
}
