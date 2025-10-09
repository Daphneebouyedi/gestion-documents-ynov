import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Detail.css';
import Ynov from "../img/Ynov.png";

const documents = [
  { id: 1, name: "Certificat-Manel", date: "13/08/2025", student: "Manel OUTALEB", year: "2025-2026", status: "Validé", statusType: "success", docType: "Certificat", condition: "Traité", extension: "PDF" },
  { id: 2, name: "Bulletin-Bachelor-Daphnée", date: "14/08/2025", student: "Daphnée Bouyedi", year: "2024-2025", status: "En cours", statusType: "pending", docType: "Bulletin", condition: "En cours", extension: "PDF" },
  { id: 3, name: "Attestation-Ilyann", date: "14/08/2025", student: "Ilyann Souiri", year: "2024-2025", status: "Rejeté", statusType: "rejected", docType: "Attestation", condition: "Traité", extension: "PDF", reason: "Illisible + Incomplet" },
  { id: 4, name: "Bulletin-Bachelor-Bachir", date: "26/08/2025", student: "Bachirou Mohamadou", year: "2024-2025", status: "En cours", statusType: "pending", docType: "Bulletin", condition: "En cours", extension: "PDF" },
  { id: 5, name: "Attestation-Amine", date: "26/08/2025", student: "Amine Fatih", year: "2025-2026", statusType: "success", status: "Validé", docType: "Attestation", condition: "Traité", extension: "PDF" }
];

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showDocumentsMenu, setShowDocumentsMenu] = useState(false);
  const [showGenererMenu, setShowGenererMenu] = useState(false);

  const documentsMenuRef = useRef(null);
  const genererMenuRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [editedDoc, setEditedDoc] = useState({});

  const handleLogout = () => {
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(`/${path}`);
    setShowDocumentsMenu(false);
    setShowGenererMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (documentsMenuRef.current && !documentsMenuRef.current.contains(event.target)) {
        setShowDocumentsMenu(false);
      }
      if (genererMenuRef.current && !genererMenuRef.current.contains(event.target)) {
        setShowGenererMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const doc = documents.find(d => d.id === parseInt(id));
  if (!doc) return <p>Document introuvable</p>;

  const handleEdit = () => {
    setEditing(true);
    setEditedDoc({ ...doc });
  };

  const handleSave = () => {
    alert(`✏️ Le document "${editedDoc.name}" a été sauvegardé avec succès.`);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedDoc({});
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(`⚠️ Voulez-vous vraiment supprimer le document "${doc.name}" ?`);
    if (confirmDelete) {
      alert(`🗑️ Le document "${doc.name}" a été supprimé.`);
      navigate("/documents-dispo");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([`Contenu du document : ${doc.name}`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.name}.${doc.extension.toLowerCase()}`;
    link.click();

    URL.revokeObjectURL(url);
  };

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

          {/* Menu Documents */}
          <div style={{ position: "relative" }} ref={documentsMenuRef}>
            <button className="nav-button active" onClick={() => setShowDocumentsMenu(!showDocumentsMenu)}>
              Documents <span style={{ marginLeft: "5px" }}>{showDocumentsMenu ? "" : ""}</span>
            </button>
            {showDocumentsMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents-dispo")}>Documents disponibles</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("recherche")}>Dernières recherches</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents-transferts")}>Documents transférés</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents/genere")}>Documents générés</button>
              </div>
            )}
          </div>

          {/* Menu Générer un document */}
          <div style={{ position: "relative" }} ref={genererMenuRef}>
            <button className="nav-button" onClick={() => setShowGenererMenu(!showGenererMenu)}>
              Générer un document <span style={{ marginLeft: "5px" }}>{showGenererMenu ? "" : ""}</span>
            </button>
            {showGenererMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("generer/convention-stage")}>Convention de stage</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("generer/convention-etude")}>Convention d'étude</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("generer/attestation")}>Attestation</button>
              </div>
            )}
          </div>

          <button className="nav-button" onClick={() => navigate("/profil")}>Profil</button>
          <button className="nav-button logout" onClick={handleLogout}>Déconnexion</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="welcome-title-dashboard">Détails du document</h1>

          <div className="detail-panel">
            <div className="detail-info">
              <p><strong>Nom du document:</strong> {editing ? <input value={editedDoc.name} onChange={(e) => setEditedDoc({...editedDoc, name: e.target.value})} /> : doc.name}</p>
              <p><strong>Etudiant/e:</strong> {editing ? <input value={editedDoc.student} onChange={(e) => setEditedDoc({...editedDoc, student: e.target.value})} /> : doc.student}</p>
              <p><strong>Date de réception:</strong> {doc.date}</p>
              <p><strong>Année scolaire:</strong> {doc.year}</p>
              <p><strong>Type:</strong> {doc.docType}</p>
              <p><strong>Extension:</strong> {doc.extension}</p>
              <p><strong>Statut:</strong> <span className={`status ${doc.statusType}`}>{doc.status}</span></p>
              {doc.reason && <p><strong>Raison(s):</strong> <span className="reason">{doc.reason}</span></p>}
              <p><strong>Condition:</strong> {doc.condition}</p>
            </div>

            <div className="detail-preview">
              <div className="preview-header">
                {editing ? (
                  <>
                    <button title="Enregistrer" style={{ cursor: 'pointer', marginRight: 8, background: 'none', border: 'none', padding: 0 }} onClick={() => handleSave(doc.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
                        <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/>
                        <path d="M7 3v4a1 1 0 0 0 1 1h7"/>
                      </svg>
                    </button>
                    <button title="Annuler" style={{ cursor: 'pointer', marginRight: 8, background: 'none', border: 'none', padding: 0 }} onClick={handleCancel}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <span title="Editer" className="icon" style={{cursor: 'pointer', marginRight: 8}} onClick={handleEdit}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                      </svg>
                    </span>
                    <span title="Télécharger" className="icon" style={{cursor: 'pointer', marginRight: 8}} onClick={handleDownload}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/>
                      </svg>
                    </span>
                    <span title="Supprimer" className="icon" style={{cursor: 'pointer', marginRight: 8}} onClick={handleDelete}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                        <path d="M3 6h18"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </span>
                  </>
                )}
              </div>
              <div className="preview-body">
                <div className="preview-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg> Aperçu du document {doc.extension}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailPage;
