import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Ynov from "../img/Ynov.png";

const initialDocuments = [
  { 
    id: 1, 
    nom: 'Dupont', 
    prenom: 'Jean', 
    dateEdition: '2023-10-26', 
    promotion: 'Bachelor 3', 
    specialite: 'Développement', 
    type: 'Convention de stage',
    nomFichier: 'Convention_de_stage_Dupont_Jean.pdf'
  },
  { 
    id: 2, 
    nom: 'Martin', 
    prenom: 'Marie', 
    dateEdition: '2023-10-25', 
    promotion: 'Mastère 1', 
    specialite: 'Cybersécurité', 
    type: "Convention d'étude",
    nomFichier: 'Convention_d_etude_Martin_Marie.pdf'
  },
  { 
    id: 3, 
    nom: 'Dubois', 
    prenom: 'Paul', 
    dateEdition: '2023-10-24', 
    promotion: 'Bachelor 1', 
    specialite: 'Informatique', 
    type: 'Attestation de frais de scolarité',
    nomFichier: 'Attestation_de_frais_de_scolarite_Dubois_Paul.pdf'
  },
  { 
    id: 4, 
    nom: 'Lefebvre', 
    prenom: 'Alice', 
    dateEdition: '2023-10-23', 
    promotion: 'Mastère 2', 
    specialite: 'Data & IA', 
    type: 'Convention de stage',
    nomFichier: 'Convention_de_stage_Lefebvre_Alice.pdf'
  }
];


const DocumentGeneresDetailPage = ({ documentsList = initialDocuments }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [editedDoc, setEditedDoc] = useState({});
  const [showGenererMenu, setShowGenererMenu] = useState(false);

  const genererMenuRef = useRef(null);
  const profilMenuRef = useRef(null);

  // Gestion du click en dehors des menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genererMenuRef.current && !genererMenuRef.current.contains(event.target)) {
        setShowGenererMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const doc = documentsList.find(d => d.id === parseInt(id));
  if (!doc) return <p>Document introuvable</p>;

  const handleEdit = () => {
    setEditing(true);
    setEditedDoc({ ...doc });
  };

  const handleSave = () => {
    alert(`✏️ Le document "${editedDoc.nom} ${editedDoc.prenom}" a été sauvegardé.`);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedDoc({});
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(`⚠️ Supprimer le document "${doc.nom} ${doc.prenom}" ?`);
    if (confirmDelete) {
      alert(`🗑️ Le document "${doc.nom} ${doc.prenom}" a été supprimé.`);
      navigate("/documents/list");
    }
  };

  const handleDownload = () => {
  const blob = new Blob([`Contenu du document : ${doc.nom} ${doc.prenom}`], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = doc.nomFichier;
  link.click();

  URL.revokeObjectURL(url);
};

  const handleNavigation = (path) => {
    navigate(path);
    setShowGenererMenu(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section-dashboard">
          <img src={Ynov} alt="Ynov Campus" className="logo-image" />
        </div>
        <nav className="navigation">
          <button className="nav-button" onClick={() => handleNavigation("/dashboard")}>Accueil</button>
          <button className="nav-button" onClick={() => handleNavigation("/notifications")}>Notifications</button>

          <button className="nav-button active" onClick={() => handleNavigation("/documents-dispo")}>
            Documents
          </button>

          <div style={{ position: "relative" }} ref={genererMenuRef}>
            <button className="nav-button" onClick={() => setShowGenererMenu(!showGenererMenu)}>
              Générer un document
            </button>
            {showGenererMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("/generer/convention-etude")}>Convention d'étude</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("/generer/attestation")}>Attestation</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("/generer/convention-stage")}>Convention de stage</button>
              </div>
            )}
          </div>

          <div style={{ position: "relative" }} ref={profilMenuRef}>
            <button className="nav-button" onClick={() => handleNavigation("/profil")}>
              Profil
            </button>
          </div>

          <button className="nav-button logout" onClick={() => handleNavigation("/login")}>Déconnexion</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="welcome-title-dashboard"> Détails du document généré</h1>

          <div className="detail-panel">
            <div className="detail-info">
              <p><strong>Nom:</strong> {editing ? <input value={editedDoc.nom} onChange={(e) => setEditedDoc({ ...editedDoc, nom: e.target.value })} /> : doc.nom}</p>
              <p><strong>Prénom:</strong> {editing ? <input value={editedDoc.prenom} onChange={(e) => setEditedDoc({ ...editedDoc, prenom: e.target.value })} /> : doc.prenom}</p>
              <p><strong>Nom du document :</strong> {doc.nomFichier}</p>
              <p><strong>Promotion:</strong> {editing ? <input value={editedDoc.promotion} onChange={(e) => setEditedDoc({ ...editedDoc, promotion: e.target.value })} /> : doc.promotion}</p>
              <p><strong>Spécialité:</strong> {editing ? <input value={editedDoc.specialite} onChange={(e) => setEditedDoc({ ...editedDoc, specialite: e.target.value })} /> : doc.specialite}</p>
              <p><strong>Type de document:</strong> {editing ? <input value={editedDoc.type} onChange={(e) => setEditedDoc({ ...editedDoc, type: e.target.value })} /> : doc.type}</p>
              <p><strong>Date d'édition:</strong> {editing ? <input value={editedDoc.dateEdition} onChange={(e) => setEditedDoc({ ...editedDoc, dateEdition: e.target.value })} /> : doc.dateEdition}</p>
            </div>

            <div className="detail-preview">
              <div className="preview-header">
                {editing ? (
                  <>
                    <span title="Enregistrer" style={{ cursor: 'pointer', marginRight: 8 }} onClick={handleSave}>
                      {/* SVG Enregistrer */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                    </span>
                    <span title="Annuler" style={{ cursor: 'pointer' }} onClick={handleCancel}>
                      {/* SVG Annuler */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </span>
                  </>
                ) : (
                  <>
                    <span title="Editer" style={{ cursor: 'pointer', marginRight: 8 }} onClick={handleEdit}>
                      {/* SVG Editer */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                    </span>
                    <span title="Télécharger" style={{ cursor: 'pointer', marginRight: 8 }} onClick={handleDownload}>
                      {/* SVG Télécharger */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>
                    </span>
                    <span title="Supprimer" style={{ cursor: 'pointer', marginRight: 8 }} onClick={handleDelete}>
                      {/* SVG Supprimer */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </span>
                  </>
                )}
              </div>
              <div className="preview-body">
                <div className="preview-placeholder">
                  {/* SVG Aperçu */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                  Aperçu du document
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGeneresDetailPage;
