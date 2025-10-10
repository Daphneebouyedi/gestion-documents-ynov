import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Journalisation.css";
import Ynov from '../img/Ynov.png';

const Journalisation = () => {
  const navigate = useNavigate();

  // Données simulées pour le journal des actions
  const [logs] = useState([
    { id: 1, user: "Alexandre Durieu", action: "Ajout d'un nouvel utilisateur", date: "25/09/2025 10:00" },
    { id: 2, user: "Sophie Leblanc", action: "Validation de l'attestation de scolarité de Chaimaa Mellouk", date: "24/09/2025 16:30" },
    { id: 3, user: "Alexandre Durieu", action: "Rejet du bulletin de Daphnée Bouyedi", date: "24/09/2025 15:15" },
    { id: 4, user: "Marc Dupont", action: "Modification du profil de Laila Lamsaski", date: "24/09/2025 11:00" },
    { id: 5, user: "Sophie Leblanc", action: "Archivage du relevé de notes de Bachirou Mohamadou", date: "23/09/2025 09:45" },
  ]);

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
          <button className="nav-button active">Journalisation</button>
          <button className="nav-button logout" onClick={handleLogout}>Déconnexion</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="welcome-title-dashboard">Journalisation des actions</h1>
          <div className="logs-table-wrapper">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Utilisateur</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.date}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journalisation;