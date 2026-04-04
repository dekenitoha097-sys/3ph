import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value;

    if (!token) {
        return new Response(
            JSON.stringify({ message: "Non autorisé" }),
            { status: 401 }
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        return new Response(
            JSON.stringify({ user: decoded }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Token invalide" }),
            { status: 401 }
        );
    }
}