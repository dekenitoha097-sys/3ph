import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/send-mail";
import crypto from "crypto";

const subjectType = "Réinitialisation de mot de passe";
const senderName = "3PH";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const [rows] = await pool.query("SELECT id_utilisateur FROM utilisateur WHERE email = ?", [email]) as any;
        
        if (rows.length === 0) {
            return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
        }

        const userId = rows[0].id_utilisateur;

        // Générer un token sécurisé
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

        // Sauvegarder le token en base de données
        await pool.query(
            "UPDATE utilisateur SET reset_token = ?, reset_token_expires = ? WHERE id_utilisateur = ?",
            [tokenHash, expiresAt, userId]
        );

        // Créer le lien de réinitialisation
        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

        // Construire l'email HTML
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
                <p>Bonjour,</p>
                <p>Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                <p style="margin: 20px 0;">
                    <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Réinitialiser mon mot de passe
                    </a>
                </p>
                <p style="color: #666; font-size: 14px;">
                    Ce lien expirera dans 24 heures.
                </p>
                <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe restera inchangé.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">
                    Cordialement,<br/>
                    <strong>${senderName}</strong><br/>
                    Système de gestion des demandes de projet de fin d'études
                </p>
            </div>
        `;

        // Envoyer l'email
        await sendEmail({
            to: email,
            subject: subjectType,
            html: emailHtml,
            text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}\n\nCe lien expirera dans 24 heures.`,
        }).catch(err => {
            console.error('Erreur lors de l\'envoi de l\'email:', err);
        });

        return NextResponse.json(
            { message: "Un email de réinitialisation a été envoyé" },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur dans forget-password:', error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors du traitement de votre demande" },
            { status: 500 }
        );
    }
}