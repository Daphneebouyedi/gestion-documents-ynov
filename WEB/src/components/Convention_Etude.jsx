import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Convention_Etude.css";
import Ynov from '../img/Ynov.png';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';

const ConventionEtudeForm = () => {
  const navigate = useNavigate();
  const createConvention = useMutation(api.conventions.createConvention);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);

  // Les données d'exemple ont été rétablies pour assurer que le PDF ait du contenu visible
  const [formData, setFormData] = useState({
    // État civil du candidat
    civiliteCandidat: "Mme",
    nomCandidat: "DUPONT",
    prenomCandidat: "Sophie",
    dateNaissanceCandidat: "2005-08-20",
    lieuNaissanceCandidat: "Marseille",
    paysCandidat: "France",
    nationaliteCandidat: "Française",
    adresseCandidat: "5 Allée des Palmiers",
    villeCandidat: "Nice",
    codePostalCandidat: "06000",
    telephoneCandidat: "0493000000",
    portableCandidat: "0600000000",
    emailCandidat: "sophie.dupont@mail.com",
    idCandidat: "ID12345678",
    photoCandidat: null,

    // Responsables (simulé pour l'exemple)
    civiliteRespLegal: "Mr", qualiteRespLegal: "Père", nomRespLegal: "DUPONT", prenomRespLegal: "Marc", dateNaissanceRespLegal: "1975-01-01", lieuNaissanceRespLegal: "Paris", paysRespLegal: "France", nationaliteRespLegal: "Française", adresseRespLegal: "5 Allée des Palmiers", villeRespLegal: "Nice", codePostalRespLegal: "06000", telephoneRespLegal: "0493111111", portableRespLegal: "0611111111", emailRespLegal: "marc.dupont@mail.com", idRespLegal: "ID87654321",

    civiliteRespFin: "Mr", qualiteRespFin: "Père", nomRespFin: "DUPONT", prenomRespFin: "Marc", dateNaissanceRespFin: "1975-01-01", lieuNaissanceRespFin: "Paris", paysRespFin: "France", nationaliteRespFin: "Française", adresseRespFin: "5 Allée des Palmiers", villeRespFin: "Nice", codePostalRespFin: "06000", telephoneRespFin: "0493111111", emailRespFin: "marc.dupont@mail.com", idRespFin: "ID87654321",
    
    // Études antérieures (données d'exemple)
    etudes: [
      { annee: "2023-2024", etudeSuivie: "Terminales", etablissement: "Lycée Fénelon", diplome: "Baccalauréat", dateObtention: "2024-07-05" },
      { annee: "2022-2023", etudeSuivie: "Première", etablissement: "Lycée Fénelon", diplome: "N/A", dateObtention: "2023-07-05" },
      { annee: "2021-2022", etudeSuivie: "Seconde", etablissement: "Lycée Fénelon", diplome: "N/A", dateObtention: "2022-07-05" },
    ],
    commentaire: "Année de césure en 2020-2021 pour un voyage humanitaire au Pérou.",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photoCandidat: e.target.files[0] }));
  };

  const handleEtudesChange = (index, field, value) => {
    const updatedEtudes = [...formData.etudes];
    updatedEtudes[index][field] = value;
    setFormData((prev) => ({ ...prev, etudes: updatedEtudes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validation --- 
    const requiredFields = [
      "nomCandidat", "prenomCandidat", "dateNaissanceCandidat", "lieuNaissanceCandidat", "paysCandidat", "nationaliteCandidat", "adresseCandidat", "villeCandidat", "codePostalCandidat", "telephoneCandidat", "emailCandidat", "idCandidat",
      "nomRespLegal", "prenomRespLegal", "dateNaissanceRespLegal", "lieuNaissanceRespLegal", "paysRespLegal", "nationaliteRespLegal", "adresseRespLegal", "villeRespLegal", "codePostalRespLegal", "telephoneRespLegal", "emailRespLegal", "idRespLegal",
      "nomRespFin", "prenomRespFin", "dateNaissanceRespFin", "lieuNaissanceRespFin", "paysRespFin", "nationaliteRespFin", "adresseRespFin", "villeRespFin", "codePostalRespFin", "telephoneRespFin", "emailRespFin", "idRespFin",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert(`Veuillez remplir le champ obligatoire : ${field}`);
        return;
      }
    }

    // Validate etudes array
    for (const etude of formData.etudes) {
      if (!etude.annee || !etude.etudeSuivie || !etude.etablissement || !etude.diplome || !etude.dateObtention) {
        alert("Veuillez remplir tous les champs pour les études antérieures.");
        return;
      }
    }
    // --- End Validation --- 

    let photoCandidatStorageId = undefined;
    if (formData.photoCandidat) {
      try {
        const postUrl = await generateUploadUrl();
        const response = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": formData.photoCandidat.type },
          body: formData.photoCandidat,
        });
        const { storageId } = await response.json();
        if (typeof storageId !== 'string') {
          throw new Error(`File upload failed or returned an invalid storage ID. Received: ${typeof storageId} - ${JSON.stringify(storageId)}`);
        }
        photoCandidatStorageId = storageId;
      } catch (error) {
        console.error("Error uploading photo:", error);
        alert("Erreur lors de l'upload de la photo.");
        return;
      }
    }

    try {
      const { photoCandidat, ...restFormData } = formData; // Destructure to exclude photoCandidat

      await createConvention({
        ...restFormData, // Spread the rest of the form data
        ...(photoCandidatStorageId === null ? undefined : photoCandidatStorageId !== undefined && { photoCandidatStorageId }), // Explicitly convert null to undefined, and only add if defined
      });
      // alert("Convention enregistrée avec succès!"); // Removed alert
      // Clear form or navigate
      setFormData({
        // Reset all fields to initial empty state or default values
        civiliteCandidat: "Mme", nomCandidat: "", prenomCandidat: "", dateNaissanceCandidat: "", lieuNaissanceCandidat: "", paysCandidat: "", nationaliteCandidat: "", adresseCandidat: "", villeCandidat: "", codePostalCandidat: "", telephoneCandidat: "", portableCandidat: "", emailCandidat: "", idCandidat: "", photoCandidat: null,
        civiliteRespLegal: "Mr", qualiteRespLegal: "Père", nomRespLegal: "", prenomRespLegal: "", dateNaissanceRespLegal: "", lieuNaissanceRespLegal: "", paysRespLegal: "", nationaliteRespLegal: "", adresseRespLegal: "", villeRespLegal: "", codePostalRespLegal: "", telephoneRespLegal: "", portableRespLegal: "", emailRespLegal: "", idRespLegal: "",
        civiliteRespFin: "Mr", qualiteRespFin: "Père", nomRespFin: "", prenomRespFin: "", dateNaissanceRespFin: "", lieuNaissanceRespFin: "", paysRespFin: "", nationaliteRespFin: "", adresseRespFin: "", villeRespFin: "", codePostalRespFin: "", telephoneRespFin: "", emailRespFin: "", idRespFin: "",
        etudes: [],
        commentaire: "",
      });
      window.location.href = "/documents/genere"; // Navigate after successful save
    } catch (error) {
      console.error("Error creating convention:", error);
      alert("Erreur lors de l'enregistrement de la convention.");
    }
  };

  // --------------------------------------------------------------------------------
  // FONCTION DE GÉNÉRATION DU PDF
  // --------------------------------------------------------------------------------
  const generatePdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = 15;
    const ynovBlue = [0, 51, 102]; // Bleu Ynov foncé
    const grayDark = [50, 50, 50];

    // --- LOGO YNOV ---
    const ynovLogoWidth = 20;
    const ynovLogoHeight = 18;
    try {
        doc.addImage(Ynov, "PNG", margin, yPos, ynovLogoWidth, ynovLogoHeight);
    } catch (e) {
        // En cas d'échec de chargement d'image (fréquent en environnement de dev), on continue
        console.warn("Erreur de chargement d'image Ynov. Poursuite sans logo.");
    }
    
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
    doc.line(margin, yPos + 18, pageWidth - margin, yPos + 18);
    yPos = yPos + 25;
    doc.rect(photoX, photoY, photoW, photoH);
    doc.setFontSize(8);
    doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
    doc.text("Photo d'identité", photoX + photoW / 2, photoY + photoH / 2, { align: "center" });

    // Gestion de la photo asynchrone pour ne pas bloquer le reste
    if (formData.photoCandidat) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgData = e.target.result;
            doc.addImage(imgData, "JPEG", photoX, photoY, photoW, photoH);
            // On finit le PDF après le chargement de l'image
            finishPdf(doc, yPos, margin, pageWidth, pageHeight, grayDark, ynovBlue);
        };
        reader.readAsDataURL(formData.photoCandidat);
    } else {
        // On finit le PDF immédiatement si pas de photo
        finishPdf(doc, yPos, margin, pageWidth, pageHeight, grayDark, ynovBlue);
    }
  };

  // --- Fonction séparée pour finir le PDF (avec un design pro et structuré) ---
  const finishPdf = (doc, yPos, margin, pageWidth, pageHeight, grayDark, ynovBlue) => {
    
    const contentWidth = pageWidth - 2 * margin;

    // Fonction d'aide pour dessiner un titre de section
    const drawSectionHeader = (title) => {
        // Vérifie si un saut de page est nécessaire pour le titre
        if (yPos > pageHeight - margin - 20) {
            doc.addPage();
            yPos = margin;
        }
        doc.setFillColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
        doc.rect(margin, yPos, contentWidth, 6, 'F');
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(title, margin + 2, yPos + 4);
        yPos += 8;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
    };
    
    // Fonction d'aide pour dessiner les données de section (colonnes)
    const drawSectionData = (dataFields) => {
        let col1X = margin + 5;
        let col2X = margin + contentWidth / 3;
        let col3X = margin + 2 * contentWidth / 3;
        let currentX = col1X;

        let startY = yPos;
        let colCounter = 0;
        let rowHeight = 6;
        let maxLines = 0; // Pour gérer la hauteur variable

        dataFields.forEach((item) => {
            // Check for page break BEFORE drawing an item
            if (yPos + rowHeight > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
                startY = yPos;
                colCounter = 0; // Reset columns on new page
            }
            
            // Set current X position
            if (colCounter % 3 === 0) currentX = col1X;
            else if (colCounter % 3 === 1) currentX = col2X;
            else if (colCounter % 3 === 2) currentX = col3X;
            
            // Text drawing (Label : Value)
            doc.setFont("helvetica", "bold");
            doc.text(`${item.label} : `, currentX, yPos, { maxWidth: contentWidth/3 - 10 });
            let labelWidth = doc.getTextWidth(`${item.label} : `);
            doc.setFont("helvetica", "normal");
            
            // Split text if it's too long
            const lines = doc.splitTextToSize(item.value || 'N/A', contentWidth/3 - 10 - labelWidth);
            doc.text(lines, currentX + labelWidth, yPos);
            maxLines = Math.max(maxLines, lines.length);

            colCounter++;
            
            // If the row is complete (3 columns), move yPos down based on the tallest item
            if (colCounter % 3 === 0) {
                yPos += maxLines * rowHeight;
                maxLines = 0; // Reset max lines for the next row
            }
        });
        
        // If the last row was not complete
        if (colCounter % 3 !== 0) {
            yPos += maxLines * rowHeight;
        }
        
        yPos += 5; // Spacing after section
    };

    // --- 1. ÉTAT CIVIL DU CANDIDAT ---
    drawSectionHeader("ÉTAT CIVIL DU CANDIDAT");
    const candidatData = [
        { label: "Nom & Prénom", value: `${formData.nomCandidat} ${formData.prenomCandidat}` },
        { label: "Né(e) le", value: formData.dateNaissanceCandidat.split('-').reverse().join('/') },
        { label: "à / Pays", value: `${formData.lieuNaissanceCandidat} (${formData.paysCandidat})` },
        { label: "Nationalité", value: formData.nationaliteCandidat },
        { label: "ID/Passeport N°", value: formData.idCandidat },
        { label: "Civilité", value: formData.civiliteCandidat },
        { label: "Adresse", value: `${formData.adresseCandidat}, ${formData.codePostalCandidat} ${formData.villeCandidat}` },
        { label: "Email", value: formData.emailCandidat },
        { label: "Tél/Port.", value: `${formData.telephoneCandidat} / ${formData.portableCandidat || 'N/A'}` },
    ];
    drawSectionData(candidatData);

    // --- 2. RESPONSABLE LÉGAL ---
    drawSectionHeader("ÉTAT CIVIL DU RESPONSABLE LÉGAL");
    const legalData = [
        { label: "Nom & Prénom", value: `${formData.nomRespLegal} ${formData.prenomRespLegal}` },
        { label: "Qualité", value: formData.qualiteRespLegal },
        { label: "Né(e) le", value: formData.dateNaissanceRespLegal.split('-').reverse().join('/') },
        { label: "à / Pays", value: `${formData.lieuNaissanceRespLegal} (${formData.paysRespLegal})` },
        { label: "Nationalité", value: formData.nationaliteRespLegal },
        { label: "ID/Passeport N°", value: formData.idRespLegal },
        { label: "Adresse", value: `${formData.adresseRespLegal}, ${formData.codePostalRespLegal} ${formData.villeRespLegal}` },
        { label: "Email", value: formData.emailRespLegal },
        { label: "Tél/Port.", value: `${formData.telephoneRespLegal} / ${formData.portableRespLegal || 'N/A'}` },
    ];
    drawSectionData(legalData);

    // --- 3. RESPONSABLE FINANCIER ---
    drawSectionHeader("ÉTAT CIVIL DU RESPONSABLE FINANCIER");
    const financialData = [
        { label: "Nom & Prénom", value: `${formData.nomRespFin} ${formData.prenomRespFin}` },
        { label: "Qualité", value: formData.qualiteRespFin },
        { label: "Né(e) le", value: formData.dateNaissanceRespFin.split('-').reverse().join('/') },
        { label: "à / Pays", value: `${formData.lieuNaissanceRespFin} (${formData.paysRespFin})` },
        { label: "Nationalité", value: formData.nationaliteRespFin },
        { label: "ID/Passeport N°", value: formData.idRespFin },
        { label: "Adresse", value: `${formData.adresseRespFin}, ${formData.codePostalRespFin} ${formData.villeRespFin}` },
        { label: "Email", value: formData.emailRespFin },
        { label: "Téléphone", value: formData.telephoneRespFin },
    ];
    drawSectionData(financialData);


    // --- 4. ÉTUDES ANTÉRIEURES (Tableau manuel professionnel) ---
    drawSectionHeader("ÉTUDES ANTÉRIEURES");
    
    // Définitions du tableau
    const colWidths = [20, 30, 40, 30, 25]; // Largeurs en mm pour 5 colonnes
    const headers = ['Année Scolaire', 'Étude Suivie', 'Établissement', 'Diplôme', "Date d'obtention"];
    const rowHeight = 7;
    let tableY = yPos;

    // Dessiner l'en-tête du tableau
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(230, 230, 230); // Gris clair pour l'en-tête
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    let currentX = margin;
    
    headers.forEach((header, i) => {
        const width = (colWidths[i] / 145) * contentWidth; // Scale width to contentWidth
        doc.rect(currentX, tableY, width, rowHeight, 'FD'); // Dessine et remplit la cellule
        doc.setTextColor(0, 0, 0);
        doc.text(header, currentX + width / 2, tableY + rowHeight / 2, { align: 'center', baseline: 'middle' });
        currentX += width;
    });
    tableY += rowHeight;

    // Dessiner les lignes de données
    doc.setFont("helvetica", "normal");
    formData.etudes.forEach((etude, i) => {
        // Saut de page pour les lignes du tableau
        if (tableY + rowHeight > pageHeight - margin) {
            doc.addPage();
            tableY = margin;
            // Redessiner l'en-tête sur la nouvelle page
            currentX = margin;
            headers.forEach((header, j) => {
                const width = (colWidths[j] / 145) * contentWidth; 
                doc.rect(currentX, tableY, width, rowHeight, 'F'); 
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "bold");
                doc.text(header, currentX + width / 2, tableY + rowHeight / 2, { align: 'center', baseline: 'middle' });
                currentX += width;
            });
            tableY += rowHeight;
            doc.setFont("helvetica", "normal");
        }

        const dataRow = [
            etude.annee,
            etude.etudeSuivie,
            etude.etablissement,
            etude.diplome,
            etude.dateObtention ? etude.dateObtention.split('-').reverse().join('/') : ''
        ];

        currentX = margin;
        dataRow.forEach((cellData, j) => {
            const width = (colWidths[j] / 145) * contentWidth;
            doc.rect(currentX, tableY, width, rowHeight); // Dessine la cellule
            doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
            doc.text(cellData, currentX + 2, tableY + rowHeight / 2, { align: 'left', baseline: 'middle', maxWidth: width - 4 });
            currentX += width;
        });
        tableY += rowHeight;
    });
    yPos = tableY + 5;


    // --- 5. COMMENTAIRES ---
    if (formData.commentaire) {
        if (yPos > pageHeight - margin - 20) {
            doc.addPage();
            yPos = margin;
        }
        drawSectionHeader("COMMENTAIRES");

        doc.setDrawColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
        doc.setLineWidth(0.2);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
        
        const lines = doc.splitTextToSize(formData.commentaire, contentWidth - 4);
        const commentHeight = (lines.length * 4) + 5; 
        
        doc.rect(margin, yPos - 2, contentWidth, commentHeight);
        doc.text(lines, margin + 2, yPos + 3);
        yPos += commentHeight + 5;
    }


    // --- SIGNATURES ---
    if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = pageHeight - 50;
    } else if (yPos < pageHeight - 50) {
        yPos = pageHeight - 40; // Aligner les signatures en bas de page
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
    doc.text("Fait à __________________________________, le ____ / ____ / ______", margin, yPos);
    yPos = pageHeight - 30;

    // Lignes de signature
    const sigWidth = 80;
    const sigY = pageHeight - 15;
    
    // Candidat
    doc.setFont("helvetica", "bold");
    doc.text("Signature du Candidat", margin, yPos);
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, sigY, margin + sigWidth, sigY);

    // Responsable légal
    const respLegalX = pageWidth / 2 + 10;
    doc.text("Signature du Responsable Légal", respLegalX, yPos);
    doc.line(respLegalX, sigY, respLegalX + sigWidth, sigY);

    // --- Sauvegarde ---
    doc.save(`Convention-${formData.nomCandidat}-${formData.prenomCandidat}.pdf`);
  };
  // --------------------------------------------------------------------------------

  // Reste du code du composant React (non modifié)
  return (
    <DashboardLayout>
      <div className="ce-main-container">
        <div className="ce-content-wrapper">
          <div className="convention-header">
            <img src={Ynov} alt="Ynov Campus" className="logo-ynov" />
            <h1 className="ce-title">Générer une convention d'étude</h1>
          </div>
          <form onSubmit={handleSubmit} className="ce-form">
            {/* ---------------- État civil du candidat ---------------- */}
          <fieldset className="ce-fieldset">
            <legend>ÉTAT CIVIL DU CANDIDAT</legend>
            <div className="ce-grid">
              {/* Civilité */}
              <div className="ce-form-group">
                <label>Civilité :</label>
                <div className="ce-radio-group">
                  <label>
                    <input
                      type="radio"
                      name="civiliteCandidat"
                      value="Mr"
                      checked={formData.civiliteCandidat === "Mr"}
                      onChange={handleChange}
                    />
                    Mr.
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="civiliteCandidat"
                      value="Mme"
                      checked={formData.civiliteCandidat === "Mme"}
                      onChange={handleChange}
                    />
                    Mme.
                  </label>
                </div>
              </div>

              {/* Nom et prénom */}
              <div className="ce-form-group ce-full-width">
                <label>Nom :</label>
                <input type="text" name="nomCandidat" value={formData.nomCandidat} onChange={handleChange} required />
              </div>
              <div className="ce-form-group ce-full-width">
                <label>Prénoms :</label>
                <input type="text" name="prenomCandidat" value={formData.prenomCandidat} onChange={handleChange} required />
              </div>

              {/* Naissance */}
              <div className="ce-form-group">
                <label>Né(e) le :</label>
                <input type="date" name="dateNaissanceCandidat" value={formData.dateNaissanceCandidat} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>à :</label>
                <input type="text" name="lieuNaissanceCandidat" value={formData.lieuNaissanceCandidat} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Pays :</label>
                <input type="text" name="paysCandidat" value={formData.paysCandidat} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Nationalité :</label>
                <input type="text" name="nationaliteCandidat" value={formData.nationaliteCandidat} onChange={handleChange} required />
              </div>

              {/* Adresse */}
              <div className="ce-form-group ce-full-width">
                <label>Adresse :</label>
                <input type="text" name="adresseCandidat" value={formData.adresseCandidat} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Code postal :</label>
                <input type="text" name="codePostalCandidat" value={formData.codePostalCandidat} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Ville :</label>
                <input type="text" name="villeCandidat" value={formData.villeCandidat} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Téléphone :</label>
                <input type="text" name="telephoneCandidat" value={formData.telephoneCandidat} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Portable :</label>
                <input type="text" name="portableCandidat" value={formData.portableCandidat} onChange={handleChange} />
              </div>
              <div className="ce-form-group">
                <label>Email :</label>
                <input type="email" name="emailCandidat" value={formData.emailCandidat} onChange={handleChange} required />
              </div>

              {/* ID et photo */}
              <div className="ce-form-group ce-full-width">
                <label>N° de carte d'identité / passeport / carte de séjour :</label>
                <input type="text" name="idCandidat" value={formData.idCandidat} onChange={handleChange} required />
              </div>
            </div>

            <div className="ce-photo-box">
              {formData.photoCandidat ? (
                <img src={URL.createObjectURL(formData.photoCandidat)} alt={`${formData.nomCandidat} ${formData.prenomCandidat}`} className="ce-photo-preview" />
              ) : (
                <span className="ce-photo-placeholder">Photo d'identité</span>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="ce-photo-input" />
            </div>
          </fieldset>

          {/* ---------------- État civil du responsable légal ---------------- */}
          <fieldset className="ce-fieldset">
            <legend>ÉTAT CIVIL DU RESPONSABLE LEGAL</legend>
            <div className="ce-grid">
              {/* Civilité et qualité */}
              <div className="ce-form-group">
                <label>Civilité :</label>
                <div className="ce-radio-group">
                  <label>
                    <input type="radio" name="civiliteRespLegal" value="Mr" checked={formData.civiliteRespLegal === "Mr"} onChange={handleChange} /> Mr
                  </label>
                  <label>
                    <input type="radio" name="civiliteRespLegal" value="Mme" checked={formData.civiliteRespLegal === "Mme"} onChange={handleChange} /> Mme
                  </label>
                </div>
              </div>

              <div className="ce-form-group">
                <label>Qualité :</label>
                <div className="ce-radio-group">
                  <label>
                    <input type="radio" name="qualiteRespLegal" value="Père" checked={formData.qualiteRespLegal === "Père"} onChange={handleChange} /> Père
                  </label>
                  <label>
                    <input type="radio" name="qualiteRespLegal" value="Mère" checked={formData.qualiteRespLegal === "Mère"} onChange={handleChange} /> Mère
                  </label>
                  <label>
                    <input type="radio" name="qualiteRespLegal" value="Tuteur" checked={formData.qualiteRespLegal === "Tuteur"} onChange={handleChange} /> Tuteur
                  </label>
                </div>
              </div>

              {/* Nom, prénom, naissance */}
              <div className="ce-form-group ce-full-width">
                <label>Nom :</label>
                <input type="text" name="nomRespLegal" value={formData.nomRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group ce-full-width">
                <label>Prénoms :</label>
                <input type="text" name="prenomRespLegal" value={formData.prenomRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Né(e) le :</label>
                <input type="date" name="dateNaissanceRespLegal" value={formData.dateNaissanceRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>à :</label>
                <input type="text" name="lieuNaissanceRespLegal" value={formData.lieuNaissanceRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Pays :</label>
                <input type="text" name="paysRespLegal" value={formData.paysRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Nationalité :</label>
                <input type="text" name="nationaliteRespLegal" value={formData.nationaliteRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group ce-full-width">
                <label>Adresse :</label>
                <input type="text" name="adresseRespLegal" value={formData.adresseRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Code postal :</label>
                <input type="text" name="codePostalRespLegal" value={formData.codePostalRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Ville :</label>
                <input type="text" name="villeRespLegal" value={formData.villeRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Téléphone :</label>
                <input type="text" name="telephoneRespLegal" value={formData.telephoneRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Portable :</label>
                <input type="text" name="portableRespLegal" value={formData.portableRespLegal} onChange={handleChange} />
              </div>
              <div className="ce-form-group">
                <label>Email :</label>
                <input type="email" name="emailRespLegal" value={formData.emailRespLegal} onChange={handleChange} required />
              </div>
              <div className="ce-form-group ce-full-width">
                <label>N° de carte d'identité / passeport / carte de séjour :</label>
                <input type="text" name="idRespLegal" value={formData.idRespLegal} onChange={handleChange} required />
              </div>
            </div>
          </fieldset>

          {/* ---------------- État civil du responsable financier ---------------- */}
          <fieldset className="ce-fieldset">
            <legend>ÉTAT CIVIL DU RESPONSABLE FINANCIER</legend>
            <div className="ce-grid">
              {/* Civilité et qualité */}
              <div className="ce-form-group">
                <label>Civilité :</label>
                <div className="ce-radio-group">
                  <label>
                    <input type="radio" name="civiliteRespFin" value="Mr" checked={formData.civiliteRespFin === "Mr"} onChange={handleChange} /> Mr
                  </label>
                  <label>
                    <input type="radio" name="civiliteRespFin" value="Mme" checked={formData.civiliteRespFin === "Mme"} onChange={handleChange} /> Mme
                  </label>
                </div>
              </div>

              <div className="ce-form-group">
                <label>Qualité :</label>
                <div className="ce-radio-group">
                  <label>
                    <input type="radio" name="qualiteRespFin" value="Père" checked={formData.qualiteRespFin === "Père"} onChange={handleChange} /> Père
                  </label>
                  <label>
                    <input type="radio" name="qualiteRespFin" value="Mère" checked={formData.qualiteRespFin === "Mère"} onChange={handleChange} /> Mère
                  </label>
                  <label>
                    <input type="radio" name="qualiteRespFin" value="Tuteur" checked={formData.qualiteRespFin === "Tuteur"} onChange={handleChange} /> Tuteur
                  </label>
                </div>
              </div>

              {/* Nom, prénom, naissance */}
              <div className="ce-form-group ce-full-width">
                <label>Nom :</label>
                <input type="text" name="nomRespFin" value={formData.nomRespFin} onChange={handleChange} required />
              </div>
              <div className="ce-form-group ce-full-width">
                <label>Prénoms :</label>
                <input type="text" name="prenomRespFin" value={formData.prenomRespFin} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Né(e) le :</label>
                <input type="date" name="dateNaissanceRespFin" value={formData.dateNaissanceRespFin} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>à :</label>
                <input type="text" name="lieuNaissanceRespFin" value={formData.lieuNaissanceRespFin} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Pays :</label>
                <input type="text" name="paysRespFin" value={formData.paysRespFin} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Nationalité :</label>
                <input type="text" name="nationaliteRespFin" value={formData.nationaliteRespFin} onChange={handleChange} required />
              </div>

              {/* Adresse */}
              <div className="ce-form-group ce-full-width">
                <label>Adresse :</label>
                <input type="text" name="adresseRespFin" value={formData.adresseRespFin} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Code postal :</label>
                <input type="text" name="codePostalRespFin" value={formData.codePostalRespFin} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Ville :</label>
                <input type="text" name="villeRespFin" value={formData.villeRespFin} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Téléphone :</label>
                <input type="text" name="telephoneRespFin" value={formData.telephoneRespFin} onChange={handleChange} required />
              </div>
              <div className="ce-form-group">
                <label>Email :</label>
                <input type="email" name="emailRespFin" value={formData.emailRespFin} onChange={handleChange} required />
              </div>
              <div className="ce-form-group ce-full-width">
                <label>N° de carte d'identité / passeport / carte de séjour :</label>
                <input type="text" name="idRespFin" value={formData.idRespFin} onChange={handleChange} required />
              </div>
            </div>
          </fieldset>

          {/* ---------------- Études antérieures ---------------- */}
          <fieldset className="ce-fieldset">
            <legend>ÉTUDES ANTÉRIEURES</legend>
            {formData.etudes.map((etude, index) => (
              <React.Fragment key={index}>
                <div className="ce-grid">
                  
                  {/* Année scolaire */}
                  <div className="ce-form-group">
                    <label>Année scolaire :</label>
                    <select
                      value={etude.annee}
                      onChange={(e) => handleEtudesChange(index, "annee", e.target.value)}
                      required
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="2024-2025">2024-2025</option>
                      <option value="2023-2024">2023-2024</option>
                      <option value="2022-2023">2022-2023</option>
                      <option value="2021-2022">2021-2022</option>
                      <option value="2020-2021">2020-2021</option>
                    </select>
                  </div>

                  {/* Étude suivie */}
                  <div className="ce-form-group">
                    <label>Étude suivie :</label>
                    <select
                      value={etude.etudeSuivie}
                      onChange={(e) => handleEtudesChange(index, "etudeSuivie", e.target.value)}
                      required
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="Lycée">Lycée</option>
                      <option value="BTS">BTS</option>
                      <option value="BUT">BUT</option>
                      <option value="Licence">Licence</option>
                      <option value="Master">Master</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  {/* Établissement fréquenté */}
                  <div className="ce-form-group">
                    <label>Établissement fréquenté :</label>
                    <input
                      type="text"
                      value={etude.etablissement}
                      onChange={(e) => handleEtudesChange(index, "etablissement", e.target.value)}
                      placeholder="Ex: Lycée Jules Ferry"
                      required
                    />
                  </div>

                  {/* Diplôme */}
                  <div className="ce-form-group">
                    <label>Diplôme :</label>
                    <select
                      value={etude.diplome}
                      onChange={(e) => handleEtudesChange(index, "diplome", e.target.value)}
                      required
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="Baccalauréat">Baccalauréat</option>
                      <option value="BTS">BTS</option>
                      <option value="BUT">BUT</option>
                      <option value="Licence">Licence</option>
                      <option value="Master">Master</option>
                      <option value="Doctorat">Doctorat</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  {/* Date d’obtention */}
                  <div className="ce-form-group">
                    <label>Date d'obtention :</label>
                    <input
                      type="date"
                      value={etude.dateObtention}
                      onChange={(e) => handleEtudesChange(index, "dateObtention", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {index < formData.etudes.length - 1 && <div className="ce-etude-separator"></div>}
              </React.Fragment>
            ))}
          </fieldset>

          {/* ---------------- Commentaires ---------------- */}
          <fieldset className="ce-fieldset">
            <legend>COMMENTAIRES</legend>
            <div className="ce-form-group ce-full-width">
              <label>Si vous avez interrompu vos études, veuillez indiquer durée + raison :</label>
              <textarea value={formData.commentaire} onChange={(e) => setFormData({...formData, commentaire: e.target.value})} rows="4" />
            </div>
          </fieldset>

          <div className="ce-form-actions">            
            <button type="button" className="ce-btn-cancel" onClick={() => navigate("/dashboard")}>Annuler</button>
            <button type="submit" className="ce-btn-submit">Générer</button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
  );
  };
  

export default ConventionEtudeForm;
