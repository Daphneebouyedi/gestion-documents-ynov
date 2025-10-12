"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Send email using SendGrid API
 * Note: You need to set SENDGRID_API_KEY in your Convex environment variables
 */
export const sendBulletinConfirmationEmail = action({
  args: {
    toEmail: v.string(),
    toName: v.string(),
    nom: v.string(),
    prenom: v.string(),
    promotion: v.string(),
    specialite: v.string(),
    anneeScolaire: v.string(),
    dateEdition: v.string(),
  },
  handler: async (ctx, args) => {
    // SendGrid API Key from environment variable
    const SENDGRID_API_KEY = process.env.SENGDRID;
    
    if (!SENDGRID_API_KEY) {
      console.error("SENGDRID environment variable not configured");
      throw new Error("Email service not configured. Please set SENGDRID in Convex environment variables.");
    }

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 20px; margin: 0; }
    .container { max-width: 700px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #4ECDC4 0%, #003366 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 40px; }
    .greeting { font-size: 16px; margin-bottom: 20px; }
    .info-section { background: #f8f9fa; border-left: 4px solid #4ECDC4; padding: 20px; margin: 25px 0; }
    .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: bold; color: #003366; min-width: 180px; }
    .info-value { color: #333; }
    .highlight-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; }
    .highlight-box p { margin: 8px 0; }
    .highlight-box strong { color: #003366; }
    .signature { margin-top: 30px; line-height: 1.8; }
    .signature strong { color: #003366; }
    .footer { background: #003366; color: white; padding: 25px; text-align: center; font-size: 12px; line-height: 1.8; }
    .footer p { margin: 5px 0; opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 YNOV CAMPUS</h1>
      <p>Maroc - Casablanca</p>
    </div>
    
    <div class="content">
      <p class="greeting">Bonjour <strong>${args.prenom} ${args.nom}</strong>,</p>
      
      <p>Nous avons bien reçu votre demande de bulletin de notes.</p>
      
      <div class="info-section">
        <h3 style="margin-top: 0; color: #003366;">📋 Informations de la demande</h3>
        <div class="info-row">
          <span class="info-label">Nom :</span>
          <span class="info-value">${args.nom}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Prénom :</span>
          <span class="info-value">${args.prenom}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Promotion :</span>
          <span class="info-value">${args.promotion}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Spécialité :</span>
          <span class="info-value">${args.specialite}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Année scolaire :</span>
          <span class="info-value">${args.anneeScolaire}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date d'édition :</span>
          <span class="info-value">${args.dateEdition}</span>
        </div>
      </div>
      
      <div class="highlight-box">
        <p><strong>📧 Objet :</strong> Confirmation de demande de bulletin de notes</p>
        <p>Votre demande de bulletin avec les éléments indiqués ci-dessus a été envoyée avec succès.</p>
        <p><strong>⏱️ Dès réception, le document sera édité et vous sera envoyé dans un délai inférieur à 2 semaines.</strong></p>
      </div>
      
      <div class="signature">
        <p>Cordialement,</p>
        <p>
          <strong>Responsable Administratif</strong><br/>
          Maroc Ynov Campus<br/>
          8 Rue Ibnou Khatima<br/>
          Quartier des Hôpitaux<br/>
          Casablanca
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>IDG Maroc - YNOV CAMPUS</strong></p>
      <p>Société anonyme au capital de 6.400.000 DH</p>
      <p>88 Rue Ibnou Khatima - Quartier des Hôpitaux - Casablanca</p>
      <p>CNSS : 7164833 - IF : 1023591 - RC : 144155 - PATENTE : 36330905</p>
      <p style="margin-top: 15px; opacity: 0.7;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const payload = {
      personalizations: [
        {
          to: [{ email: args.toEmail, name: args.toName }],
          subject: "Confirmation de demande de bulletin - Ynov Campus",
        },
      ],
      from: {
        email: "daphnee.bouyedi641@gmail.com",
        name: "Ynov Campus Maroc",
      },
      content: [
        {
          type: "text/html",
          value: emailContent,
        },
      ],
    };

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("SendGrid error:", errorText);
        throw new Error(`SendGrid API error: ${response.status}`);
      }

      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Failed to send confirmation email");
    }
  },
});
