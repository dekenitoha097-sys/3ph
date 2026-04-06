import { cookies } from 'next/headers';
import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: number;
  role: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    // Récupère le token des cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    // Vérifie et décode le token
    let user: DecodedToken;
    try {
      user = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }

    // Vérifie que l'utilisateur a le rôle 'laboratoire'
    if (user.role !== 'laboratoire') {
      return NextResponse.json(
        { error: 'Seuls les laboratoires peuvent accéder à ces statistiques' },
        { status: 403 }
      );
    }

    // Récupère les statistiques du labo
    const [stats]: any = await pool.query(
      'SELECT * FROM laboratoire_dashboard_stats WHERE id_utilisateur = ?',
      [user.id]
    );

    if (!stats || stats.length === 0) {
      return NextResponse.json(
        { error: 'Aucune statistique disponible pour ce laboratoire' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ...stats[0],
        message: 'Statistiques du laboratoire récupérées avec succès',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}