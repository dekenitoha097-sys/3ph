import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/send-mail';

/**
 * POST /api/discussions
 * Envoyer un nouveau message dans une discussion
 * Body: { id_demande, message }
 */

export async function POST(req: NextRequest) {
  let connection;
  try {
    // Récupérer le token pour identifier l'utilisateur
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Décoder le token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    let decoded: any;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const { id_demande, message } = await req.json() as {
      id_demande: string;
      message: string;
    };

    if (!id_demande || !message) {
      return NextResponse.json(
        { error: 'ID demande et message requis' },
        { status: 400 }
      );
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le message ne peut pas être vide' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // Récupérer la demande et vérifier les permissions
    const [demandeRows] = await connection.execute(
      'SELECT id_demande, id_etudiant, id_encadrant, titre FROM demande WHERE id_demande = ?',
      [id_demande]
    );

    if ((demandeRows as any[]).length === 0) {
      return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 });
    }

    const demande = (demandeRows as any[])[0];

    // Vérifier que l'utilisateur est soit l'étudiant, soit l'encadrant de cette demande
    const isEtudiant = decoded.id === demande.id_etudiant;
    const isEncadrant = decoded.id === demande.id_encadrant;

    if (!isEtudiant && !isEncadrant) {
      return NextResponse.json(
        { error: 'Vous n\'avez pas accès à cette discussion' },
        { status: 403 }
      );
    }

    // Déterminer le type d'auteur
    const auteur_type = isEtudiant ? 'etudiant' : 'encadrant';

    // Insérer le message
    await connection.execute(
      `INSERT INTO discussion 
       (id_demande, id_etudiant, id_encadrant, auteur_type, auteur_id, message, date_envoi)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        id_demande,
        demande.id_etudiant,
        demande.id_encadrant,
        auteur_type,
        decoded.id,
        message,
      ]
    );

    // Récupérer le message inséré
    const [newMessage] = await connection.execute(
      `SELECT 
        d.id_discussion,
        d.auteur_type,
        d.auteur_id,
        d.message,
        d.date_envoi,
        u.nom,
        u.prenom,
        u.email
      FROM discussion d
      JOIN utilisateur u ON u.id_utilisateur = d.auteur_id
      WHERE d.id_discussion = LAST_INSERT_ID()`
    );

    const msg = (newMessage as any[])[0];

    // Récupérer les infos du destinataire (l'autre personne)
    const recipientId = isEtudiant ? demande.id_encadrant : demande.id_etudiant;
    const [recipientRows] = await connection.execute(
      'SELECT email, nom, prenom FROM utilisateur WHERE id_utilisateur = ?',
      [recipientId]
    );

    const recipient = (recipientRows as any[])[0];

    // Envoyer un email au destinataire (en arrière-plan, ne pas bloquer la réponse)
    if (recipient && recipient.email) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const demandLink = `${appUrl}/dashboard/all-demands/${id_demande}`;

      const senderType = isEtudiant ? 'L\'étudiant' : 'L\'encadrant';
      const senderName = `${msg.prenom} ${msg.nom}`;

      const emailSubject = `Nouveau message${isEtudiant ? ' de l\'étudiant' : ' de l\'encadrant'} - Demande #${id_demande}`;

      const emailHtml = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
            .card { background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { border-bottom: 2px solid #007bff; margin-bottom: 20px; padding-bottom: 10px; }
            .header h2 { margin: 0; color: #333; }
            .content { margin: 20px 0; line-height: 1.6; }
            .sender { color: #666; font-weight: bold; }
            .message { background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 15px 0; border-radius: 4px; }
            .button { display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            .button:hover { background-color: #0056b3; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            .demand-info { background-color: #e8f4f8; padding: 15px; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <h2>📬 Nouveau message reçu</h2>
              </div>
              
              <div class="content">
                <p>Bonjour <strong>${recipient.prenom} ${recipient.nom}</strong>,</p>
                
                <p>${senderType} <span class="sender">${senderName}</span> a envoyé un nouveau message dans la discussion.</p>
                
                <div class="demand-info">
                  <strong>📋 ${demande.titre}</strong>
                  <p style="margin: 10px 0 0 0;">Une nouvelle notification concernant cette demande.</p>
                </div>

                <div class="message">
                  <p><strong>${msg.prenom} ${msg.nom}:</strong></p>
                  <p>${msg.message.replace(/\n/g, '<br>')}</p>
                </div>

                <p style="margin-top: 20px;">
                  <a href="${demandLink}" class="button">Voir la discussion complète</a>
                </p>
              </div>
              
              <div class="footer">
                <p>Cet email a été généré automatiquement. Veuillez ne pas répondre à cet email.</p>
                <p>© 2026 ESTIM - Système de gestion des demandes</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Envoyer l'email en arrière-plan (sans bloquer)
      sendEmail({
        to: recipient.email,
        subject: emailSubject,
        html: emailHtml,
        text: `${senderType} ${senderName} a envoyé un message.\n\n"${msg.message}"\n\nVoyez la discussion: ${demandLink}`,
        demandTitle: demande.titre,
        demandId: parseInt(id_demande as string),
      }).catch(err => {
        console.error('Erreur lors de l\'envoi de l\'email:', err);
        // On n'arrête pas l'exécution si l'email échoue
      });
    }

    return NextResponse.json({
      success: true,
      message: {
        id_discussion: msg.id_discussion,
        auteur_type: msg.auteur_type,
        auteur: {
          id: msg.auteur_id,
          nom: msg.nom,
          prenom: msg.prenom,
          email: msg.email,
        },
        message: msg.message,
        date_envoi: msg.date_envoi,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
