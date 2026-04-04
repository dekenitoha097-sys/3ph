import {pool} from '@/lib/db';

import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';

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

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO utilisateur (nom, prenom, sexe, email, mot_de_passe) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, sexe, email, hashedPassword]
        );
        
        return NextResponse.json({message: 'Inscription réussie'}, {status: 200});

    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
    }
}