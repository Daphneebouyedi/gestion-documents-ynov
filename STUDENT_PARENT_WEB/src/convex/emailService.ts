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
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4ECDC4; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 5px; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #003366; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
    .highlight { background-color: #fff3cd; padding: 15px; border-left: 4px solid: #ffc107; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>YNOV CAMPUS</h1>
      <p>Confirmation de demande de bulletin</p>
    </div>
    
    <div class="content">
      <p>Bonjour ${args.prenom} ${args.nom},</p>
      
      <p>Nous avons bien reçu votre demande de bulletin de notes.</p>
      
      <div style="margin: 20px 0;">
        <div class="info-row"><span class="label">Nom :</span> ${args.nom}</div>
        <div class="info-row"><span class="label">Prénom :</span> ${args.prenom}</div>
        <div class="info-row"><span class="label">Promotion :</span> ${args.promotion}</div>
        <div class="info-row"><span class="label">Spécialité :</span> ${args.specialite}</div>
        <div class="info-row"><span class="label">Année scolaire :</span> ${args.anneeScolaire}</div>
        <div class="info-row"><span class="label">Date d'édition :</span> ${args.dateEdition}</div>
      </div>
      
      <div class="highlight">
        <p><strong>Objet :</strong> Confirmation de demande de bulletin de notes</p>
        <p>Votre demande de bulletin avec les éléments indiqués ci-dessus a été envoyée avec succès.</p>
        <p><strong>Dès réception, le document sera édité et vous sera envoyé dans un délai inférieur à 2 semaines.</strong></p>
      </div>
      
      <p>Cordialement,</p>
      <p>
        <strong>Responsable Administratif</strong><br/>
        Maroc Ynov Campus<br/>
        8 Rue Ibnou Khatima<br/>
        Quartier des Hôpitaux<br/>
        Casablanca
      </p>
    </div>
    
    <div class="footer">
      <p>IDG Maroc - YNOV CAMPUS</p>
      <p>CNSS : 7164833 - IF : 1023591 - RC : 144155 - PATENTE : 36330905</p>
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
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
