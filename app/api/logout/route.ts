import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();
    
    // Effacer le cookie du token
    cookieStore.delete('token');

    return new Response(
        JSON.stringify({ message: 'Déconnexion réussie' }),
        { status: 200 }
    );
}
