 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Generer_Convention.css';
import Ynov from '../img/Ynov.png';
import jsPDF from 'jspdf';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';


const Generer = () => {
    const navigate = useNavigate();
    const createConvention = useMutation(api.conventions.createConvention);

    const [formData, setFormData] = useState({
        // Période de stage
        dateDebut: '',
        dateFin: '',
        // Stagiaire
        stagiaireNom: '',
        stagiairePrenom: '',
        stagiaireCivilite: '',
        stagiaireAdresse: '',
        stagiaireCodePostal: '',
        stagiaireVille: '',
        stagiaireTelephone: '',
        stagiaireEmail: '',
        // Entreprise
        entrepriseType: '',
        entrepriseNom: '',
        entrepriseAdresse: '',
        entrepriseCodePostal: '',
        entrepriseVille: '',
        entreprisePays: '',
        entrepriseTelephone: '',
        entrepriseFax: '',
        entrepriseSiteWeb: '',
        entrepriseNbEmployes: '',
        // Représentant
        representantNom: '',
        representantPrenom: '',
        representantCivilite: '',
        representantFonction: '',
        representantTelephone: '',
        representantEmail: '',
        // Descriptif
        taches: '',
        environnementTechno: '',
        formations: '',
        objectifs: '',
        nbCollaborateurs: '',
        commentaires: '',
        // Indemnité
        indemniteMontant: '',
        indemniteMonnaie: 'EUROS',
        indemniteCommentaire: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createConvention(formData);
        generatePdf(); // Appel à la fonction de génération
        setTimeout(() => {
           navigate('/documents/genere');
        }, 1000);
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    // --------------------------------------------------------------------------------
    // FONCTIONS DE GÉNÉRATION DU PDF
    // --------------------------------------------------------------------------------
    const generatePdf = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        let yPos = 15;
         const contentWidth = pageWidth - 2 * margin;
        const ynovBlue = [0, 51, 102]; // Bleu Ynov foncé
        const grayDark = [50, 50, 50];

        // --- EN-TÊTE DU PDF ---
        doc.text(`Du ${formData.dateDebut.split('-').reverse().join('/')} au ${formData.dateFin.split('-').reverse().join('/')}`, pageWidth / 2, yPos + 15, { align: "center" });

        // Ligne de séparation
        doc.setDrawColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
        doc.setLineWidth(1);
        doc.line(margin, yPos + 22, pageWidth - margin, yPos + 22);
        yPos = yPos + 30;


        // Fonction d'aide pour dessiner un titre de section
        const drawSectionHeader = (title) => {
            // Vérifie si un saut de page est nécessaire pour le titre
            if (yPos > pageHeight - margin - 15) {
                doc.addPage();
                yPos = margin;
            }
            doc.setFillColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
            doc.rect(margin, yPos, contentWidth, 6, 'F');
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text(title.toUpperCase(), margin + 2, yPos + 4);
            yPos += 8;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
        };
        
        // Fonction d'aide pour dessiner les données de section (2 colonnes claires)
        const drawSectionData = (dataFields) => {
            let col1X = margin + 2;
            let col2X = margin + contentWidth / 2 + 2; 
            let currentRowY = yPos;
            let rowHeight = 6; 
            
            doc.setFontSize(10); 
            doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]); 

            for (let i = 0; i < dataFields.length; i += 2) {
                if (currentRowY + rowHeight > pageHeight - margin) {
                    doc.addPage();
                    currentRowY = margin;
                }

                // --- Colonne 1 (Élément i) ---
                if (dataFields[i]) {
                    const item = dataFields[i];
                    doc.setFont("helvetica", "bold");
                    doc.text(`${item.label} : `, col1X, currentRowY);
                    let labelWidth = doc.getTextWidth(`${item.label} : `);
                    
                    doc.setFont("helvetica", "normal");
                    // On gère le retour à la ligne pour les adresses longues, par exemple
                    const lines = doc.splitTextToSize(item.value || 'N/A', contentWidth/2 - labelWidth - 5);
                    doc.text(lines, col1X + labelWidth, currentRowY);
                    // Si l'élément a pris plus d'une ligne, on ajuste la hauteur de la ligne
                    rowHeight = Math.max(rowHeight, lines.length * 5); // 5 est un bon coefficient d'espacement pour 10pt
                }

                // --- Colonne 2 (Élément i + 1) ---
                if (dataFields[i + 1]) {
                    const item = dataFields[i + 1];
                    doc.setFont("helvetica", "bold");
                    doc.text(`${item.label} : `, col2X, currentRowY);
                    let labelWidth = doc.getTextWidth(`${item.label} : `);
                    
                    doc.setFont("helvetica", "normal");
                    const lines = doc.splitTextToSize(item.value || 'N/A', contentWidth/2 - labelWidth - 5);
                    doc.text(lines, col2X + labelWidth, currentRowY);
                    rowHeight = Math.max(rowHeight, lines.length * 5);
                }

                // Avance à la ligne suivante avec l'espacement garanti
                currentRowY += rowHeight > 6 ? rowHeight : 6; 
                rowHeight = 6; // Réinitialiser la hauteur de base pour la prochaine ligne
            }
            
            yPos = currentRowY + 3; // Petit espacement après la section
        };

        // --- 1. LE STAGIAIRE ---
        drawSectionHeader("Informations sur le Stagiaire");
        const stagiaireData = [
            { label: "Nom & Prénom", value: `${formData.stagiaireNom} ${formData.stagiairePrenom}` },
            { label: "Civilité", value: formData.stagiaireCivilite },
            { label: "Adresse", value: `${formData.stagiaireAdresse}, ${formData.stagiaireCodePostal} ${formData.stagiaireVille}` },
            { label: "Email", value: formData.stagiaireEmail },
            { label: "Téléphone", value: formData.stagiaireTelephone },
        ];
        drawSectionData(stagiaireData);
        
        // --- 2. L'ENTREPRISE ---
        drawSectionHeader("Informations sur l'Entreprise");
        const entrepriseData = [
            { label: "Nom de l'entreprise", value: formData.entrepriseNom },
            { label: "Type d'entreprise", value: formData.entrepriseType || 'N/A' },
            { label: "Adresse", value: `${formData.entrepriseAdresse}, ${formData.entrepriseCodePostal} ${formData.entrepriseVille} (${formData.entreprisePays})` },
            { label: "Téléphone / Fax", value: `${formData.entrepriseTelephone || 'N/A'} / ${formData.entrepriseFax || 'N/A'}` },
            { label: "Site Web", value: formData.entrepriseSiteWeb || 'N/A' },
            { label: "Nombre d'employés", value: formData.entrepriseNbEmployes || 'N/A' },
        ];
        drawSectionData(entrepriseData);

        // --- 3. REPRÉSENTANT DE L'ENTREPRISE ---
        drawSectionHeader("Représentant (Tuteur de stage)");
        const representantData = [
            { label: "Nom & Prénom", value: `${formData.representantNom} ${formData.representantPrenom}` },
            { label: "Civilité", value: formData.representantCivilite },
            { label: "Fonction", value: formData.representantFonction || 'N/A' },
            { label: "Email", value: formData.representantEmail || 'N/A' },
            { label: "Téléphone", value: formData.representantTelephone || 'N/A' },
        ];
        drawSectionData(representantData);


        // --- 4. DESCRIPTIF DU STAGE ---
        drawSectionHeader("Descriptif et Objectifs du Stage");
        
        const drawTextBlock = (label, content) => {
            if (yPos > pageHeight - margin - 30) {
                doc.addPage();
                yPos = margin;
            }
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(label, margin + 2, yPos);
            yPos += 4;
            
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(content || 'Non spécifié.', contentWidth - 4);
            doc.text(lines, margin + 2, yPos);
            yPos += lines.length * 4.5 + 4; // Espacement ajusté
        };

        drawTextBlock("Tâches quotidiennes du stagiaire :", formData.taches);
        drawTextBlock("Environnement technologique :", formData.environnementTechno);
        drawTextBlock("Formations prévues :", formData.formations);
        drawTextBlock("Objectifs pédagogiques :", formData.objectifs);
        drawTextBlock(`Nombre de collaborateurs dans l'équipe : ${formData.nbCollaborateurs || 'N/A'}`, '');

        // --- 5. INDEMNITÉ DE STAGE ---
        drawSectionHeader("Indemnité de Stage");
        const indemniteData = [
            { label: "Montant", value: `${formData.indemniteMontant || 'Non spécifié'} ${formData.indemniteMonnaie}` },
        ];
        drawSectionData(indemniteData); // Utilisation de drawSectionData pour l'indemnité simple
        
        drawTextBlock("Commentaire sur l'indemnité :", formData.indemniteCommentaire);


        // --- SIGNATURES ---
        // S'assurer que les signatures sont bien en bas de page
        let sigYPos = pageHeight - 40;
        if (yPos > pageHeight - 60) {
             doc.addPage();
             sigYPos = pageHeight - 60;
        }

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

        // --- Sauvegarde ---
        doc.save(`Convention_Stage_${formData.stagiaireNom}_${formData.stagiairePrenom}.pdf`);
    };
    // --------------------------------------------------------------------------------

    // Reste du code du composant React (votre formulaire HTML)
  return (
    <DashboardLayout pageTitle="Générer une Convention de Stage" pageDescription="">
      <div className="convention-container">
                <form onSubmit={handleSubmit} className="convention-form">

                <fieldset>
                    <legend>Période de stage</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="dateDebut">Date de début</label>
                            <input type="date" id="dateDebut" name="dateDebut" value={formData.dateDebut} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dateFin">Date de fin</label>
                            <input type="date" id="dateFin" name="dateFin" value={formData.dateFin} onChange={handleChange} required />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Le Stagiaire</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="stagiaireNom">Nom</label>
                            <input type="text" id="stagiaireNom" name="stagiaireNom" value={formData.stagiaireNom} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stagiairePrenom">Prénom</label>
                            <input type="text" id="stagiairePrenom" name="stagiairePrenom" value={formData.stagiairePrenom} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stagiaireCivilite">Civilité</label>
                            <select id="stagiaireCivilite" name="stagiaireCivilite" value={formData.stagiaireCivilite} onChange={handleChange}>
                                <option>Monsieur</option>
                                <option>Madame</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="stagiaireAdresse">Adresse</label>
                            <input type="text" id="stagiaireAdresse" name="stagiaireAdresse" value={formData.stagiaireAdresse} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stagiaireCodePostal">Code Postal</label>
                            <input type="text" id="stagiaireCodePostal" name="stagiaireCodePostal" value={formData.stagiaireCodePostal} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stagiaireVille">Ville</label>
                            <input type="text" id="stagiaireVille" name="stagiaireVille" value={formData.stagiaireVille} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stagiaireTelephone">Téléphone</label>
                            <input type="tel" id="stagiaireTelephone" name="stagiaireTelephone" value={formData.stagiaireTelephone} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stagiaireEmail">Adresse E-mail</label>
                            <input type="email" id="stagiaireEmail" name="stagiaireEmail" value={formData.stagiaireEmail} onChange={handleChange} required />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>L'Entreprise</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="entrepriseType">Type d'entreprise</label>
                            <input type="text" id="entrepriseType" name="entrepriseType" value={formData.entrepriseType} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="entrepriseNom">Nom de l'entreprise</label>
                            <input type="text" id="entrepriseNom" name="entrepriseNom" value={formData.entrepriseNom} onChange={handleChange} required />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="entrepriseAdresse">Adresse</label>
                            <input type="text" id="entrepriseAdresse" name="entrepriseAdresse" value={formData.entrepriseAdresse} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="entrepriseCodePostal">Code Postal</label>
                            <input type="text" id="entrepriseCodePostal" name="entrepriseCodePostal" value={formData.entrepriseCodePostal} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="entrepriseVille">Ville</label>
                            <input type="text" id="entrepriseVille" name="entrepriseVille" value={formData.entrepriseVille} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="entreprisePays">Pays</label>
                            <input type="text" id="entreprisePays" name="entreprisePays" value={formData.entreprisePays} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="entrepriseTelephone">Téléphone</label>
                            <input type="tel" id="entrepriseTelephone" name="entrepriseTelephone" value={formData.entrepriseTelephone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="entrepriseFax">Fax</label>
                            <input type="tel" id="entrepriseFax" name="entrepriseFax" value={formData.entrepriseFax} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="entrepriseSiteWeb">Site Web</label>
                            <input type="url" id="entrepriseSiteWeb" name="entrepriseSiteWeb" value={formData.entrepriseSiteWeb} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="entrepriseNbEmployes">Nombre d'employés</label>
                            <input type="number" id="entrepriseNbEmployes" name="entrepriseNbEmployes" value={formData.entrepriseNbEmployes} onChange={handleChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Représentant de l'entreprise</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="representantNom">Nom</label>
                            <input type="text" id="representantNom" name="representantNom" value={formData.representantNom} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="representantPrenom">Prénom</label>
                            <input type="text" id="representantPrenom" name="representantPrenom" value={formData.representantPrenom} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="representantCivilite">Civilité</label>
                            <select id="representantCivilite" name="representantCivilite" value={formData.representantCivilite} onChange={handleChange}>
                                <option>Monsieur</option>
                                <option>Madame</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="representantFonction">Fonction</label>
                            <input type="text" id="representantFonction" name="representantFonction" value={formData.representantFonction} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="representantTelephone">Téléphone</label>
                            <input type="tel" id="representantTelephone" name="representantTelephone" value={formData.representantTelephone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="representantEmail">Adresse E-mail</label>
                            <input type="email" id="representantEmail" name="representantEmail" value={formData.representantEmail} onChange={handleChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Descriptif du stage</legend>
                    <div className="form-grid-single">
                        <div className="form-group">
                            <label htmlFor="taches">Tâches quotidiennes du stagiaire</label>
                            <textarea id="taches" name="taches" value={formData.taches} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="environnementTechno">Environnement technologique</label>
                            <textarea id="environnementTechno" name="environnementTechno" value={formData.environnementTechno} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="formations">Formations prévues</label>
                            <textarea id="formations" name="formations" value={formData.formations} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="objectifs">Objectifs pédagogiques</label>
                            <textarea id="objectifs" name="objectifs" value={formData.objectifs} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="nbCollaborateurs">Nombre de collaborateurs dans l'équipe</label>
                            <input type="number" id="nbCollaborateurs" name="nbCollaborateurs" value={formData.nbCollaborateurs} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="commentaires">Commentaires</label>
                            <textarea id="commentaires" name="commentaires" value={formData.commentaires} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Indemnité de stage</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="indemniteMontant">Montant</label>
                            <input type="number" id="indemniteMontant" name="indemniteMontant" value={formData.indemniteMontant} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="indemniteMonnaie">Monnaie</label>
                            <select id="indemniteMonnaie" name="indemniteMonnaie" value={formData.indemniteMonnaie} onChange={handleChange}>
                                <option>EUROS</option>
                                <option>FCFA</option>
                                <option>MAD</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="indemniteCommentaire">Commentaire</label>
                            <textarea id="indemniteCommentaire" name="indemniteCommentaire" value={formData.indemniteCommentaire} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </fieldset>

                <div className="form-actions">
                    <button onClick={handleBack} className="cancel-button">Annuler</button>
                    <button type="submit" className="submit-button" onClick={() => navigate("/dashboard")}>Générer la convention</button>        
                </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default Generer;
