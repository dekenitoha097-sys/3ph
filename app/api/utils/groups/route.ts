import {pool} from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET(req:Request) {
    try {
        const [rows] = await pool.query("SELECT id_groupe as id, code_groupe as name FROM groupe ORDER BY code_groupe ASC") as any;
        return NextResponse.json(rows || []);
    } catch (error) {
        console.error('Error fetching groups:', error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(req: Request) {
    try {
        const { code_groupe, filiere, annee } = await req.json();

        if (!code_groupe || !filiere || !annee) {
            return NextResponse.json(
                { error: "code_groupe, filiere et annee sont requis" },
                { status: 400 }
            );
        }

        const [result] = await pool.query(
            "INSERT INTO groupe (code_groupe, filiere, annee) VALUES (?, ?, ?)",
            [code_groupe, filiere, annee]
        ) as any;

        return NextResponse.json({
            id: result.insertId,
            code_groupe,
            filiere,
            annee,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating group:', error);
        return NextResponse.json(
            { error: "Erreur lors de la création du groupe" },
            { status: 500 }
        );
    }
}