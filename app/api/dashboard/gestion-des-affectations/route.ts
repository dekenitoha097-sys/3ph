import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { id_groupe, id_encadrant } = await req.json();

        await pool.query("INSERT INTO encadrant_groupe (id_groupe, id_encadrant) VALUES (?, ?)", [id_groupe, id_encadrant]);
        return NextResponse.json({ message: "Affectation successful" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "An error occurred while fetching data" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.id_utilisateur,
                u.nom,
                u.prenom,
                u.email,
                g.id_groupe,
                g.code_groupe,
                g.filiere
            FROM utilisateur AS u
            INNER JOIN encadrant_groupe AS eg 
                ON u.id_utilisateur = eg.id_encadrant
            INNER JOIN groupe AS g 
                ON g.id_groupe = eg.id_groupe;
        `);

        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while fetching data", err: error },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { id_encadrant, id_groupe } = await req.json();

        if (!id_encadrant || !id_groupe) {
            return NextResponse.json(
                { error: "id_encadrant et id_groupe sont requis" },
                { status: 400 }
            );
        }

        const result = await pool.query(
            "DELETE FROM encadrant_groupe WHERE id_encadrant = ? AND id_groupe = ?",
            [id_encadrant, id_groupe]
        ) as any;

        if (result[0].affectedRows === 0) {
            return NextResponse.json(
                { error: "Affectation non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Affectation supprimée avec succès" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la suppression", err: error },
            { status: 500 }
        );
    }
}