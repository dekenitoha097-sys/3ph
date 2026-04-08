import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
    id: number;
    role: string;
    email: string;
};

export async function GET(req: Request) {
    try {
        const query = 'SELECT DISTINCT annee FROM groupe;';
        const [rows] = await pool.query(query);
        return NextResponse.json(rows);

    } catch (error) {
        console.error('Error fetching années:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des années' }, { status: 500 });
    }
}