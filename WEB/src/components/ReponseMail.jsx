import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Ynov from '../img/Ynov.png';
import './ReponseMail.css';

const ReponseMail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // États pour les menus déroulants
    const [showDocumentsMenu, setShowDocumentsMenu] = useState(false);
    const [showGenerateMenu, setShowGenerateMenu] = useState(false);
    const [showProfilMenu, setShowProfilMenu] = useState(false);

    // Références pour les clics en dehors
    const documentsMenuRef = useRef(null);
    const generateMenuRef = useRef(null);
    const profilMenuRef = useRef(null);

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

    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);

    // Fonction de navigation générale avec fermeture des menus
    const handleNavigation = (path) => {
        navigate(path);
        setShowDocumentsMenu(false);
        setShowGenerateMenu(false);
        setShowProfilMenu(false);
    };

    // Fermer les menus si clic en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (documentsMenuRef.current && !documentsMenuRef.current.contains(event.target)) {
                setShowDocumentsMenu(false);
            }
            if (generateMenuRef.current && !generateMenuRef.current.contains(event.target)) {
                setShowGenerateMenu(false);
            }
            if (profilMenuRef.current && !profilMenuRef.current.contains(event.target)) {
                setShowProfilMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!demande) {
        return <p>Demande non trouvée.</p>;
    }

    const handleSend = (e) => {
        e.preventDefault();
        console.log("Sending message:", message);
        console.log("File to upload:", file);
        window.alert("Message envoyé avec succès !");
        navigate("/notifications");
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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
                    <button className="nav-button active" onClick={() => handleNavigation("/notifications")}>Notifications</button>

                    {/* Menu Documents */}
                    <div style={{ position: 'relative' }} ref={documentsMenuRef}>
                        <button
                            className="nav-button"
                            onClick={() => setShowDocumentsMenu(!showDocumentsMenu)}
                        >
                            Documents <span style={{ marginLeft: "5px" }}>{showDocumentsMenu ? "" : ""}</span>
                        </button>
                        {showDocumentsMenu && (
                            <div className="floating-menu">
                                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents-dispo")}>Documents disponibles</button>
                                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("derniere-recherches")}>Dernières recherches</button>
                                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents-transferts")}>Documents transférés</button>
                                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("documents/genere")}>Documents générés</button>
                            </div>
                        )}
                    </div>

                    {/* Menu Générer un document */}
                    <div style={{ position: "relative" }} ref={generateMenuRef}>
                        <button
                            className="nav-button"
                            onClick={() => setShowGenerateMenu(!showGenerateMenu)}
                        >
                            Générer un document <span style={{ marginLeft: "5px" }}>{showGenerateMenu ? "" : ""}</span>
                        </button>
                        {showGenerateMenu && (
                            <div className="floating-menu">
                                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("/generer/convention-etude")}>Convention d'étude</button>
                                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("/generer/convention-stage")}>Convention de stage</button>
                                <button className="nav-button floating-menu-item" onClick={() => handleNavigation("/generer/attestation")}>Attestation</button>
                            </div>
                        )}
                    </div>

                    {/* Menu Profil */}
                    <div style={{ position: 'relative' }} ref={profilMenuRef}>
                        <button
                            className="nav-button"
                            onClick={() => setShowProfilMenu(!showProfilMenu)}
                        >
                            Profil <span style={{ marginLeft: "5px" }}>{showProfilMenu ? "" : ""}</span>
                        </button>
                        {showProfilMenu && (
                            <div className="floating-menu">
                                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('/profil')}>Mon profil</button>
                                <button className="nav-button floating-menu-item" onClick={() => handleNavigation('/gestion-profils')}>Gestion des profils</button>
                            </div>
                        )}
                    </div>
                    <button className="nav-button logout" onClick={() => handleNavigation("/login")}>Déconnexion</button>
                </nav>
            </div>

            {/* Main content - Formulaire de réponse */}
            <div className="main-content">
                <div className="content-wrapper">
                    <h1 className="welcome-title-dashboard">Répondre au mail</h1>
                    <div className="mail-item">
                        <form onSubmit={handleSend}>
                            <div className="form-group">
                                <label>À :</label>
                                <input type="text" value={demande.personne} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Objet :</label>
                                <input type="text" value={`RE: Demande de ${demande.type}`} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Message :</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Pièce jointe :</label>
                                <input type="file" onChange={handleFileChange} />
                            </div>
                            <div className="mail-actions">
                                <button type="submit" className="btn-reply">Envoyer</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReponseMail;
