import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  demandTitle?: string; // Titre de la demande (optionnel)
  demandId?: number; // ID de la demande (optionnel)
}

interface SendEmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  demandTitle,
  demandId,
}: SendEmailOptions): Promise<SendEmailResponse> {
  try {
    // Validation des entrées
    if (!to || !to.includes("@")) {
      return {
        success: false,
        message: "Adresse email destinataire invalide",
        error: "Invalid recipient email",
      };
    }

    if (!subject || subject.trim().length === 0) {
      return {
        success: false,
        message: "Le sujet ne peut pas être vide",
        error: "Subject is required",
      };
    }

    if ((!text || text.trim().length === 0) && (!html || html.trim().length === 0)) {
      return {
        success: false,
        message: "Le contenu du message ne peut pas être vide",
        error: "Text or HTML content is required",
      };
    }

    // Validation des variables d'environnement
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error("Variables d'environnement EMAIL_USER ou EMAIL_PASS non configurées");
      return {
        success: false,
        message: "Erreur de configuration serveur",
        error: "Email service not configured",
      };
    }

    // Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      pool: {
        maxConnections: 1,
        maxMessages: Infinity,
        rateDelta: 20000, // 20 secondes entre les emails
        rateLimit: 5, // Max 5 emails par 20 secondes
      },
    });

    // Vérifier la connexion
    await transporter.verify();

    // Options de l'email
    const mailOptions = {
      from: emailUser,
      to,
      subject,
      text: text || undefined,
      html: html || undefined,
      replyTo: emailUser,
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email envoyé avec succès à ${to} - ID: ${info.messageId}`);

    return {
      success: true,
      message: `Email envoyé avec succès à ${to}`,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Erreur lors de l'envoi de l'email:", errorMessage);

    return {
      success: false,
      message: "Erreur lors de l'envoi de l'email",
      error: errorMessage,
    };
  }
}
