import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Ynov from '../img/Ynov.png';

// --- Informations fixes de l'établissement (from Attestation)
const INFOS_ETABLISSEMENT = {
  directeur: "Mr. Amine ZNIBER",
  adresse: "8 Rue Ibnou Khatima - Quartier des Hôpitaux- Casablanca",
  nom_complet: "IDG Maroc- YNOV CAMPUS",
  details_legaux: "Société anonyme au capital de 6.400.000 DH - 88 Rue Ibnou Khatima - Quartier des Hôpitaux- Casablanca\nCNSS : 7164833-IF:1023591 -RC:144155 -PATENTE:36330905-ICE:001645521000037"
};

const INFOS_BANCAIRES = {
  iban: "MA64011780000020210000281555",
  rib: "011 780 0000 20 210 00 02815 55",
  codeGuichet: "78020",
  swift: "BMCEMA55",
};

// Function to generate PDF for attestation
export const generateAttestationPDF = (userData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Couleurs
  const ynovBlue = [0, 51, 102];
  const ynovTeal = [78, 205, 196];

  // --- EN-TÊTE ET LOGO ---
  try {
      doc.addImage(Ynov, "PNG", margin, yPos, 20, 18);
  } catch (e) {
      console.warn("Erreur de chargement du logo Ynov. Poursuite sans logo.");
  }

  // Titre de l'attestation
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
  doc.text("ATTESTATION DE FRAIS DE SCOLARITÉ", pageWidth - margin, yPos + 10, { align: 'right' });
  yPos += 30;

  // Ligne de séparation
  doc.setDrawColor(ynovTeal[0], ynovTeal[1], ynovTeal[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // --- PARTIE 1 : DÉCLARATION ---
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  // Informations de l'établissement (Directeur)
  doc.text(`IDG - YNOV CAMPUS`, margin, yPos);
  doc.text(`Représenté par : ${INFOS_ETABLISSEMENT.directeur}, Directeur Général`, margin, yPos + 5);
  doc.text(`Adresse : ${INFOS_ETABLISSEMENT.adresse}`, margin, yPos + 10);
  yPos += 20;

  // Introduction formelle
  doc.setFontSize(12);
  const introText = `Je soussigné ${INFOS_ETABLISSEMENT.directeur}, Directeur Général d'IDG - YNOV CAMPUS, sise au ${INFOS_ETABLISSEMENT.adresse}, atteste par la présente que :`;
  const introLines = doc.splitTextToSize(introText, contentWidth);
  doc.text(introLines, margin, yPos);
  yPos += introLines.length * 6 + 8;

  // --- PARTIE 2 : INFORMATIONS DE L'ÉTUDIANT ET FORMATION ---
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos - 2, contentWidth, 38, 'F');
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
  doc.text("INFORMATIONS DE L'ÉTUDIANT ET DE LA FORMATION", margin + 2, yPos + 3);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  let col1 = margin + 5;
  let col2 = margin + contentWidth / 2 + 5;
  let currentLineY = yPos + 10;

  const studentInfo = [
      { label: "Nom et Prénom", value: `${userData.lastName} ${userData.firstName}` },
      { label: "Date de naissance", value: userData.dateOfBirth || '01/01/2000' },
      { label: "Promotion", value: userData.promotion || 'B1' },
      { label: "Spécialité", value: userData.specialite || 'Data IA' },
      { label: "Année scolaire", value: userData.anneeScolaire || '2024-2025' },
  ];

  studentInfo.forEach((item, index) => {
      let x = index % 2 === 0 ? col1 : col2;
      doc.setFont("helvetica", "bold");
      doc.text(`${item.label} : `, x, currentLineY);
      let labelWidth = doc.getTextWidth(`${item.label} : `);
      doc.setFont("helvetica", "normal");
      doc.text(item.value, x + labelWidth, currentLineY);

      if (index % 2 !== 0) {
          currentLineY += 8;
      }
  });

  yPos = currentLineY + 10;

  // --- PARTIE 3 : DÉTAILS DES FRAIS (TABLEAU SIMULÉ) ---
  doc.setFont("helvetica", "bold");
  doc.setTextColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
  doc.text("DÉTAILS DES FRAIS PAYÉS", margin, yPos);
  yPos += 5;

  // Paramètres du tableau
  const cellPadding = 3;
  const headerHeight = 7;
  const rowHeight = 7;
  const colLabels = ["Nature du Paiement", "Montant Payé (MAD)", "Modalité", "Mode de Paiement"];
  const colWidths = [contentWidth * 0.35, contentWidth * 0.25, contentWidth * 0.20, contentWidth * 0.20];
  let currentX = margin;

  // Dessin de l'en-tête
  doc.setFillColor(ynovTeal[0], ynovTeal[1], ynovTeal[2]);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPos, contentWidth, headerHeight, 'F');
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  currentX = margin;
  colLabels.forEach((label, i) => {
      doc.text(label, currentX + cellPadding, yPos + headerHeight - cellPadding);
      currentX += colWidths[i];
  });
  yPos += headerHeight;

  // Dessin des lignes de données
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const paymentRows = [
      { label: "Frais de préinscription", montant: userData.fraisPreinscription || '500', modalite: "N/A", mode: userData.modePaiement || 'Virement' },
      { label: "Frais de scolarité", montant: userData.fraisScolarite || '8000', modalite: userData.modalitePaiement || 'Semestrielle', mode: userData.modePaiement || 'Virement' },
  ];

  // Ligne TOTAL
  paymentRows.push({
      label: "TOTAL PAYÉ",
      montant: userData.totalPaye || '8500',
      modalite: '',
      mode: '' ,
      isTotal: true
  });

  paymentRows.forEach((row) => {
      // Fond gris clair pour l'alternance et le total
      if (!row.isTotal) {
          doc.setFillColor(255, 255, 255);
      }
      // Dessin des cellules
      currentX = margin;
      const dataRow = [
          row.label,
          row.montant,
          row.modalite,
          row.mode
      ];

      dataRow.forEach((cellData, j) => {
          const width = colWidths[j];
          doc.rect(currentX, yPos, width, rowHeight);
          doc.setTextColor(0, 0, 0);
          doc.text(cellData, currentX + cellPadding, yPos + rowHeight - cellPadding);
          currentX += width;
      });
      yPos += rowHeight;
  });

  yPos += 10;

  // Phrase finale
  doc.setFontSize(11);
  doc.text(`La présente attestation confirme que M/Mme ${userData.lastName} ${userData.firstName} a réglé un montant total de ${userData.totalPaye || '8500'} MAD au titre de l'année scolaire ${userData.anneeScolaire || '2024-2025'}.`, margin, yPos, {
      maxWidth: contentWidth
  });
  yPos += 10;

  // --- PARTIE 4 : INFORMATIONS BANCAIRES ET LÉGALES ---
  if (yPos > doc.internal.pageSize.getHeight() - 80) {
      doc.addPage();
      yPos = margin;
  }

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMATIONS BANCAIRES DE L'ÉTABLISSEMENT :", margin, yPos);
  yPos += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`- RIB: ${INFOS_BANCAIRES.rib}`, margin, yPos);
  yPos += 5;
  doc.text(`- IBAN: ${INFOS_BANCAIRES.iban}`, margin, yPos);
  yPos += 5;
  doc.text(`- SWIFT: ${INFOS_BANCAIRES.swift}`, margin, yPos);
  yPos += 5;
  doc.text(`- CODE GUICHET: ${INFOS_BANCAIRES.codeGuichet}`, margin, yPos);
  yPos += 10;

  doc.setFont("helvetica", "bold");
  doc.text("MENTIONS LÉGALES :", margin, yPos);
  yPos += 5;
  doc.setFont("helvetica", "normal");
  const legalText = `IDG Maroc- YNOV CAMPUS, ${INFOS_ETABLISSEMENT.details_legaux}`;
  const legalLines = doc.splitTextToSize(legalText, contentWidth);
  doc.text(legalLines, margin, yPos);
  yPos += legalLines.length * 4.5 + 5;

  // --- PARTIE 5 : CONCLUSION ET SIGNATURE ---
  const conclusion = "Cette attestation est délivrée à l'intéressé(e), à sa demande, pour servir et valoir ce que de droit.";
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.text(conclusion, margin, yPos);
  yPos += 15;

  // Lieu et date de signature
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Fait à Casablanca, le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 20;

  // Bloc Signature
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(INFOS_ETABLISSEMENT.directeur, pageWidth - margin, yPos, { align: 'right' });
  doc.setFontSize(10);
  doc.text("Directeur Général", pageWidth - margin, yPos + 5, { align: 'right' });

  // Emplacement du cachet
  doc.setFontSize(9);
  doc.text("Cachet et Signature de l'Établissement", pageWidth - margin, yPos + 25, { align: 'right' });

  // --- Return blob ---
  return doc.output('blob');
};

// Function to generate PDF for convention stage (simplified)
export const generateConventionStagePDF = (userData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 15;
  const contentWidth = pageWidth - 2 * margin;
  const ynovBlue = [0, 51, 102];
  const grayDark = [50, 50, 50];

  // --- EN-TÊTE DU PDF ---
  doc.text(`Convention de Stage pour ${userData.firstName} ${userData.lastName}`, pageWidth / 2, yPos + 15, { align: "center" });

  // Ligne de séparation
  doc.setDrawColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
  doc.setLineWidth(1);
  doc.line(margin, yPos + 22, pageWidth - margin, yPos + 22);
  yPos = yPos + 30;

  // --- STAGIAIRE ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Informations du Stagiaire", margin, yPos);
  yPos += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nom: ${userData.lastName}`, margin, yPos);
  doc.text(`Prénom: ${userData.firstName}`, margin + 100, yPos);
  yPos += 8;
  doc.text(`Email: ${userData.email || 'email@example.com'}`, margin, yPos);
  yPos += 8;
  doc.text(`Téléphone: ${userData.phone || '0600000000'}`, margin, yPos);
  yPos += 15;

  // --- ENTREPRISE ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Informations de l'Entreprise", margin, yPos);
  yPos += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nom: ${userData.entrepriseNom || 'Entreprise Exemple'}`, margin, yPos);
  yPos += 8;
  doc.text(`Adresse: ${userData.entrepriseAdresse || 'Adresse Exemple'}`, margin, yPos);
  yPos += 15;

  // --- PÉRIODE ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Période de Stage", margin, yPos);
  yPos += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Du: ${userData.dateDebut || '01/01/2024'} au ${userData.dateFin || '01/06/2024'}`, margin, yPos);
  yPos += 15;

  // --- SIGNATURES ---
  const pageHeight = doc.internal.pageSize.getHeight();
  let sigYPos = pageHeight - 40;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
  doc.text("Fait à __________________________________, le ____ / ____ / ______", margin, sigYPos);

  const sigWidth = 70;
  const sigLineY = pageHeight - 15;
  const respLegalX = pageWidth / 2 + 10;

  sigYPos += 15;

  // Signature de l'Entreprise
  doc.setFont("helvetica", "bold");
  doc.text("Signature et Cachet de l'Entreprise", margin, sigYPos);
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, sigLineY, margin + sigWidth, sigLineY);

  // Signature du Stagiaire
  doc.text("Signature du Stagiaire", respLegalX, sigYPos);
  doc.line(respLegalX, sigLineY, respLegalX + sigWidth, sigLineY);

  // --- Return blob ---
  return doc.output('blob');
};

// Function to generate PDF for convention etude (simplified)
export const generateConventionEtudePDF = (userData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 15;
  const ynovBlue = [0, 51, 102];
  const grayDark = [50, 50, 50];

  // --- TITRE PRINCIPAL ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
  doc.text("CONVENTION D'ÉTUDE", pageWidth / 2, yPos + 12, { align: "center" });

  // --- LIGNE DE SÉPARATION ---
  doc.setDrawColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
  doc.setLineWidth(1);
  doc.line(margin, yPos + 18, pageWidth - margin, yPos + 18);
  yPos = yPos + 25;

  // --- CADRE PHOTO CANDIDAT (Haut-Droit) ---
  const photoX = pageWidth - margin - 35;
  const photoY = 15;
  const photoW = 30;
  const photoH = 40;
  doc.setDrawColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
  doc.setLineWidth(1);
  doc.rect(photoX, photoY, photoW, photoH);
  doc.setFontSize(8);
  doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
  doc.text("Photo d'identité", photoX + photoW / 2, photoY + photoH / 2, { align: "center" });

  yPos += 10;

  // --- ÉTAT CIVIL DU CANDIDAT ---
  doc.setFillColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
  doc.rect(margin, yPos, contentWidth, 6, 'F');
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("ÉTAT CIVIL DU CANDIDAT", margin + 2, yPos + 4);
  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
  doc.setFontSize(9);

  doc.text(`Nom & Prénom: ${userData.lastName} ${userData.firstName}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Né(e) le: ${userData.dateOfBirth || '01/01/2000'}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Adresse: ${userData.address || 'Adresse Exemple'}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Email: ${userData.email || 'email@example.com'}`, margin + 5, yPos);
  yPos += 15;

  // --- RESPONSABLE LÉGAL ---
  doc.setFillColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
  doc.rect(margin, yPos, contentWidth, 6, 'F');
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("ÉTAT CIVIL DU RESPONSABLE LÉGAL", margin + 2, yPos + 4);
  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
  doc.setFontSize(9);

  doc.text(`Nom & Prénom: ${userData.respLegalName || 'Parent Exemple'}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Adresse: ${userData.respLegalAddress || 'Adresse Parent'}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Email: ${userData.respLegalEmail || 'parent@example.com'}`, margin + 5, yPos);
  yPos += 15;

  // --- ÉTUDES ANTÉRIEURES ---
  doc.setFillColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
  doc.rect(margin, yPos, contentWidth, 6, 'F');
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("ÉTUDES ANTÉRIEURES", margin + 2, yPos + 4);
  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
  doc.setFontSize(9);

  doc.text(`Année: ${userData.etudeAnnee || '2023-2024'}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Établissement: ${userData.etudeEtablissement || 'Lycée Exemple'}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Diplôme: ${userData.etudeDiplome || 'Baccalauréat'}`, margin + 5, yPos);
  yPos += 15;

  // --- SIGNATURES ---
  const pageHeight = doc.internal.pageSize.getHeight();
  let sigYPos = pageHeight - 40;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
  doc.text("Fait à __________________________________, le ____ / ____ / ______", margin, sigYPos);
  yPos = pageHeight - 30;

  // Lignes de signature
  const sigWidth = 80;
  const sigLineY = pageHeight - 15;

  // Candidat
  doc.setFont("helvetica", "bold");
  doc.text("Signature du Candidat", margin, yPos);
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, sigLineY, margin + sigWidth, sigLineY);

  // Responsable légal
  const respLegalX = pageWidth / 2 + 10;
  doc.text("Signature du Responsable Légal", respLegalX, yPos);
  doc.line(respLegalX, sigLineY, respLegalX + sigWidth, sigLineY);

  // --- Return blob ---
  return doc.output('blob');
};

// Main function to generate PDF based on type
export const generatePDF = (type, userData) => {
  switch (type) {
    case 'attestation':
      return generateAttestationPDF(userData);
    case 'convention_stage':
      return generateConventionStagePDF(userData);
    case 'convention_etude':
      return generateConventionEtudePDF(userData);
    default:
      console.error('Unknown type');
      return null;
  }
};
