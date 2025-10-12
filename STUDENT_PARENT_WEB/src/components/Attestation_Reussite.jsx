import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Ynov from "../img/Ynov.png";
import "./Attestation.css";
import jsPDF from 'jspdf';
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';

const INFOS_ETABLISSEMENT = {
  directeur: "Mr. Amine ZNIBER",
  adresse: "8 Rue Ibnou Khatima - Quartier des Hôpitaux- Casablanca",
  nom_complet: "IDG Maroc- YNOV CAMPUS",
  details_legaux: "Société anonyme au capital de 6.400.000 DH - 88 Rue Ibnou Khatima - Quartier des Hôpitaux- Casablanca\nCNSS : 7164833-IF:1023591 -RC:144155 -PATENTE:36330905-ICE:001645521000037"
};

const AttestationReussite = () => {
  const navigate = useNavigate();
  const requestAttestation = useMutation(api.attestations.requestAttestation);

  const [token, setToken] = useState(null);
  const [userIdFromToken, setUserIdFromToken] = useState(null);
  const verifyTokenAction = useAction(api.authActions.verifyTokenAction);
  const user = useQuery(api.auth.getUser, userIdFromToken ? { userId: userIdFromToken } : "skip");

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    promotion: "",
    specialite: "",
    anneeScolaire: "",
    moyenne: "",
    mention: "",
    date: new Date().toISOString().substring(0, 10),
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      setToken(storedToken);
      const verifyAndSetUserId = async () => {
        try {
          const id = await verifyTokenAction({ token: storedToken });
          setUserIdFromToken(id);
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("jwtToken");
          navigate("/login");
        }
      };
      verifyAndSetUserId();
    } else {
      navigate("/login");
    }
  }, [token, verifyTokenAction, navigate]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nom: user.lastName || '',
        prenom: user.firstName || '',
        dateNaissance: user.dateNaissance || user.dateOfBirth || '',
        promotion: user.promotion || '',
        specialite: user.specialite || '',
      }));
    }
  }, [user]);

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

    const ynovBlue = [0, 51, 102];
    const ynovTeal = [78, 205, 196];

    try {
        doc.addImage(Ynov, "PNG", margin, yPos, 20, 18);
    } catch (e) {
        console.warn("Erreur de chargement du logo Ynov. Poursuite sans logo.");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
    doc.text("ATTESTATION DE RÉUSSITE", pageWidth - margin, yPos + 10, { align: 'right' });
    yPos += 30;

    doc.setDrawColor(ynovTeal[0], ynovTeal[1], ynovTeal[2]);
    doc.setLineWidth(0.8);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    doc.text(`IDG - YNOV CAMPUS`, margin, yPos);
    doc.text(`Représenté par : ${INFOS_ETABLISSEMENT.directeur}, Directeur Général`, margin, yPos + 5);
    doc.text(`Adresse : ${INFOS_ETABLISSEMENT.adresse}`, margin, yPos + 10);
    yPos += 20;

    doc.setFontSize(12);
    const introText = `Je soussigné ${INFOS_ETABLISSEMENT.directeur}, Directeur Général d'IDG - YNOV CAMPUS, sise au ${INFOS_ETABLISSEMENT.adresse}, atteste par la présente que :`;
    const introLines = doc.splitTextToSize(introText, contentWidth);
    doc.text(introLines, margin, yPos);
    yPos += introLines.length * 6 + 8;

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos - 2, contentWidth, 50, 'F');
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(ynovBlue[0], ynovBlue[1], ynovBlue[2]);
    doc.text("INFORMATIONS DE L'ÉTUDIANT ET RÉSULTATS", margin + 2, yPos + 3);

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
        { label: "Moyenne générale", value: formData.moyenne },
        { label: "Mention", value: formData.mention },
    ];

    studentInfo.forEach((item, index) => {
        let x = index % 2 === 0 ? col1 : col2;
        doc.setFont("helvetica", "bold");
        doc.text(`${item.label} : `, x, currentLineY);
        let labelWidth = doc.getTextWidth(`${item.label} : `);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(item.value || 'N/A', contentWidth/2 - labelWidth - 5);
        doc.text(lines, x + labelWidth, currentLineY);
        if (index % 2 !== 0) {
            currentLineY += 8;
        }
    });

    yPos = currentLineY + 10;

    doc.setFontSize(11);
    doc.text(`Cette attestation confirme que M/Mme ${formData.nom} ${formData.prenom} a réussi l'année scolaire ${formData.anneeScolaire} avec une moyenne de ${formData.moyenne} et la mention ${formData.mention}.`, margin, yPos, {
        maxWidth: contentWidth
    });
    yPos += 10;

    if (yPos > doc.internal.pageSize.getHeight() - 80) {
        doc.addPage();
        yPos = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.text("MENTIONS LÉGALES :", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    const legalText = `IDG Maroc- YNOV CAMPUS, ${INFOS_ETABLISSEMENT.details_legaux}`;
    const legalLines = doc.splitTextToSize(legalText, contentWidth);
    doc.text(legalLines, margin, yPos);
    yPos += legalLines.length * 4.5 + 5;

    const conclusion = "Cette attestation est délivrée à l'intéressé(e), à sa demande, pour servir et valoir ce que de droit.";
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.text(conclusion, margin, yPos);
    yPos += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Fait à Casablanca, le ${formData.date.split('-').reverse().join('/')}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(INFOS_ETABLISSEMENT.directeur, pageWidth - margin, yPos, { align: 'right' });
    doc.setFontSize(10);
    doc.text("Directeur Général", pageWidth - margin, yPos + 5, { align: 'right' });

    doc.save(`Attestation_Reussite_${formData.nom}_${formData.prenom}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userIdFromToken) {
      alert("Erreur: Utilisateur non identifié");
      return;
    }

    try {
      await requestAttestation({
        nom: formData.nom,
        prenom: formData.prenom,
        dateNaissance: formData.dateNaissance,
        promotion: formData.promotion,
        specialite: formData.specialite,
        anneeScolaire: formData.anneeScolaire,
        moyenne: formData.moyenne,
        mention: formData.mention,
        type: 'Attestation de réussite',
        date: formData.date,
        userId: userIdFromToken,
        email: user?.email || '',
        userName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        requestType: 'Attestation',
        status: 'En attente',
      });
      
      alert("Demande d'attestation de réussite envoyée avec succès!");
      generatePdf();
      navigate("/demandes");
    } catch (err) {
      console.error("Erreur persistance attestation:", err);
      alert("Échec de l'enregistrement de l'attestation.");
      return;
    }
  };

  return (
    <DashboardLayout pageTitle="Demander une attestation de réussite" pageDescription="">
      <div className="content-wrapper">
        <form className="attestation-form" onSubmit={handleSubmit}>
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
                  readOnly
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
                  readOnly
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
                  readOnly
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
            <legend>Résultats</legend>
            <div className="ce-grid">
              <div className="ce-form-group">
                <label>Moyenne générale :</label>
                <input
                  type="number"
                  step="0.01"
                  name="moyenne"
                  value={formData.moyenne}
                  onChange={handleChange}
                  placeholder="Ex: 15.5"
                  min="0"
                  required
                />
              </div>
              <div className="ce-form-group">
                <label>Mention :</label>
                <select
                  name="mention"
                  value={formData.mention}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Très bien">Très bien</option>
                  <option value="Bien">Bien</option>
                  <option value="Assez bien">Assez bien</option>
                  <option value="Passable">Passable</option>
                </select>
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
              Demander 
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AttestationReussite;
