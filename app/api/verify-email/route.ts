import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { error: "Token requis" },
                { status: 400 }
            );
        }

        // Hasher le token reçu pour le comparer avec celui en BD
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Chercher l'utilisateur avec ce token
        const [rows] = await pool.query(
            "SELECT id_utilisateur, email FROM utilisateur WHERE email_token = ? AND email_token_expires > NOW()",
            [tokenHash]
        ) as any;

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Token invalide ou expiré" },
                { status: 400 }
            );
        }

        const userId = rows[0].id_utilisateur;

        // Marquer l'email comme vérifié et supprimer le token
        await pool.query(
            "UPDATE utilisateur SET email_verified = TRUE, email_token = NULL, email_token_expires = NULL WHERE id_utilisateur = ?",
            [userId]
        );

        return NextResponse.json(
            { message: "Email vérifié avec succès" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erreur dans verify-email:', error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
