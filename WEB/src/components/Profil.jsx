import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profil.css";
import Ynov from "../img/Ynov.png";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';


const Profil = () => {
  // Pour l'affichage/masquage des mots de passe
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const [token, setToken] = useState(null);
  const [userIdFromToken, setUserIdFromToken] = useState(null); // State to store the userId

  // Use useAction for verifyTokenAction
  const verifyTokenAction = useAction(api.authActions.verifyTokenAction);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      setToken(storedToken);
      // Call the action to verify the token and get the userId
      const verifyAndSetUserId = async () => {
        try {
          const id = await verifyTokenAction({ token: storedToken });
          setUserIdFromToken(id);
        } catch (error) {
          console.error("Token verification failed:", error);
          // Optionally, clear token and redirect to login if token is invalid
          localStorage.removeItem("jwtToken");
          navigate("/login");
        }
      };
      verifyAndSetUserId();
    } else {
      // If no token, redirect to login
      navigate("/login");
    }
  }, [token, verifyTokenAction, navigate]); // Add verifyTokenAction and navigate to dependencies

  console.log("Profil.jsx - userId from token:", userIdFromToken);

  const user = useQuery(api.auth.getUser, userIdFromToken ? { userId: userIdFromToken } : "skip");
  console.log("Profil.jsx - user object from useQuery:", user);
  const updateUserMutation = useMutation(api.auth.updateUser);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!userIdFromToken) {
      console.error("User ID not found from token. Cannot update profile.");
      return;
    }
    try {
      await updateUserMutation({ userId: userIdFromToken, firstName, lastName, email });
      alert("Profil mis à jour avec succès !");
      setShowEditModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert("Échec de la mise à jour du profil.");
    }
  };

  return (
    <DashboardLayout pageTitle="Profil Administrateur" pageDescription="Gérez vos informations personnelles et paramètres de sécurité">
      <div className="gestion-container">
        <div className="main-content">
          {/* Informations Personnelles */}
          <div className="profile-card">
            <h2 className="profile-section-title">Informations Personnelles</h2>
            <p className="profile-section-desc">Mettez à jour vos informations de profil</p>
            <form className="profile-form">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={user?.email || ''} disabled style={{ background: '#e9f1ff', width: '100%' }} />

              <label htmlFor="current-password">Mot de passe actuel (pour confirmer)</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="current-password"
                  type={showCurrentPwd ? "text" : "password"}
                  value={""}
                  disabled
                  style={{ background: '#e9f1ff', paddingRight: 32, width: '100%' }}
                />
                <img
                  src={showCurrentPwd ? "/oeil (1).png" : "/oeil.png"}
                  alt={showCurrentPwd ? 'Masquer' : 'Afficher'}
                  onClick={() => setShowCurrentPwd(v => !v)}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', width: 22, height: 22, opacity: 0.7 }}
                  title={showCurrentPwd ? 'Masquer' : 'Afficher'}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button type="button" className="save-button" style={{ marginTop: 16, background: '#000', color: '#fff', fontWeight: 500, border: 'none', borderRadius: 6, padding: '8px 32px', width: 'auto', minWidth: 120 }}>
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          </div>

          {/* Sécurité */}
          <div className="profile-card">
            <h2 className="profile-section-title">Sécurité</h2>
            <p className="profile-section-desc">Modifiez votre mot de passe et gérez la sécurité de votre compte</p>
            <form className="profile-form">

              <label htmlFor="old-password">Mot de passe actuel</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="old-password"
                  type={showOldPwd ? "text" : "password"}
                  value={""}
                  disabled
                  style={{ paddingRight: 32, width: '100%' }}
                />
                <img
                  src={showOldPwd ? "/oeil (1).png" : "/oeil.png"}
                  alt={showOldPwd ? 'Masquer' : 'Afficher'}
                  onClick={() => setShowOldPwd(v => !v)}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', width: 22, height: 22, opacity: 0.7 }}
                  title={showOldPwd ? 'Masquer' : 'Afficher'}
                />
              </div>

              <label htmlFor="new-password">Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="new-password"
                  type={showNewPwd ? "text" : "password"}
                  value={""}
                  disabled
                  style={{ paddingRight: 32, width: '100%' }}
                />
                <img
                  src={showNewPwd ? "/oeil (1).png" : "/oeil.png"}
                  alt={showNewPwd ? 'Masquer' : 'Afficher'}
                  onClick={() => setShowNewPwd(v => !v)}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', width: 22, height: 22, opacity: 0.7 }}
                  title={showNewPwd ? 'Masquer' : 'Afficher'}
                />
              </div>

              <label htmlFor="confirm-password">Confirmer le nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirm-password"
                  type={showConfirmPwd ? "text" : "password"}
                  value={""}
                  disabled
                  style={{ paddingRight: 32, width: '100%' }}
                />
                <img
                  src={showConfirmPwd ? "/oeil (1).png" : "/oeil.png"}
                  alt={showConfirmPwd ? 'Masquer' : 'Afficher'}
                  onClick={() => setShowConfirmPwd(v => !v)}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', width: 22, height: 22, opacity: 0.7 }}
                  title={showConfirmPwd ? 'Masquer' : 'Afficher'}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button type="button" className="save-button" style={{ marginTop: 16, background: '#000', color: '#fff', fontWeight: 500, border: 'none', borderRadius: 6, padding: '8px 32px', width: 'auto', minWidth: 120 }}>
                  Changer le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* MODAL EDIT PROFIL */}
        {showEditModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Modifier mon profil</h2>
              <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input type="email" placeholder="Adresse mail" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="modal-actions">
                <button className="confirm-button" onClick={handleSaveProfile}>Enregistrer</button>
                <button className="cancel-button" onClick={() => setShowEditModal(false)}>Annuler</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>

  );
};

export default Profil;