import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  try {

    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: 'JWT_SECRET manquant' },
        { status: 500 }
      );
    }

    // ✅ COOKIE SAFE WAY
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 401 }
      );
    }

    let user: any;

    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    if (user.role !== 'laboratoire') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const [stats]: any = await pool.query(
      'SELECT * FROM laboratoire_dashboard_stats'
    );

    return NextResponse.json({
      data: stats[0]
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}