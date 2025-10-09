import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Demandes-Mails.css";
import Ynov from "../img/Ynov.png";

const DemandesMails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [showGenererMenu, setShowGenererMenu] = useState(false);
  const genererMenuRef = useRef();

  const [demandes] = useState([
    { id: 1, date: "18/08/2025 10:00", personne: "Laz Livith Désiré", message: "Laz Livith Désiré demande son bulletin de bachelor.", type: "Bulletin" },
    { id: 2, date: "18/08/2025 13:00", personne: "Walid Mouahiddi", message: "Walid Mouahiddi demande la réédition de son badge étudiant.", type: "Convention" },
    { id: 3, date: "18/08/2025 14:00", personne: "Amine Fatih", message: "Amine Fatih demande son bulletin de bachelor.", type: "Bulletin" },
    { id: 4, date: "19/08/2025 09:30", personne: "Chaimaa Mellouk", message: "Chaimaa Mellouk demande une attestation de scolarité.", type: "Attestation" },
    { id: 5, date: "19/08/2025 11:45", personne: "Laila Lamsaski", message: "Laila Lamsaski demande un relevé de notes du semestre 2.", type: "Relevé de notes" },
    { id: 6, date: "21/08/2025 10:10", personne: "Sam Essoh", message: "Sam Essoh demande un certificat de scolarité.", type: "Certificat" },
    { id: 7, date: "20/08/2025 15:20", personne: "Nabel Abdel Ali", message: "Nabil Abdel Ali demande la réédition de son badge étudiant.", type: "Convention" },
  ]);

  const demande = demandes.find((d) => d.id === parseInt(id));

  const handleReplyClick = () => {
    if (demande) {
      navigate(`/reponse-mail/${demande.id}`);
    }
  };

  const handleNavigation = (path) => {
    navigate(`/${path}`);
    setShowGenererMenu(false);
  };

  // Fermer le menu si clic à l’extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genererMenuRef.current && !genererMenuRef.current.contains(event.target)) {
        setShowGenererMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!demande) {
    return <p>Aucune demande trouvée pour cet ID.</p>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section-dashboard">
          <img src={Ynov} alt="Ynov Campus" className="logo-image" />
        </div>
        <nav className="navigation">
          <button className="nav-button" onClick={() => navigate("/dashboard")}>
            Accueil
          </button>
          <button className="nav-button active" onClick={() => navigate("/notifications")}>
            Notifications
          </button>
          <button className="nav-button" onClick={() => navigate("/documents-dispo")}>
            Documents
          </button>

          {/* Menu déroulant Générer */}
          <div style={{ position: "relative" }} ref={genererMenuRef}>
            <button
              className="nav-button"
              onClick={() => setShowGenererMenu(!showGenererMenu)}
            >
              Générer un document{" "}
              <span style={{ marginLeft: "5px" }}>{showGenererMenu ? "" : ""}</span>
            </button>
            {showGenererMenu && (
              <div className="floating-menu">
                <button
                  className="nav-button floating-menu-item"
                  onClick={() => handleNavigation("generer/convention-etude")}
                >
                  Convention d'étude
                </button>
                <button
                  className="nav-button floating-menu-item"
                  onClick={() => handleNavigation("generer/attestation")}
                >
                  Attestation
                </button>
                <button
                  className="nav-button floating-menu-item"
                  onClick={() => handleNavigation("generer/convention-stage")}
                >
                  Convention de stage
                </button>
              </div>
            )}
          </div>

          <button className="nav-button" onClick={() => navigate("/profil")}>
            Profil
          </button>
          <button className="nav-button logout" onClick={() => navigate("/login")}>
            Déconnexion
          </button>
        </nav>
      </div>

      {/* Contenu du mail */}
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="welcome-title-dashboard">Mail de demandes</h1>

          <div className="mail-item">
            <div className="mail-header">
              <p>
                <strong>Objet :</strong> Demande de {demande.type}
              </p>
              <p>
                <strong>Envoyé par :</strong> {demande.personne} – le {demande.date}
              </p>
            </div>

            <div className="mail-body">
              <p>Bonjour Madame, Monsieur,</p>
              <p>
                Je me permets de vous contacter afin de solliciter{" "}
                {demande.type === "Bulletin" && "mon bulletin de bachelor"}
                {demande.type === "Convention" && "la réédition de mon badge étudiant"}
                {demande.type === "Attestation" && "une attestation de scolarité"}
                {demande.type === "Relevé de notes" && "mon relevé de notes du semestre 2"}
                {demande.type === "Certificat" && "mon certificat de scolarité"}.
              </p>
              <p>Je vous remercie par avance pour votre aide et votre retour.</p>
            </div>

            <div className="mail-footer">
              <p>Cordialement,</p>
              <p>
                <strong>{demande.personne}</strong>
              </p>
            </div>
          </div>
          <div className="mail-actions">
            <button className="btn-reply" onClick={handleReplyClick}>
              Répondre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandesMails;
