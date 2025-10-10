import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Document_Generes.css';
import Ynov from "../img/Ynov.png"; // Import Ynov image for the sidebar
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const DocumentGeneres = () => {
  const navigate = useNavigate();
  const conventions = useQuery(api.conventions.listConventions) || [];
  const attestations = useQuery(api.attestations.listAttestations) || [];
  const internships = useQuery(api.conventions.listInternshipConventions) || [];
  const documents = [
    ...conventions.map((c) => ({
      id: c._id,
      nom: c.nomCandidat || "",
      prenom: c.prenomCandidat || "",
      dateEdition: c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : "",
      promotion: c.promotion || "-",
      specialite: c.specialite || "-",
      type: "Convention d'étude",
      file: null,
    })),
    ...attestations.map((a) => ({
      id: a._id,
      nom: a.nom || "",
      prenom: a.prenom || "",
      dateEdition: a.date || "",
      promotion: a.promotion || "-",
      specialite: a.specialite || "-",
      type: "Attestation de frais de scolarité",
      file: null,
    })),
    ...internships.map((i) => ({
      id: i._id,
      nom: i.stagiaireNom || "",
      prenom: i.stagiairePrenom || "",
      dateEdition: i.createdAt ? new Date(i.createdAt).toISOString().slice(0, 10) : "",
      promotion: "-",
      specialite: "-",
      type: "Convention de stage",
      file: null,
    })),
  ];

  const [editingDoc, setEditingDoc] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // State for sidebar menus, copied from Dashboard/Documents_Dispo
  const [showDocumentsMenu, setShowDocumentsMenu] = useState(false);
  const [showProfilMenu, setShowProfilMenu] = useState(false);
  const [showGenererMenu, setShowGenererMenu] = useState(false);
  const documentsMenuRef = useRef();
  const profilMenuRef = useRef();
  const genererMenuRef = useRef(); 

  const handleEdit = (doc) => {
    setEditingDoc(doc.id);
    setEditedValues({ ...doc });
  };

  const handleSaveEdit = (id) => {
    console.log('Save edit requested for', id, editedValues);
    setEditingDoc(null);
  };

  const handleCancelEdit = () => {
    setEditingDoc(null);
    setEditedValues({});
  };

  const handleDelete = (id) => {
    console.log(`Delete request for document id: ${id}`);
    // Optionally implement a server-side delete if needed
  };

  const handleDownload = (doc) => {
    console.log(`Download document: ${doc.nom}`);
 
    if (doc.file) {
      const a = document.createElement("a");
      a.href = doc.file;
      a.download = doc.nom + ".pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Aucun fichier disponible pour le téléchargement.");
    }
  };

  // Navigation handler, copied from Dashboard/Documents_Dispo
  const handleNavigation = (section) => {
    switch (section) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      case 'documents-dispo':
        navigate('/documents-dispo');
        break;
      case 'documents-transferts':
        navigate('/documents-transferts');
        break;
      case 'recherche':
        navigate('/recherche');
        break;
      case '/documents/genere': 
        navigate('/documents/genere');
        break;
      case 'generer/convention-stage':
        navigate('/generer/convention-stage');
        break;
      case 'generer/attestation':
        navigate('/generer/attestation');
        break;
      case 'generer/convention-etude':
        navigate('/generer/convention-etude');
        break;
      case 'profil':
        navigate('/profil');
        break;
      case 'gestion-profils':
        navigate('/gestion-profils');
        break;
      default:
        navigate('/dashboard'); // Fallback
    }
    setShowDocumentsMenu(false);
    setShowProfilMenu(false);
    setShowGenererMenu(false);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  // Effect to close menus when clicking outside, copied from Dashboard/Documents_Dispo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (documentsMenuRef.current && !documentsMenuRef.current.contains(event.target)) {
        setShowDocumentsMenu(false);
      }
      if (profilMenuRef.current && !profilMenuRef.current.contains(event.target)) {
        setShowProfilMenu(false);
      }
      if (genererMenuRef.current && !genererMenuRef.current.contains(event.target)) {
        setShowGenererMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let filteredDocuments = documents;
  if (filter) {
    filteredDocuments = filteredDocuments.filter(doc => doc.type === filter);
  }
  if (searchQuery.trim() !== "") {
    filteredDocuments = filteredDocuments.filter(doc => {
      const query = searchQuery.toLowerCase();
      return (
        doc.nom.toLowerCase().includes(query) ||
        doc.prenom.toLowerCase().includes(query) ||
        doc.dateEdition.toLowerCase().includes(query) ||
        doc.promotion.toLowerCase().includes(query) ||
        doc.specialite.toLowerCase().includes(query) ||
        doc.type.toLowerCase().includes(query)
      );
    });
  }
  if (sortOption) {
    filteredDocuments = [...filteredDocuments].sort((a, b) => {
      switch (sortOption) {
        case "nom-asc": return a.nom.localeCompare(b.nom);
        case "nom-desc": return b.nom.localeCompare(a.nom);
        case "prenom-asc": return a.prenom.localeCompare(b.prenom);
        case "prenom-desc": return b.prenom.localeCompare(a.prenom);
        case "date-newest": return new Date(b.dateEdition) - new Date(a.dateEdition);
        case "date-oldest": return new Date(a.dateEdition) - new Date(b.dateEdition);
        default: return 0;
      }
    });
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar - Copied from Documents_Dispo.jsx */}
      <div className="sidebar">
        <div className="logo-section-dashboard">
          <img src={Ynov} alt="Ynov Campus" className="logo-image" />
        </div>
        <nav className="navigation">
          <button className="nav-button" onClick={() => handleNavigation('dashboard')}>Accueil</button>
          <button className="nav-button" onClick={() => handleNavigation('notifications')}>Notifications</button>
          <div style={{ position: 'relative' }} ref={documentsMenuRef}>
            <button className="nav-button active" onClick={() => setShowDocumentsMenu(!showDocumentsMenu)}>
              Documents <span style={{ marginLeft: "5px" }}>{showDocumentsMenu ? "" : ""}</span>
            </button>
            {showDocumentsMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('documents-dispo')}>Documents disponibles</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('documents-transferts')}>Documents transférés</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('recherche')}>Dernières recherches</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('/documents/genere')}>Documents Générés</button>
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }} ref={genererMenuRef}>
            <button className="nav-button" onClick={() => setShowGenererMenu(!showGenererMenu)}>
              Générer un document <span style={{ marginLeft: "5px" }}>{showGenererMenu ? "" : ""}</span>
            </button>
            {showGenererMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('generer/convention-etude')}>Convention d'étude</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('generer/attestation')}>Attestation</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('generer/convention-stage')}>Convention de stage</button>
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }} ref={profilMenuRef}>
            <button className="nav-button" onClick={() => setShowProfilMenu(!showProfilMenu)}>
              Profil <span style={{ marginLeft: "5px" }}>{showProfilMenu ? "" : ""}</span>
            </button>
            {showProfilMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('profil')}>Mon profil</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('gestion-profils')}>Gestion des profils</button>
              </div>
            )}
          </div>
          <button className="nav-button logout" onClick={handleLogout}>Déconnexion</button>
        </nav>
      </div>

      {/* Main Content - Existing content wrapped */}
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="welcome-title-dashboard">Documents Générés</h1> {/* Using h1 for consistency with Dashboard */}
          <div className="documents-panel">
            <div className="documents-panel-header">
              <div className="documents-search-row">
                {showSortMenu && (
                  <div className="sort-menu">
                    <button className={sortOption === "nom-asc" ? "active" : ""} onClick={() => setSortOption("nom-asc")}>Nom (A → Z)</button>
                    <button className={sortOption === "nom-desc" ? "active" : ""} onClick={() => setSortOption("nom-desc")}>Nom (Z → A)</button>
                    <button className={sortOption === "prenom-asc" ? "active" : ""} onClick={() => setSortOption("prenom-asc")}>Prénom (A → Z)</button>
                    <button className={sortOption === "prenom-desc" ? "active" : ""} onClick={() => setSortOption("prenom-desc")}>Prénom (Z → A)</button>
                    <button className={sortOption === "date-newest" ? "active" : ""} onClick={() => setSortOption("date-newest")}>Date (plus récent)</button>
                    <button className={sortOption === "date-oldest" ? "active" : ""} onClick={() => setSortOption("date-oldest")}>Date (plus ancien)</button>
                  </div>
                )}
              </div>

              <div className="sort-menu-container">
                <span className="filter-icon" style={{cursor: "pointer"}} onClick={() => setShowSortMenu(!showSortMenu)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                </span>
                <input
                  className="documents-search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="documents-filters">
                <button className={`filter-btn ${filter === "" ? "active" : ""}`} onClick={() => setFilter("")}>Tous</button>
                <button className={`filter-btn ${filter === "Attestation de frais de scolarité" ? "active" : ""}`} onClick={() => setFilter("Attestation de frais de scolarité")}>Attestation de frais de scolarité</button>
                <button className={`filter-btn ${filter === "Convention d'étude" ? "active" : ""}`} onClick={() => setFilter("Convention d'étude")}>Convention d'étude</button>
                <button className={`filter-btn ${filter === "Convention de stage" ? "active" : ""}`} onClick={() => setFilter("Convention de stage")}>Convention de stage</button>
              </div>
            </div>

            <div className="documents-table-container">
              {filteredDocuments.length > 0 ? (
                <table className="documents-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Date d'édition</th>
                      <th>Promotion</th>
                      <th>Spécialité</th>
                      <th>Type de document</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td>
                          {editingDoc === doc.id ? (
                            <input type="text" value={editedValues.nom} onChange={(e) => setEditedValues({...editedValues, nom: e.target.value})} />
                          ) : (
                            doc.nom
                          )}
                        </td>
                        <td>
                          {editingDoc === doc.id ? (
                            <input type="text" value={editedValues.prenom} onChange={(e) => setEditedValues({...editedValues, prenom: e.target.value})} />
                          ) : (
                            doc.prenom
                          )}
                        </td>
                        <td>
                          {editingDoc === doc.id ? (
                            <input type="text" value={editedValues.dateEdition} onChange={(e) => setEditedValues({...editedValues, dateEdition: e.target.value})} />
                          ) : (
                            doc.dateEdition
                          )}
                        </td>
                        <td>
                          {editingDoc === doc.id ? (
                            <input type="text" value={editedValues.promotion} onChange={(e) => setEditedValues({...editedValues, promotion: e.target.value})} />
                          ) : (
                            doc.promotion
                          )}
                        </td>
                        <td>
                          {editingDoc === doc.id ? (
                            <input type="text" value={editedValues.specialite} onChange={(e) => setEditedValues({...editedValues, specialite: e.target.value})} />
                          ) : (
                            doc.specialite
                          )}
                        </td>
                        <td>
                          {editingDoc === doc.id ? (
                            <input type="text" value={editedValues.type} onChange={(e) => setEditedValues({...editedValues, type: e.target.value})} />
                          ) : (
                            doc.type
                          )}
                        </td>
                        <td className="actions">
                          {editingDoc === doc.id ? (
                            <>
                              <span title="Enregistrer" style={{cursor: 'pointer', marginRight: 8}} onClick={() => handleSaveEdit(doc.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                              </span>
                              <span title="Annuler" style={{cursor: 'pointer'}} onClick={handleCancelEdit}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                              </span>
                            </>
                          ) : (
                            <>
                              <span title="Voir" style={{cursor: 'pointer', marginRight: 8}} onClick={() => navigate(`/documents/genere/${doc.id}`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                              </span>
                              <span title="Télécharger" style={{cursor: 'pointer', marginRight: 8}} onClick={() => handleDownload(doc)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>
                              </span>
                              <span title="Editer" style={{cursor: 'pointer', marginRight: 8}} onClick={() => handleEdit(doc)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                              </span>
                              <span title="Supprimer" style={{cursor: 'pointer'}} onClick={() => handleDelete(doc.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              </span>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ marginTop: "15px", textAlign: "center" }}>
                  Aucun document trouvé pour cette recherche.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGeneres;
