import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tracabilite.css";
import Ynov from '../img/Ynov.png';

const Tracabilite = () => {
  const navigate = useNavigate();

  // Données simulées pour la traçabilité des documents
  const [documentLogs] = useState([
    { id: 1, docName: "Bulletin-Bachelor-Daphnée", user: "Sophie Leblanc", action: "Création du document", date: "15/08/2025" },
    { id: 2, docName: "Attestation-Ilyann", user: "Marc Dupont", action: "Rejet du document", date: "19/08/2025" },
    { id: 3, docName: "Relevé-de-notes-Laila", user: "Alexandre Durieu", action: "Validation du document", date: "18/08/2025" },
    { id: 4, docName: "Certificat-Manel", user: "Sophie Leblanc", action: "Création du document", date: "13/08/2025" },
    { id: 5, docName: "Bulletin-Bachelor-Bachir", user: "Alexandre Durieu", action: "Validation du document", date: "26/08/2025" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredLogs = documentLogs.filter((log) =>
    log.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button className="nav-button active">Traçabilité</button>
          <button className="nav-button logout" onClick={handleLogout}>Déconnexion</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="welcome-title-dashboard">Traçabilité des documents</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un document ou un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="logs-table-wrapper">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Document demandé</th>
                  <th>Utilisateur</th>
                  <th>Action</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.docName}</td>
                      <td>{log.user}</td>
                      <td>{log.action}</td>
                      <td>{log.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-results">Aucun résultat trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracabilite;