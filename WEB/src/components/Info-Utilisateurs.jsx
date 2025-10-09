import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Info-Utilisateurs.css";
import Ynov from "../img/Ynov.png";

// Données fictives
const fakeUsers = [
  { id: 1, nom: "OUTALEB", prenom: "Manel", email: "manel.outaleb@ynov.com", role: "Étudiant", promotion: "Master I", specialite: "Data & IA", statut: "Actif", telephone: "0612345678", photo: "https://placehold.co/120x120/4a90e2/ffffff?text=MO" },
  { id: 2, nom: "Souiri", prenom: "Frederic", email: "frederic.souiri@ynov.com", role: "Parents", promotion: "", specialite: "", statut: "Inactif", telephone: "0698765432", photo: "https://placehold.co/120x120/f39c12/ffffff?text=FS" },
  { id: 3, nom: "Bernard", prenom: "Emma", email: "emma.bernard@ynov.com", role: "Admin", promotion: "", specialite: "", statut: "Actif", telephone: "0687654321", photo: "https://placehold.co/120x120/8e44ad/ffffff?text=EB" },
  { id: 4, nom: "Martin", prenom: "Lucas", email: "martin.lucas@ynov.com", role: "Admin", promotion: "", specialite: "", statut: "Actif", telephone: "0676543210", photo: "https://placehold.co/120x120/2ecc71/ffffff?text=LM" },
  { id: 5, nom: "Essoh", prenom: "Alice", email: "alice.essoh@ynov.com", role: "Parents", promotion: "", specialite: "", statut: "Inactif", telephone: "0654321098", photo: "https://placehold.co/120x120/e74c3c/ffffff?text=AE" },
  { id: 6, nom: "Livith-Desiré", prenom: "Laz", email: "laz.livith-desire@ynov.com", role: "Étudiant", promotion: "Bachelor III", specialite: "Cybersécurité", statut: "Actif", telephone: "0643210987", photo: "https://placehold.co/120x120/3498db/ffffff?text=LL" }
];

const InfoUtilisateurs = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showDocumentsMenu, setShowDocumentsMenu] = useState(false);
  const [showGenerateMenu, setShowGenerateMenu] = useState(false);
  const [showProfilMenu, setShowProfilMenu] = useState(false);

  const documentsMenuRef = useRef(null);
  const generateMenuRef = useRef(null);
  const profilMenuRef = useRef(null);

  const user = fakeUsers.find(u => u.id === parseInt(id));

  const handleNavigation = (path) => {
    navigate(`/${path}`);
    setShowDocumentsMenu(false);
    setShowGenerateMenu(false);
    setShowProfilMenu(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (documentsMenuRef.current && !documentsMenuRef.current.contains(event.target)) setShowDocumentsMenu(false);
      if (generateMenuRef.current && !generateMenuRef.current.contains(event.target)) setShowGenerateMenu(false);
      if (profilMenuRef.current && !profilMenuRef.current.contains(event.target)) setShowProfilMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="info-container">
        <div className="sidebar">
          <div className="logo-section-dashboard">
            <img src={Ynov} alt="Ynov Campus" className="logo-image" />
          </div>
        </div>
        <div className="main-content-info">
          <h2>Utilisateur introuvable ❌</h2>
          <button className="back-button" onClick={() => navigate("/gestion-profils")}>⬅ Retour à la gestion des profils</button>
        </div>
      </div>
    );
  }

  return (
    <div className="info-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section-dashboard">
          <img src={Ynov} alt="Ynov Campus" className="logo-image" />
        </div>
        <nav className="navigation">
          <button className="nav-button" onClick={() => handleNavigation("dashboard")}>Accueil</button>
          <button className="nav-button" onClick={() => handleNavigation("notifications")}>Notifications</button>

          <div style={{ position: "relative" }} ref={documentsMenuRef}>
            <button className="nav-button" onClick={() => setShowDocumentsMenu(!showDocumentsMenu)}>Documents</button>
            {showDocumentsMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents-dispo")}>Documents disponibles</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("recherche")}>Dernières recherches</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents-transferts")}>Documents transférés</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents/genere")}>Documents générés</button>
              </div>
            )}
          </div>

          <div style={{ position: "relative" }} ref={generateMenuRef}>
            <button className="nav-button" onClick={() => setShowGenerateMenu(!showGenerateMenu)}>Générer un document</button>
            {showGenerateMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("generer/convention-stage")}>Convention de stage</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("generer/convention-etude")}>Convention d'étude</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("generer/attestation")}>Attestation</button>
              </div>
            )}
          </div>

          <div style={{ position: "relative" }} ref={profilMenuRef}>
            <button className="nav-button active" onClick={() => setShowProfilMenu(!showProfilMenu)}>Profil</button>
            {showProfilMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("profil")}>Mon Profil</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("gestion-profils")}>Gestion des profils</button>
              </div>
            )}
          </div>

          <button className="nav-button logout" onClick={handleLogout}>Déconnexion</button>
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="main-content-info">
        <div className="user-card" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img src={user.photo} alt={`${user.prenom} ${user.nom}`} style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <h2>{user.prenom} {user.nom}</h2>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Téléphone :</strong> {user.telephone}</p>
            <p><strong>Rôle :</strong> {user.role}</p>
            <p><strong>Promotion :</strong> {user.promotion || "Non applicable"}</p>
            <p><strong>Spécialité :</strong> {user.specialite || "Non applicable"}</p>
            <p>
              <strong>Statut :</strong>
              <span className={`statut ${user.statut === "Actif" ? "actif" : "inactif"}`}>
                {user.statut}
              </span>
            </p>
          </div>
        </div>
        <button className="back-button" onClick={() => navigate("/gestion-profils")}>⬅ Retour à la gestion des profils</button>
      </div>
    </div>
  );
};

export default InfoUtilisateurs;
