import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Ynov from "../img/Ynov.png";
import "./Attestation.css";
import { generateAttestationInscriptionPDF } from '../utils/modernPdfGenerator';
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';

const INFOS_ETABLISSEMENT = {
  directeur: "Mr. Amine ZNIBER",
  adresse: "8 Rue Ibnou Khatima - Quartier des Hôpitaux- Casablanca",
  nom_complet: "IDG Maroc- YNOV CAMPUS",
  details_legaux: "Société anonyme au capital de 6.400.000 DH - 88 Rue Ibnou Khatima - Quartier des Hôpitaux- Casablanca\nCNSS : 7164833-IF:1023591 -RC:144155 -PATENTE:36330905-ICE:001645521000037"
};

const AttestationInscription = () => {
  const navigate = useNavigate();
  const addDemande = useMutation(api.demandes.addDemande);

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
    const { name, value} = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePdf = () => { generateAttestationInscriptionPDF(formData, Ynov); };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDemande({
        nom: formData.nom,
        prenom: formData.prenom,
        dateNaissance: formData.dateNaissance,
        promotion: formData.promotion,
        specialite: formData.specialite,
        anneeScolaire: formData.anneeScolaire,
        type: 'Attestation d’inscription',
        date: formData.date,
      });
    } catch (err) {
      console.error("Erreur persistance attestation:", err);
      alert("Échec de l'enregistrement de l'attestation.");
      return;
    }

    generatePdf();
    navigate("/demandes");
  };

  return (
    <DashboardLayout pageTitle="Demander une attestation d’inscription" pageDescription="">
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

export default AttestationInscription;
