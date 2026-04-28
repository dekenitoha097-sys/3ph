import {pool} from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET(req:Request) {
    try {
        const [rows] = await pool.query("SELECT id_utilisateur as id, nom, prenom, email, CONCAT(prenom, ' ', nom) as name FROM utilisateur WHERE role IN ('encadrant', 'laboratoire','admin') ORDER BY nom ASC") as any;
        return NextResponse.json(rows || []);
    } catch (error) {
        console.error('Error fetching profs:', error);
        return NextResponse.json([], { status: 200 });
    }
}