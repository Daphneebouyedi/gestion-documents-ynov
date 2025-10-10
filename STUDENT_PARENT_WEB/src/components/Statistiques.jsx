import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Statistiques.css";
import Ynov from '../img/Ynov.png';

const Statistiques = () => {
  const navigate = useNavigate();

  // Données simulées pour les statistiques
  const [stats] = useState({
    totalDocuments: 250,
    processedDocuments: 195,
    pendingDocuments: 55,
    rejectedDocuments: 20,
    totalRequests: 150,
    processedRequests: 120,
    pendingRequests: 30,
  });

  const [showDocumentsMenu, setShowDocumentsMenu] = useState(false);
  const documentsMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (documentsMenuRef.current && !documentsMenuRef.current.contains(event.target)) {
        setShowDocumentsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => navigate("/login");

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section-dashboard">
          <img src={Ynov} alt="Ynov Campus" className="logo-image" />
        </div>
        <nav className="navigation">
          <button className="nav-button" onClick={() => navigate("/dashboard")}>Accueil</button>
          <button className="nav-button" onClick={() => navigate("/notifications")}>Notifications</button>
          <div style={{ position: "relative" }} ref={documentsMenuRef}>
            <button className="nav-button" onClick={() => setShowDocumentsMenu(!showDocumentsMenu)}>
              Documents <span>{showDocumentsMenu ? "▲" : "▼"}</span>
            </button>
            {showDocumentsMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => navigate("/documents-dispo")}>Documents disponibles</button>
                <button className="nav-button floating-menu-item" onClick={() => navigate("/documents-transferts")}>Documents transférés</button>
              </div>
            )}
          </div>
          <button className="nav-button" onClick={() => navigate("/planning")}>Planning</button>
          <button className="nav-button" onClick={() => navigate("/profil")}>Profil</button>
          <button className="nav-button active">Statistiques</button>
          <button className="nav-button logout" onClick={handleLogout}>Déconnexion</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="welcome-title-dashboard">Statistiques</h1>

          <div className="stats-grid">
            <div className="stat-card total-doc">
              <h3 className="stat-title">Documents</h3>
              <p className="stat-value">{stats.totalDocuments}</p>
            </div>
            <div className="stat-card processed-doc">
              <h3 className="stat-title">Traités</h3>
              <p className="stat-value">{stats.processedDocuments}</p>
            </div>
            <div className="stat-card rejected-doc">
              <h3 className="stat-title">Rejetés</h3>
              <p className="stat-value">{stats.rejectedDocuments}</p>
            </div>
            <div className="stat-card pending-doc">
              <h3 className="stat-title">En attente</h3>
              <p className="stat-value">{stats.pendingDocuments}</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card total-req">
              <h3 className="stat-title">Demandes</h3>
              <p className="stat-value">{stats.totalRequests}</p>
            </div>
            <div className="stat-card processed-req">
              <h3 className="stat-title">Traitées</h3>
              <p className="stat-value">{stats.processedRequests}</p>
            </div>
            <div className="stat-card pending-req">
              <h3 className="stat-title">En attente</h3>
              <p className="stat-value">{stats.pendingRequests}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Statistiques;