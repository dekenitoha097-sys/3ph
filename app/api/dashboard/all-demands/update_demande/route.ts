import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id_demande?: number | string;
      id_status?: number | string;
      progression?: number | string;
    };

    const idDemande = Number(body.id_demande);
    const idStatus = Number(body.id_status);
    const progression = Number(body.progression);

    if (!Number.isInteger(idDemande) || idDemande <= 0) {
      return NextResponse.json({ message: 'L\'ID de la demande est requis' }, { status: 400 });
    }

    if (!Number.isInteger(idStatus) || idStatus <= 0) {
      return NextResponse.json({ message: 'L\'ID du statut est requis' }, { status: 400 });
    }

    if (!Number.isFinite(progression) || progression < 0 || progression > 100) {
      return NextResponse.json({ message: 'La progression doit être comprise entre 0 et 100' }, { status: 400 });
    }

    await pool.query(
      'UPDATE demande SET id_status = ?, progression = ?, date_modification = NOW() WHERE id_demande = ?',
      [idStatus, progression, idDemande]
    );

    return NextResponse.json(
      { message: 'Demande mise à jour avec succès', progression, id_status: idStatus },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la demande:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la demande' },
      { status: 500 }
    );
  }
}