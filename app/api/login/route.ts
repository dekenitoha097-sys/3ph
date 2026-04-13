import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
            if (err) {
                reject(err as Error);
            } else {
                resolve(isMatch as boolean);
            }
        });
    });
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json() as { email: string, password: string };

        if (!email.endsWith('@hestim.ma')) {
            return NextResponse.json(
                { message: 'Veuillez utiliser une adresse email @hestim.ma' },
                { status: 400 }
            );
        }

        if (!password || password.length < 6) {
            return NextResponse.json(
                { message: 'Le mot de passe doit contenir au moins 6 caractères' },
                { status: 400 }
            );
        }

        const [rows]: any = await pool.query(
            'SELECT id_utilisateur,nom,prenom, id_groupe ,mot_de_passe,role,email ,sexe,email_verified FROM utilisateur WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { message: 'Email ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        const user = rows[0];

        const isMatch = await comparePasswords(password, user.mot_de_passe);

        if (!isMatch) {
            return NextResponse.json(
                { message: 'Email ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        // Vérifier que l'email a été confirmé
        if (!user.email_verified) {
            return NextResponse.json(
                { message: 'Veuillez vérifier votre email avant de vous connecter' },
                { status: 401 }
            );
        }

        // GENERATION DU TOKEN
        const token = jwt.sign(
            {
                id: user.id_utilisateur,
                id_etudiant: user.id_utilisateur,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role,
                sexe: user.sexe
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '7d' // Le token expire après 7 jours
            }
        );

        const response = NextResponse.json(
            { message: 'Connexion réussie' },
            { status: 200 }
        );

        // 🔐 Stocker dans un cookie sécurisé
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });

        return response;

    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}