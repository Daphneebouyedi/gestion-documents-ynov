import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Ynov from "../img/Ynov.png";
import "./Attestation.css";
import jsPDF from 'jspdf';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';

// --- Informations fixes de l'établissement 
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
// -----------------------------------------------------------

const AttestationForm = () => {
  const navigate = useNavigate();
  const requestAttestation = useMutation(api.attestations.requestAttestation);

  const [formData, setFormData] = useState({
    // Infos Étudiant
    nom: "",
    prenom: "",
    dateNaissance: "",
    // Infos Formation
    promotion: "",
    specialite: "",
    anneeScolaire: "",

    // Infos Paiement
    modalitePaiement: "",
    fraisPreinscription: "",
    fraisScolarite: "",
    totalPaye: "",
    modePaiement: "",
    date: new Date().toISOString().substring(0, 10),
  });

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePdf = () => {
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
        { label: "Nom et Prénom", value: `${formData.nom} ${formData.prenom}` },
        { label: "Date de naissance", value: formData.dateNaissance.split('-').reverse().join('/') },
        { label: "Promotion", value: formData.promotion },
        { label: "Spécialité", value: formData.specialite },
        { label: "Année scolaire", value: formData.anneeScolaire },
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
        { label: "Frais de préinscription", montant: formData.fraisPreinscription, modalite: "N/A", mode: formData.modePaiement },
        { label: "Frais de scolarité", montant: formData.fraisScolarite, modalite: formData.modalitePaiement, mode: formData.modePaiement },
    ];
    
    // Ligne TOTAL
    paymentRows.push({ 
        label: "TOTAL PAYÉ", 
        montant: formData.totalPaye, 
        modalite: '', 
        mode: '' ,
        isTotal: true
    });

    paymentRows.forEach((row) => {
        // Fond gris clair pour l'alternance et le total
        if (!row.isTotal) {
            doc.setFillColor(255, 255, 255);
        }
        // ... ici le code de dessin PDF pour chaque ligne ...
        // (le code JSX a été supprimé car il n'a rien à faire ici)
        // Placez ici le code de dessin des cellules PDF pour chaque ligne
        // Exemple :
        // doc.text(...)
        // yPos += rowHeight;
        // if (row.isTotal) doc.setFont("helvetica", "normal");
    });

    yPos += 10;
    
    // Phrase finale
    doc.setFontSize(11);
    doc.text(`La présente attestation confirme que M/Mme ${formData.nom} ${formData.prenom} a réglé un montant total de ${formData.totalPaye} MAD au titre de l'année scolaire ${formData.anneeScolaire}.`, margin, yPos, {
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
    doc.text(`Fait à Casablanca, le ${formData.date.split('-').reverse().join('/')}`, pageWidth - margin, yPos, { align: 'right' });
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
    
    // --- Sauvegarde ---
    doc.save(`Attestation_Scolarite_${formData.nom}_${formData.prenom}.pdf`);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await requestAttestation({
        nom: formData.nom,
        prenom: formData.prenom,
        dateNaissance: formData.dateNaissance,
        promotion: formData.promotion,
        specialite: formData.specialite,
        anneeScolaire: formData.anneeScolaire,
        modalitePaiement: formData.modalitePaiement,
        fraisPreinscription: Number(formData.fraisPreinscription),
        fraisScolarite: Number(formData.fraisScolarite),
        totalPaye: Number(formData.totalPaye),
        modePaiement: formData.modePaiement,
        date: formData.date,
      });
    } catch (err) {
      console.error("Erreur persistance attestation:", err);
      alert("Échec de l'enregistrement de l'attestation.");
      return;
    }

    // Générer et télécharger le PDF
    generatePdf();

    // Rediriger vers la page des documents générés
    navigate("/documents/genere");
  };

  return (
    <DashboardLayout pageTitle="Générer une attestation de frais de scolarité" pageDescription="">
      <div className="content-wrapper">

        <form className="attestation-form" onSubmit={handleSubmit}>
          {/* ... (votre JSX de formulaire inchangé) ... */}
          <fieldset>
            <legend>Informations de l'Étudiant</legend>
            <div className="ce-grid">
              <div className="ce-form-group">
                <label>Nom :</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="ce-form-group">
                <label>Prénom :</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="ce-form-group">
                <label>Date de naissance :</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Informations de la Formation</legend>
            <div className="ce-grid">
              <div className="ce-form-group">
                <label>Promotion :</label>
                <select
                  name="promotion"
                  value={formData.promotion}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="B1">Bachelor 1</option>
                  <option value="B2">Bachelor 2</option>
                  <option value="B3">Bachelor 3</option>
                  <option value="M1">Mastère 1</option>
                  <option value="M2">Mastère 2</option>
                </select>
              </div>
              <div className="ce-form-group">
                <label>Spécialité :</label>
                <select
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Data IA">Data IA</option>
                  <option value="Développement">Développement</option>
                  <option value="Cybersécurité">Cybersécurité</option>
                  <option value="Informatique">Informatique</option>
                </select>
              </div>
              <div className="ce-form-group">
                <label>Année scolaire :</label>
                <input
                  type="text"
                  name="anneeScolaire"
                  value={formData.anneeScolaire}
                  onChange={handleChange}
                  placeholder="2025-2026"
                  required
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Détails du Paiement</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>Modalité de paiement :</label>
                <select
                  name="modalitePaiement"
                  value={formData.modalitePaiement}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Trismestrielle">Trismestrielle</option>
                  <option value="Semestrielle">Semestrielle</option>
                  <option value="Un coup">Un coup (Annuel)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Frais de préinscription (MAD) :</label>
                <input
                  type="number"
                  name="fraisPreinscription"
                  value={formData.fraisPreinscription}
                  onChange={handleChange}
                  placeholder="Ex: 500"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Frais de scolarité (MAD) :</label>
                <input
                  type="number"
                  name="fraisScolarite"
                  value={formData.fraisScolarite}
                  onChange={handleChange}
                  placeholder="Ex: 8000"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Total payé (MAD) :</label>
                <input
                  type="number"
                  name="totalPaye"
                  value={formData.totalPaye}
                  onChange={handleChange}
                  placeholder="Ex: 8500"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Mode de paiement :</label>
                <select
                  name="modePaiement"
                  value={formData.modePaiement}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="CB">Carte bancaire</option>
                  <option value="Virement">Virement bancaire</option>
                  <option value="Cheque">Chèque</option>
                  <option value="Especes">Espèces</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fait le :</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </fieldset>
          
          <fieldset>
            <legend>Informations Bancaires de l'Établissement</legend>
            <div className="form-grid">
              <div className="form-group full-width">
                <p>Mode de paiement: Un virement bancaire dont vous trouverez les références ci-dessous:</p>
                <div className="bank-details">
                  <p><b>RIB: </b> 011 780 0000 20 210 00 02815 55</p>
                  <p><b>IBAN:</b> MA64011780000020210000281555</p>
                  <p><b>SWIFT: </b> BMCEMA55</p>
                  <p><b>CODE GUICHET: </b> 78020</p>
                </div>
                <p>NB: Il faut remettre à l'école la copie de l'ordre de virement effectué.</p>
                <p>Cette attestation est délivrée à l'intéressé, à sa demande, pour servir et valoir ce que de droit.</p>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Informations de l'Établissement</legend>
            <div className="form-grid">
              <div className="form-group full-width">
                <p>IDG Maroc- YNOV CAMPUS <br />
                Société anonyme au capital de 6.400.000 DH - 88 Rue Ibnou Khatima - Quartier des Hôpitaux- Casablanca 
                CNSS : 7164833-IF:1023591 -RC:144155 -PATENTE:36330905-ICE:001645521000037</p>
              </div>
            </div>
          </fieldset>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/dashboard")}
            >
              Annuler
            </button>
            <button type="submit" className="btn-generate">
              Générer l’attestation
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>

  );
}

export default AttestationForm;
