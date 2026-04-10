import { pool } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const { id_demande, id_status, progression } = await request.json() as { id_demande: number, id_status: number, progression: number };

        if (!id_status || typeof id_status !== 'number') {
            return NextResponse.json(
                { message: 'L\'ID du statut est requis' },
                { status: 400 }
            );
        }

        await pool.query("UPDATE demande SET id_status = ? WHERE id_demande = ?", [id_status, id_demande]);
        await pool.query("UPDATE demande SET progression = ? WHERE id_demande = ?", [progression, id_demande]);

        return NextResponse.json(
            { message: 'Demande mise à jour avec succès' },
            { status: 200 }
        );



    } catch (error) {
        return NextResponse.json(
            { message: "Erreur lors de la mise à jour de la demande" },
            { status: 500 }
        );
    }
}