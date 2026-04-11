import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim() || '';

    let query = `
      SELECT DISTINCT id_groupe, code_groupe 
      FROM groupe
    `;

    let params: any[] = [];

    if (search) {
      query += ` WHERE code_groupe LIKE ?`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY code_groupe ASC`;

    const [groupes] = await pool.query(query, params) as any;

    return NextResponse.json({
      groupes: groupes.map((row: any) => row.code_groupe),
    });

  } catch (error) {
    console.error('Error fetching groupes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
