import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';
import { jsPDF } from 'jspdf';
import { generateAttestationInscriptionPDF, generateAttestationReussitePDF, generateBulletinPDF } from '../utils/modernPdfGenerator';
import Ynov from '../img/Ynov.png';

const DetailsDemande = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);

  const isConvention = id.startsWith('conv-');
  const isAttestation = id.startsWith('att-');
  const realId = id.replace('conv-', '').replace('att-', '').replace('mobile-', '');

  const convention = useQuery(api.conventions.getInternshipConventionById, isConvention ? { id: realId } : "skip");
  const attestation = useQuery(api.attestations.getAttestationById, isAttestation ? { id: realId } : "skip");

  const data = isConvention ? convention : attestation;
  const type = data?.type || (isConvention ? 'Convention de stage' : 'Attestation');
  const status = data ? (data.status === 'Generated' || data.status === 'En attente' ? 'envoyé' : data.status || 'envoyé') : '';
  const dateEdition = data ? new Date(data.createdAt).toLocaleString('fr-FR') : '';

  useEffect(() => {
    if (data) {
      // Prepare formData for PDF generators / email preview
      const formData = {
        nom: data.nom || data.stagiaireNom || '',
        prenom: data.prenom || data.stagiairePrenom || '',
        dateNaissance: data.dateNaissance || '',
        promotion: data.promotion || '',
        specialite: data.specialite || '',
        anneeScolaire: data.anneeScolaire || '',
        semestre: data.semestre || '',
        moyenne: data.moyenne || '',
        mention: data.mention || '',
        date: data.date || new Date().toISOString().substring(0, 10),
      };
      
      // For bulletins, show email format instead of PDF
      if (type === 'Bulletin de notes' || type === 'Bulletin') {
        const emailHtml = createBulletinEmailPreview(formData, dateEdition);
        const blob = new Blob([emailHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        return;
      }
      
      // Generate appropriate PDF for other document types
      let doc;
      if (type === 'Attestation d\'inscription') {
        doc = createAttestationInscriptionPreview(formData);
      } else if (type === 'Attestation de réussite') {
        doc = createAttestationReussitePreview(formData);
      } else if (isConvention) {
        doc = createConventionPreview(data);
      } else {
        // Fallback generic preview
        doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(type, 105, 30, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Date d'édition: ${dateEdition}`, 10, 50);
        doc.text(`Statut: ${status}`, 10, 60);
      }
      
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    }
  }, [data, type, dateEdition, status, isConvention]);

  // Create email preview for bulletin
  const createBulletinEmailPreview = (formData, dateEdition) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 20px; }
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
      <p class="greeting">Bonjour <strong>${formData.prenom} ${formData.nom}</strong>,</p>
      
      <p>Nous avons bien reçu votre demande de bulletin de notes.</p>
      
      <div class="info-section">
        <h3 style="margin-top: 0; color: #003366;">📋 Informations de la demande</h3>
        <div class="info-row">
          <span class="info-label">Nom :</span>
          <span class="info-value">${formData.nom}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Prénom :</span>
          <span class="info-value">${formData.prenom}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Promotion :</span>
          <span class="info-value">${formData.promotion}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Spécialité :</span>
          <span class="info-value">${formData.specialite}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Année scolaire :</span>
          <span class="info-value">${formData.anneeScolaire}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date d'édition :</span>
          <span class="info-value">${dateEdition}</span>
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
  };

  // Helper functions to create preview PDFs (copies of modern generators)
  const createAttestationInscriptionPreview = (formData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 15;
    
    // Header with logo
    try {
      doc.addImage(Ynov, "PNG", margin, yPos, 40, 25);
    } catch (e) {
      console.warn("Logo not loaded");
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102);
    doc.text("ATTESTATION D'INSCRIPTION", pageWidth - margin, yPos + 13, { align: 'right' });
    
    doc.setDrawColor(78, 205, 196);
    doc.setLineWidth(2);
    doc.line(margin, 45, pageWidth - margin, 45);
    
    yPos = 55;
    
    // Reference
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);
    doc.text(`Réf: ATT-INS-${Date.now().toString().slice(-8)}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 15;
    
    // Content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    doc.text(`Le Directeur Général d'IDG Maroc- YNOV CAMPUS, certifie que :`, margin, yPos);
    yPos += 15;
    
    // Student info box
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'F');
    doc.setDrawColor(78, 205, 196);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 102);
    doc.text("ÉTUDIANT(E)", margin + 5, yPos + 8);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    doc.text(`${formData.nom} ${formData.prenom}`, margin + 5, yPos + 16);
    if (formData.dateNaissance) {
      doc.text(`Né(e) le ${formData.dateNaissance.split('-').reverse().join('/')}`, margin + 5, yPos + 23);
    }
    yPos += 40;
    
    // Formation box
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'F');
    doc.setDrawColor(78, 205, 196);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 102);
    doc.text("FORMATION", margin + 5, yPos + 8);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    doc.text(`${formData.promotion} - ${formData.specialite}`, margin + 5, yPos + 16);
    doc.text(`Année scolaire ${formData.anneeScolaire}`, margin + 5, yPos + 23);
    yPos += 40;
    
    // Main text
    const mainText = `Est régulièrement inscrit(e) au sein de notre établissement pour l'année universitaire ${formData.anneeScolaire}.`;
    const textLines = doc.splitTextToSize(mainText, pageWidth - 2 * margin);
    doc.text(textLines, margin, yPos);
    yPos += textLines.length * 6 + 10;
    
    // Purpose
    doc.setFont("helvetica", "bold");
    const purpose = "La présente attestation est délivrée à l'intéressé(e), à sa demande, pour servir et valoir ce que de droit.";
    const purposeLines = doc.splitTextToSize(purpose, pageWidth - 2 * margin);
    doc.text(purposeLines, margin, yPos);
    
    addSimpleFooter(doc, formData.date);
    return doc;
  };

  const createAttestationReussitePreview = (formData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 15;
    
    // Header
    try {
      doc.addImage(Ynov, "PNG", margin, yPos, 40, 25);
    } catch (e) {}
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102);
    doc.text("ATTESTATION DE RÉUSSITE", pageWidth - margin, yPos + 13, { align: 'right' });
    
    doc.setDrawColor(78, 205, 196);
    doc.setLineWidth(2);
    doc.line(margin, 45, pageWidth - margin, 45);
    yPos = 60;
    
    // Reference
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);
    doc.text(`Réf: ATT-REU-${Date.now().toString().slice(-8)}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 10;
    
    // Student info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    doc.text(`Le Directeur Général d'IDG Maroc- YNOV CAMPUS, certifie que :`, margin, yPos);
    yPos += 12;
    
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'F');
    doc.setDrawColor(78, 205, 196);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 102);
    doc.text("ÉTUDIANT(E)", margin + 5, yPos + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    doc.text(`${formData.nom} ${formData.prenom}`, margin + 5, yPos + 15);
    if (formData.dateNaissance) {
      doc.text(`Né(e) le ${formData.dateNaissance.split('-').reverse().join('/')}`, margin + 5, yPos + 21);
    }
    yPos += 35;
    
    // Results box (highlighted)
    doc.setFillColor(237, 247, 237);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 42, 3, 3, 'F');
    doc.setDrawColor(76, 175, 80);
    doc.setLineWidth(1);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 42, 3, 3, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(27, 94, 32);
    doc.text("RÉSULTATS OBTENUS", margin + 5, yPos + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    doc.text(`Formation : ${formData.promotion} - ${formData.specialite}`, margin + 5, yPos + 20);
    doc.text(`Année scolaire : ${formData.anneeScolaire}`, margin + 5, yPos + 27);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Moyenne obtenue : ${formData.moyenne}/20`, margin + 5, yPos + 35);
    yPos += 52;
    
    // Mention if exists
    if (formData.mention) {
      doc.setFillColor(255, 248, 225);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 18, 3, 3, 'F');
      doc.setDrawColor(255, 193, 7);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 18, 3, 3, 'S');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(245, 124, 0);
      doc.text(`✓ Mention : ${formData.mention}`, margin + 5, yPos + 12);
      yPos += 25;
    }
    
    // Main text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    const mainText = `A validé avec succès l'ensemble des modules de la formation susmentionnée et a obtenu les résultats ci-dessus.`;
    const textLines = doc.splitTextToSize(mainText, pageWidth - 2 * margin);
    doc.text(textLines, margin, yPos);
    yPos += textLines.length * 6 + 8;
    
    // Purpose
    doc.setFont("helvetica", "bold");
    const purpose = "La présente attestation est délivrée à l'intéressé(e), à sa demande, pour servir et valoir ce que de droit.";
    const purposeLines = doc.splitTextToSize(purpose, pageWidth - 2 * margin);
    doc.text(purposeLines, margin, yPos);
    
    addSimpleFooter(doc, formData.date);
    return doc;
  };

  const createBulletinPreview = (formData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 15;
    
    // Header
    try {
      doc.addImage(Ynov, "PNG", margin, yPos, 40, 25);
    } catch (e) {}
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102);
    doc.text("BULLETIN DE NOTES", pageWidth - margin, yPos + 13, { align: 'right' });
    
    doc.setDrawColor(78, 205, 196);
    doc.setLineWidth(2);
    doc.line(margin, 45, pageWidth - margin, 45);
    yPos = 60;
    
    // Reference
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);
    doc.text(`Réf: BULL-${Date.now().toString().slice(-8)}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 15;
    
    // Student info boxes (side by side would be ideal, but simplified here)
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'F');
    doc.setDrawColor(78, 205, 196);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 102);
    doc.text("ÉTUDIANT(E)", margin + 5, yPos + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    doc.text(`${formData.nom} ${formData.prenom}`, margin + 5, yPos + 15);
    if (formData.dateNaissance) {
      doc.text(`Né(e) le ${formData.dateNaissance.split('-').reverse().join('/')}`, margin + 5, yPos + 21);
    }
    yPos += 35;
    
    // Period box
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'F');
    doc.setDrawColor(78, 205, 196);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 102);
    doc.text("PÉRIODE", margin + 5, yPos + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    doc.text(`${formData.promotion} - ${formData.specialite}`, margin + 5, yPos + 15);
    doc.text(`${formData.semestre} - Année ${formData.anneeScolaire}`, margin + 5, yPos + 21);
    yPos += 35;
    
    // Intro
    const intro = `Bulletin de notes pour le semestre ${formData.semestre} de l'année universitaire ${formData.anneeScolaire}.`;
    const introLines = doc.splitTextToSize(intro, pageWidth - 2 * margin);
    doc.text(introLines, margin, yPos);
    yPos += introLines.length * 6 + 10;
    
    // Notes placeholder
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 60, 3, 3, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 60, 3, 3, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 102);
    doc.text("RÉSULTATS DÉTAILLÉS", margin + 5, yPos + 10);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text("Les notes détaillées par module seront disponibles", margin + 5, yPos + 32);
    doc.text("sur votre espace étudiant en ligne.", margin + 5, yPos + 40);
    yPos += 70;
    
    // Purpose
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    const purpose = "Ce bulletin est délivré à l'intéressé(e), à sa demande, pour servir et valoir ce que de droit.";
    const purposeLines = doc.splitTextToSize(purpose, pageWidth - 2 * margin);
    doc.text(purposeLines, margin, yPos);
    
    addSimpleFooter(doc, formData.date);
    return doc;
  };

  const createConventionPreview = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Convention de stage', 105, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date d'édition: ${dateEdition}`, 10, 50);
    doc.text(`Statut: ${status}`, 10, 60);
    doc.text(`Stagiaire: ${data.stagiaireNom} ${data.stagiairePrenom}`, 10, 70);
    doc.text(`Entreprise: ${data.entrepriseNom}`, 10, 80);
    doc.text(`Période: ${data.dateDebut} - ${data.dateFin}`, 10, 90);
    return doc;
  };

  const addSimpleFooter = (doc, dateStr) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = pageHeight - 70;
    
    // Separator line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);
    
    // Legal text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(102, 102, 102);
    const legal = "IDG Maroc- YNOV CAMPUS - CNSS : 7164833 - IF : 1023591 - RC : 144155";
    doc.text(legal, margin, yPos);
    yPos += 10;
    
    // Date and signature
    doc.setFontSize(11);
    doc.setTextColor(34, 34, 34);
    const dateFormatted = dateStr ? dateStr.split('-').reverse().join('/') : new Date().toLocaleDateString('fr-FR');
    doc.text(`Fait à Casablanca, le ${dateFormatted}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 8;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Mr. Amine ZNIBER", pageWidth - margin, yPos + 15, { align: 'right' });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Directeur Général", pageWidth - margin, yPos + 20, { align: 'right' });
    
    // Stamp circle
    doc.setDrawColor(78, 205, 196);
    doc.setLineWidth(1.5);
    doc.circle(pageWidth - margin - 30, yPos + 15, 15, 'S');
    doc.setFontSize(7);
    doc.setTextColor(78, 205, 196);
    doc.text("CACHET", pageWidth - margin - 30, yPos + 16, { align: 'center' });
  };

  if (isConvention && !convention) return <div>Loading...</div>;
  if (isAttestation && !attestation) return <div>Loading...</div>;

  const getStatusStyle = (status) => {
    switch (status) {
      case "envoyé":
        return { backgroundColor: 'blue', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      case "en cours de traitement":
        return { backgroundColor: 'yellow', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      case "document reçu":
        return { backgroundColor: 'green', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      default:
        return { backgroundColor: 'gray', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
    }
  };

  const handleBack = () => navigate('/demandes');

  return (
    <DashboardLayout pageTitle="Détails de la demande" pageDescription="Informations détaillées sur la demande">
      <div className="details-container">
        <button onClick={handleBack} className="back-button" style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#23c2a2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Retour</button>
        <div className="user-profile-card">
          <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div className="detail-section">
              <h3 className="section-title">Informations de la demande</h3>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">Type</span>
                  <span className="detail-value">{type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Statut</span>
                  <span className="detail-value"><span style={getStatusStyle(status)}>{status}</span></span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date d'édition</span>
                  <span className="detail-value">{dateEdition}</span>
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h3 className="section-title">{(type === "Bulletin de notes" || type === "Bulletin") ? "Email de confirmation" : "Aperçu du document PDF"}</h3>
              {pdfUrl && <iframe src={pdfUrl} width="100%" height="600px" style={{ border: 'none' }} title="PDF Preview"></iframe>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DetailsDemande;
