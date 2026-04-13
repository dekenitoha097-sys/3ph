import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

const VALID_ROLES = ['etudiant', 'encadrant', 'laboratoire', 'admin'];

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { role } = await req.json();

        // Validation
        if (!id || !role) {
            return NextResponse.json(
                { error: "ID utilisateur et rôle requis" },
                { status: 400 }
            );
        }

        if (!VALID_ROLES.includes(role)) {
            return NextResponse.json(
                { error: "Rôle invalide" },
                { status: 400 }
            );
        }

        // Vérifier que l'utilisateur existe
        const [userRows] = await pool.query(
            "SELECT id_utilisateur, role FROM utilisateur WHERE id_utilisateur = ?",
            [id]
        ) as any;

        if (userRows.length === 0) {
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        const currentRole = userRows[0].role;

        // Vérifier que le rôle est différent
        if (currentRole === role) {
            return NextResponse.json(
                { error: "Le nouveau rôle doit être différent du rôle actuel" },
                { status: 400 }
            );
        }

        // Mettre à jour le rôle
        await pool.query(
            "UPDATE utilisateur SET role = ? WHERE id_utilisateur = ?",
            [role, id]
        );

        return NextResponse.json(
            { message: "Rôle modifié avec succès", role },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erreur lors de la modification du rôle:', error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
