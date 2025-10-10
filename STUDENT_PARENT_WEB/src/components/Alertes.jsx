import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Alertes.css";
import Ynov from '../img/Ynov.png';

const Alertes = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      date: "14/08/2025 - 15:00",
      message: "L’attestation d’Ilyann Souiri a été rejeté.",
      personnes: "Ilyann Souiri + Parents",
      type: "Attestation",
      lu: false,
    },
    {
      id: 2,
      date: "15/08/2025 - 09:00",
      message: "Le bulletin de Daphnée Bouyedi est disponible.",
      personnes: "Daphnée Bouyedi + Parents",
      type: "Bulletin",
      lu: true,
    },
    {
      id: 3,
      date: "19/08/2025 - 16:00",
      message: "L’attestation de présence de Chaimaa Mellouk a été rejetée.",
      personnes: "Chaimaa Mellouk",
      type: "Attestation",
      lu: false,
    },
    {
      id: 4,
      date: "18/08/2025 - 09:45",
      message: "Le relevé de notes de Laila Lamsaski est prêt.",
      personnes: "Laila Lamsaski + Parents",
      type: "Relevé de notes",
      lu: false,
    },
  ]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState("Tous");
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const notificationsMenuRef = useRef();
  const [showDocumentsMenu, setShowDocumentsMenu] = useState(false);
  const documentsMenuRef = useRef();
  const [showGenererMenu, setShowGenererMenu] = useState(false);
  const genererMenuRef = useRef();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target)) {
        setShowNotificationsMenu(false);
      }
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

  const handleNavigation = (section) => {
    switch (section) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'documents-dispo':
        navigate('/documents-dispo');
        break;
      case 'recherche':
        navigate('/recherche');
        break;
      case 'documents-transferts':
        navigate('/documents-transferts');
        break;
      case '/documents/genere':
        navigate('/documents/genere');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      case 'generer/attestation':
        navigate('/generer/attestation');
        break;
      case 'generer/convention-etude':
        navigate('/generer/convention-etude');
        break;
      case 'generer/convention-stage':
        navigate('/generer/convention-stage');
        break;
      case 'profil':
        navigate('/profil');
        break;
      case 'gestion-profils':
        navigate('/gestion-profils');
        break;
      default:
        navigate('/dashboard');
    }
    setShowDocumentsMenu(false);
    setShowGenererMenu(false);
    setShowNotificationsMenu(false);
  };

  const handleLogout = () => navigate("/login");

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const markSelected = (etat) => {
    if (selectedIds.length === 0) {
      setModalMessage("Veuillez sélectionner au moins une notification !");
      setIsConfirmation(false);
      setShowModal(true);
      return;
    }
    const confirmMsg = etat
      ? "Voulez-vous vraiment marquer ces notifications comme lues ?"
      : "Voulez-vous vraiment marquer ces notifications comme non lues ?";
    
    setModalMessage(confirmMsg);
    setIsConfirmation(true);
    setConfirmAction(() => () => {
      setNotifications((prev) =>
        prev.map((n) => (selectedIds.includes(n.id) ? { ...n, lu: etat } : n))
      );
      setSelectedIds([]);
      setShowModal(false);
    });
    setShowModal(true);
  };

  const types = ["Tous", ...Array.from(new Set(notifications.map(n => n.type))).sort()];

  const filteredNotifications = filter === "Tous" 
    ? notifications 
    : notifications.filter((n) => n.type === filter);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section-dashboard">
          <img src={Ynov} alt="Ynov Campus" className="logo-image" />
        </div>
        <nav className="navigation">
          <button className="nav-button" onClick={() => handleNavigation("dashboard")}>Accueil</button>

          {/* Menu Notifications */}
          <div style={{ position: "relative" }} ref={notificationsMenuRef}>
            <button
              className="nav-button active"
              onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
            >
              Notifications <span>{showNotificationsMenu ? "" : ""}</span>
            </button>
            {showNotificationsMenu && (
              <div className="floating-menu">
                <button
                  className="nav-button floating-menu-item"
                  onClick={() => handleNavigation("notifications")}
                >
                  Alertes
                </button>
                <button
                  className="nav-button floating-menu-item"
                  onClick={() => navigate("/notifications/demandes")}
                >
                  Demandes
                </button>
              </div>
            )}
          </div>

          {/* Menu Documents */}
          <div style={{ position: "relative" }} ref={documentsMenuRef}>
            <button className="nav-button" onClick={() => setShowDocumentsMenu(!showDocumentsMenu)}>
              Documents <span>{showDocumentsMenu ? "" : ""}</span>
            </button>
            {showDocumentsMenu && (
              <div className="floating-menu">
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents-dispo")}>Documents disponibles</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents-transferts")}>Documents transférés</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("recherche")}>Dernières recherches</button>
                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('/documents/genere')}>Documents Générés</button>

              </div>
            )}
          </div>

          {/* Menu Générer */}
          <div style={{ position: 'relative' }} ref={genererMenuRef}>
            <button 
              className="nav-button" 
              onClick={() => setShowGenererMenu(!showGenererMenu)}
            >
              Générer un document <span style={{ marginLeft: "5px" }}>{showGenererMenu ? "" : ""}</span>
            </button>
            {showGenererMenu && (
                <div className="floating-menu">
                    <button className="nav-button floating-menu-item" onClick={() => handleNavigation('generer/convention-stage')}>Convention de stage</button>
                    <button className="nav-button floating-menu-item" onClick={() => handleNavigation('generer/attestation')}>Attestation</button>
                    <button className="nav-button floating-menu-item" onClick={() => handleNavigation('generer/convention-etude')}>Convention d'étude</button>
                </div>
            )}
          </div>

          <button className="nav-button" onClick={() => handleNavigation("profil")}>Profil</button>
          <button className="nav-button logout" onClick={handleLogout}>Déconnexion</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="welcome-title-dashboard"> Alertes </h1>

          {/* Filtres avec compteur non lus */}
          <div className="filters">
            {types.map((t) => {
              const count = t === "Tous"
                ? notifications.filter(n => !n.lu).length
                : notifications.filter(n => n.type === t && !n.lu).length;
              return (
                <button
                  key={t}
                  className={`filter-btn ${filter === t ? "active" : ""}`}
                  onClick={() => setFilter(t)}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>

          {/* Légende */}
          <div className="legend">
            <span className="legend-lu">Lu</span>
            <span className="legend-non-lu">Non lu</span>
          </div>

          {/* Boutons d'action */}
          <div className="action-buttons">
            <button className="btn-lu" onClick={() => markSelected(true)}>Marquer comme lu</button>
            <button className="btn-lu" onClick={() => markSelected(false)}>Marquer comme non lu</button>
          </div>

          {/* Tableau notifications */}
          <div className="notifications-table-wrapper">
            <table className="notifications-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Date/heure</th>
                  <th>Notification</th>
                  <th>Personne(s)</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notif) => (
                  <tr key={notif.id} className={notif.lu ? "lu" : "non-lu"}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(notif.id)}
                        onChange={() => toggleSelection(notif.id)}
                      />
                    </td>
                    <td>{notif.date}</td>
                    <td>{notif.message}</td>
                    <td>{notif.personnes}</td>
                    <td>{notif.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal pour les messages et confirmations */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="floating-modal">
            <h2 className="modal-title">Notification</h2>
            <p className="modal-message">{modalMessage}</p>
            <div className="modal-actions">
              {isConfirmation && (
                <>
                  <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
                  <button className="btn-confirm" onClick={confirmAction}>Confirmer</button>
                </>
              )}
              {!isConfirmation && (
                <button className="btn-confirm" onClick={() => setShowModal(false)}>OK</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alertes;
