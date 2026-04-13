import {pool} from '@/lib/db';

import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail } from '@/lib/send-mail';

type RegistrationRequest = {
    nom: string;
    prenom: string;
    sexe: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export async function POST(req:Request) {
    try {
        const {nom, prenom, sexe, email, password, password_confirmation} = await req.json() as RegistrationRequest; 
        
        if (!email.endsWith('@hestim.ma')) {
            return NextResponse.json({message: 'Veuillez utiliser une adresse email @hestim.ma'}, {status: 400});
        }
        if (password !== password_confirmation) {
            return NextResponse.json({message: 'Les mots de passe ne correspondent pas'}, {status: 400});
        }
        const [existingUser] = await pool.query('SELECT id_utilisateur FROM utilisateur WHERE email = ?', [email] );

        console.log('Existing user query result:', existingUser);
        if (Array.isArray(existingUser) && existingUser.length > 0) {
            return NextResponse.json({message: 'Cet email est déjà utilisé'}, {status: 400});
        }

        // Générer token de vérification email
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO utilisateur (nom, prenom, sexe, email, mot_de_passe, email_verified, email_token, email_token_expires) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nom, prenom, sexe, email, hashedPassword, false, tokenHash, expiresAt]
        );
        
        // Envoyer email de vérification
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
        
        try {
            await sendEmail({
                to: email,
                subject: 'Vérifiez votre adresse email - 3PH',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Bienvenue ${prenom} ${nom}!</h2>
                        <p>Merci de vous être inscrit. Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous:</p>
                        <p>
                            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
                                Vérifier mon email
                            </a>
                        </p>
                        <p>Ou copiez et collez ce lien dans votre navigateur:</p>
                        <p><code>${verificationLink}</code></p>
                        <p style="color: #666; font-size: 12px;">Ce lien expire dans 24 heures.</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email:', emailError);
            // Ne pas échouer l'inscription si l'email ne s'envoie pas
        }
        
        return NextResponse.json({message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.'}, {status: 200});

    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
    }
}