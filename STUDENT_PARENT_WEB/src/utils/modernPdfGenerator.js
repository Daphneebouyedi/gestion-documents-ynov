import { jsPDF } from 'jspdf';

const INFOS_ETABLISSEMENT = {
  directeur: "Mr. Amine ZNIBER",
  adresse: "8 Rue Ibnou Khatima - Quartier des Hôpitaux- Casablanca",
  nom_complet: "IDG Maroc- YNOV CAMPUS",
  details_legaux: "Société anonyme au capital de 6.400.000 DH\n88 Rue Ibnou Khatima - Quartier des Hôpitaux- Casablanca\nCNSS : 7164833 - IF : 1023591 - RC : 144155 - PATENTE : 36330905 - ICE : 001645521000037"
};

const COLORS = {
  ynov_blue: [0, 51, 102],
  ynov_teal: [78, 205, 196],
  text_dark: [34, 34, 34],
  text_light: [102, 102, 102],
  border: [220, 220, 220]
};

/**
 * Add header with logo and title
 */
const addHeader = (doc, title, logoImg) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  // Add logo
  if (logoImg) {
    try {
      doc.addImage(logoImg, "PNG", margin, 15, 40, 25);
    } catch (e) {
      console.warn("Logo not loaded");
    }
  }
  
  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(COLORS.ynov_blue[0], COLORS.ynov_blue[1], COLORS.ynov_blue[2]);
  doc.text(title, pageWidth - margin, 28, { align: 'right' });
  
  // Decorative line under header
  doc.setDrawColor(COLORS.ynov_teal[0], COLORS.ynov_teal[1], COLORS.ynov_teal[2]);
  doc.setLineWidth(2);
  doc.line(margin, 45, pageWidth - margin, 45);
  
  return 55; // Return yPos after header
};

/**
 * Add footer with legal info and signature
 */
const addFooter = (doc, dateStr) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = pageHeight - 80;
  
  // Decorative line above footer
  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);
  
  // Legal text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text_light[0], COLORS.text_light[1], COLORS.text_light[2]);
  const legalLines = doc.splitTextToSize(INFOS_ETABLISSEMENT.details_legaux, pageWidth - 2 * margin);
  doc.text(legalLines, margin, yPos);
  yPos += legalLines.length * 4 + 10;
  
  // Date and place
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text_dark[0], COLORS.text_dark[1], COLORS.text_dark[2]);
  doc.text(`Fait à Casablanca, le ${dateStr}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 8;
  
  // Signature
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(INFOS_ETABLISSEMENT.directeur, pageWidth - margin, yPos + 15, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Directeur Général", pageWidth - margin, yPos + 20, { align: 'right' });
  
  // Add stamp placeholder
  doc.setDrawColor(COLORS.ynov_teal[0], COLORS.ynov_teal[1], COLORS.ynov_teal[2]);
  doc.setLineWidth(1.5);
  doc.circle(pageWidth - margin - 30, yPos + 15, 18, 'S');
  doc.setFontSize(7);
  doc.setTextColor(COLORS.ynov_teal[0], COLORS.ynov_teal[1], COLORS.ynov_teal[2]);
  doc.text("CACHET", pageWidth - margin - 30, yPos + 15, { align: 'center' });
};

/**
 * Add info box with title and content
 */
const addInfoBox = (doc, yPos, title, content, fullWidth = false) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const boxWidth = fullWidth ? (pageWidth - 2 * margin) : ((pageWidth - 2 * margin - 10) / 2);
  
  // Box background
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(margin, yPos, boxWidth, 35, 3, 3, 'F');
  
  // Box border
  doc.setDrawColor(COLORS.ynov_teal[0], COLORS.ynov_teal[1], COLORS.ynov_teal[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, boxWidth, 35, 3, 3, 'S');
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.ynov_blue[0], COLORS.ynov_blue[1], COLORS.ynov_blue[2]);
  doc.text(title.toUpperCase(), margin + 5, yPos + 8);
  
  // Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text_dark[0], COLORS.text_dark[1], COLORS.text_dark[2]);
  
  if (Array.isArray(content)) {
    let contentY = yPos + 16;
    content.forEach(line => {
      const lines = doc.splitTextToSize(line, boxWidth - 10);
      doc.text(lines, margin + 5, contentY);
      contentY += lines.length * 5;
    });
  } else {
    const lines = doc.splitTextToSize(content, boxWidth - 10);
    doc.text(lines, margin + 5, yPos + 16);
  }
  
  return yPos + 45; // Return next yPos
};

/**
 * Generate Attestation d'inscription PDF
 */
export const generateAttestationInscriptionPDF = (formData, logoImg) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  let yPos = addHeader(doc, "ATTESTATION D'INSCRIPTION", logoImg);
  yPos += 5;
  
  // Reference number
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text_light[0], COLORS.text_light[1], COLORS.text_light[2]);
  doc.text(`Réf: ATT-INS-${Date.now().toString().slice(-8)}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 15;
  
  // Introduction
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text_dark[0], COLORS.text_dark[1], COLORS.text_dark[2]);
  const intro = `Le Directeur Général d'${INFOS_ETABLISSEMENT.nom_complet}, certifie que :`;
  doc.text(intro, margin, yPos);
  yPos += 15;
  
  // Student info box
  yPos = addInfoBox(doc, yPos, "Étudiant(e)", [
    `${formData.nom} ${formData.prenom}`,
    `Né(e) le ${formData.dateNaissance.split('-').reverse().join('/')}`,
  ]);
  
  // Academic info
  yPos = addInfoBox(doc, yPos, "Formation", [
    `${formData.promotion} - ${formData.specialite}`,
    `Année scolaire ${formData.anneeScolaire}`,
  ]);
  
  // Main text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  const mainText = `Est régulièrement inscrit(e) au sein de notre établissement pour l'année universitaire ${formData.anneeScolaire}.`;
  const textLines = doc.splitTextToSize(mainText, pageWidth - 2 * margin);
  doc.text(textLines, margin, yPos);
  yPos += textLines.length * 6 + 10;
  
  // Purpose statement
  doc.setFont("helvetica", "bold");
  const purpose = "La présente attestation est délivrée à l'intéressé(e), à sa demande, pour servir et valoir ce que de droit.";
  const purposeLines = doc.splitTextToSize(purpose, pageWidth - 2 * margin);
  doc.text(purposeLines, margin, yPos);
  
  addFooter(doc, formData.date.split('-').reverse().join('/'));
  
  doc.save(`Attestation_Inscription_${formData.nom}_${formData.prenom}.pdf`);
};

/**
 * Generate Attestation de réussite PDF
 */
export const generateAttestationReussitePDF = (formData, logoImg) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  let yPos = addHeader(doc, "ATTESTATION DE RÉUSSITE", logoImg);
  yPos += 5;
  
  // Reference number
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text_light[0], COLORS.text_light[1], COLORS.text_light[2]);
  doc.text(`Réf: ATT-REU-${Date.now().toString().slice(-8)}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 15;
  
  // Introduction
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text_dark[0], COLORS.text_dark[1], COLORS.text_dark[2]);
  const intro = `Le Directeur Général d'${INFOS_ETABLISSEMENT.nom_complet}, certifie que :`;
  doc.text(intro, margin, yPos);
  yPos += 15;
  
  // Student info box
  yPos = addInfoBox(doc, yPos, "Étudiant(e)", [
    `${formData.nom} ${formData.prenom}`,
    `Né(e) le ${formData.dateNaissance.split('-').reverse().join('/')}`,
  ]);
  
  // Results box with highlight
  doc.setFillColor(237, 247, 237);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 45, 3, 3, 'F');
  doc.setDrawColor(76, 175, 80);
  doc.setLineWidth(1);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 45, 3, 3, 'S');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(27, 94, 32);
  doc.text("RÉSULTATS OBTENUS", margin + 5, yPos + 10);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(COLORS.text_dark[0], COLORS.text_dark[1], COLORS.text_dark[2]);
  doc.text(`Formation : ${formData.promotion} - ${formData.specialite}`, margin + 5, yPos + 22);
  doc.text(`Année scolaire : ${formData.anneeScolaire}`, margin + 5, yPos + 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Moyenne obtenue : ${formData.moyenne}/20`, margin + 5, yPos + 38);
  
  yPos += 55;
  
  // Mention box
  if (formData.mention) {
    doc.setFillColor(255, 248, 225);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 3, 3, 'F');
    doc.setDrawColor(255, 193, 7);
    doc.setLineWidth(1);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 3, 3, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(245, 124, 0);
    doc.text(`✓ Mention : ${formData.mention}`, margin + 5, yPos + 13);
    yPos += 30;
  }
  
  // Main text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  doc.setTextColor(COLORS.text_dark[0], COLORS.text_dark[1], COLORS.text_dark[2]);
  const mainText = `A validé avec succès l'ensemble des modules de la formation susmentionnée et a obtenu les résultats ci-dessus.`;
  const textLines = doc.splitTextToSize(mainText, pageWidth - 2 * margin);
  doc.text(textLines, margin, yPos);
  yPos += textLines.length * 6 + 10;
  
  // Purpose statement
  doc.setFont("helvetica", "bold");
  const purpose = "La présente attestation est délivrée à l'intéressé(e), à sa demande, pour servir et valoir ce que de droit.";
  const purposeLines = doc.splitTextToSize(purpose, pageWidth - 2 * margin);
  doc.text(purposeLines, margin, yPos);
  
  addFooter(doc, formData.date.split('-').reverse().join('/'));
  
  doc.save(`Attestation_Reussite_${formData.nom}_${formData.prenom}.pdf`);
};

/**
 * Generate Bulletin PDF
 */
export const generateBulletinPDF = (formData, logoImg) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  let yPos = addHeader(doc, "BULLETIN DE NOTES", logoImg);
  yPos += 5;
  
  // Reference number
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text_light[0], COLORS.text_light[1], COLORS.text_light[2]);
  doc.text(`Réf: BULL-${Date.now().toString().slice(-8)}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 15;
  
  // Student info
  yPos = addInfoBox(doc, yPos, "Étudiant(e)", [
    `${formData.nom} ${formData.prenom}`,
    `Né(e) le ${formData.dateNaissance.split('-').reverse().join('/')}`,
  ]);
  
  // Period info
  yPos = addInfoBox(doc, yPos, "Période", [
    `${formData.promotion} - ${formData.specialite}`,
    `${formData.semestre} - Année ${formData.anneeScolaire}`,
  ]);
  
  // Bulletin intro
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text_dark[0], COLORS.text_dark[1], COLORS.text_dark[2]);
  const intro = `Bulletin de notes pour le semestre ${formData.semestre} de l'année universitaire ${formData.anneeScolaire}.`;
  const introLines = doc.splitTextToSize(intro, pageWidth - 2 * margin);
  doc.text(introLines, margin, yPos);
  yPos += introLines.length * 6 + 15;
  
  // Notes table placeholder
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 80, 3, 3, 'F');
  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 80, 3, 3, 'S');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.ynov_blue[0], COLORS.ynov_blue[1], COLORS.ynov_blue[2]);
  doc.text("RÉSULTATS DÉTAILLÉS", margin + 5, yPos + 10);
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text_light[0], COLORS.text_light[1], COLORS.text_light[2]);
  doc.text("Les notes détaillées par module seront disponibles", margin + 5, yPos + 40);
  doc.text("sur votre espace étudiant en ligne.", margin + 5, yPos + 48);
  
  yPos += 90;
  
  // Purpose statement
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text_dark[0], COLORS.text_dark[1], COLORS.text_dark[2]);
  const purpose = "Ce bulletin est délivré à l'intéressé(e), à sa demande, pour servir et valoir ce que de droit.";
  const purposeLines = doc.splitTextToSize(purpose, pageWidth - 2 * margin);
  doc.text(purposeLines, margin, yPos);
  
  addFooter(doc, formData.date.split('-').reverse().join('/'));
  
  doc.save(`Bulletin_${formData.nom}_${formData.prenom}_${formData.semestre}.pdf`);
};
