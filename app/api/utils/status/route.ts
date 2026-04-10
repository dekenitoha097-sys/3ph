import { pool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: number;
  role: string; // 🔥 on laisse string pour éviter crash si différent
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request: NextRequest) {
  try {
    // 🔐 Vérification du token
    const cookieStore = await cookies(); // ✅ pas de await
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 401 }
      );
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET non défini");
    }

    let user: DecodedToken;

    try {
      user = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (err) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 401 }
      );
    }

    console.log("USER:", user); // 🔍 debug

    // 🔥 normaliser le role
    const role = user.role?.toLowerCase();

    let query = "";
    let params: string[] = [];

    // 🎯 Gestion des rôles CORRIGÉE
    switch (role) {
      case "etudiant":
        query = "SELECT id_status, libelle FROM status";
        break;

      case "encadrant":
        query = `
          SELECT id_status, libelle 
          FROM status 
          WHERE libelle IN (?, ?, ?)
        `;
        params = ["en_attente", "valide", "en_revision"];
        break;

      case "admin":
        query = "SELECT id_status, libelle FROM status";
        break;

      case "laboratoire":
        query = `
          SELECT id_status, libelle
          FROM status
          WHERE libelle IN (?,?,?)
        `;
        params = ["pret","recupere", "valide"];
        break;

      default:
        return NextResponse.json(
          { error: "Rôle non autorisé" },
          { status: 403 }
        );
    }

    console.log("QUERY:", query);
    console.log("PARAMS:", params);

    let rows;

    if (params.length > 0) {
      [rows] = await pool.query(query, params);
    } else {
      [rows] = await pool.query(query);
    }

    return NextResponse.json({ status: rows });

  } catch (error: any) {
    console.error("Erreur GET /status:", error);

    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}