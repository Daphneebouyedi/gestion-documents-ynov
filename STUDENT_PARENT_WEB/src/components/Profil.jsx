import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import "./Profil.css";
import DashboardLayout from './DashboardLayout';

const Profil = () => {
  const navigate = useNavigate();

  const [token, setToken] = React.useState(null);
  const [userIdFromToken, setUserIdFromToken] = React.useState(null);
  const verifyTokenAction = useAction(api.authActions.verifyTokenAction);

  React.useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      setToken(storedToken);
      const verifyAndSetUserId = async () => {
        try {
          const id = await verifyTokenAction({ token: storedToken });
          setUserIdFromToken(id);
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("jwtToken");
          navigate("/login");
        }
      };
      verifyAndSetUserId();
    } else {
      navigate("/login");
    }
  }, [token, verifyTokenAction, navigate]);

  const user = useQuery(api.auth.getUser, userIdFromToken ? { userId: userIdFromToken } : "skip");
  const userConventions = useQuery(api.conventions.getUserInternshipConventions, userIdFromToken ? { userId: userIdFromToken } : "skip");
  const userAttestations = useQuery(api.attestations.getUserAttestations, userIdFromToken ? { userId: userIdFromToken } : "skip");
  const userDocuments = useQuery(api.documents.getUserTransferredDocuments, userIdFromToken ? { userId: userIdFromToken } : "skip");
  const userConventionsEtude = useQuery(api.conventions.getUserConventions, userIdFromToken ? { userId: userIdFromToken } : "skip");
  const userBulletins = useQuery(api.documents.getUserBulletins, userIdFromToken ? { userId: userIdFromToken } : "skip");

  const updateProfile = useMutation(api.auth.updateUserProfile);
  const changePasswordMutation = useMutation(api.authActions.changePassword);

  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [ville, setVille] = React.useState("");
  const [dateNaissance, setDateNaissance] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCountry(user.country || "");
      setVille(user.ville || "");
      setDateNaissance(user.dateNaissance || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!userIdFromToken) return;
    try {
      await updateProfile({
        userId: userIdFromToken,
        phone,
        address,
        country,
        ville,
        dateNaissance,
        profileComplete: true,
      });
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert("Échec de la mise à jour du profil.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!userIdFromToken) return;
    try {
      await changePasswordMutation({
        userId: userIdFromToken,
        currentPassword,
        newPassword,
      });
      alert("Mot de passe changé avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      alert("Échec du changement de mot de passe.");
    }
  };

  const toggleCurrentPasswordVisibility = () => setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  if (!user) {
    return (
      <DashboardLayout pageTitle="Mon Profil" pageDescription="Informations détaillées sur votre profil">
        <div className="details-loading">
          <div className="spinner"></div>
          <p>Chargement de votre profil...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Mon Profil" pageDescription="Informations détaillées sur votre profil">
      <div className="details-container">
        <div className="user-profile-card">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <img
                src={user.photoUrl || "/la-personne.png"}
                alt={`${user.firstName} ${user.lastName}`}
                className="profile-avatar"
              />
              <div className={`status-indicator ${user.isOnline ? 'online' : 'offline'}`}></div>
            </div>
            <div className="avatar-info">
              <h2 className="user-full-name">{user.firstName} {user.lastName}</h2>
              <p className="user-role">
                {user.role === 'student' ? 'Étudiant' : user.role === 'parent' ? 'Parent' : user.role}
              </p>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="detail-section">
              <h3 className="section-title">Informations personnelles</h3>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">Prénom</span>
                  <span className="detail-value">{user.firstName || 'Non spécifié'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nom</span>
                  <span className="detail-value">{user.lastName || 'Non spécifié'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Téléphone</span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="detail-value"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                  />
                </div>
                <div className="detail-item">
                  <span className="detail-label">Adresse</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="detail-value"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                  />
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pays</span>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="detail-value"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                  />
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ville</span>
                  <input
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="detail-value"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                  />
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date de naissance</span>
                  <input
                    type="date"
                    value={dateNaissance}
                    onChange={(e) => setDateNaissance(e.target.value)}
                    className="detail-value"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                  />
                </div>
              </div>
              <button onClick={handleSaveProfile} style={{ marginTop: 20, padding: '10px 20px', background: '#23c2a2', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Sauvegarder les modifications
              </button>
            </div>

            <div className="detail-section">
              <h3 className="section-title">Informations académiques</h3>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">Promotion</span>
                  <span className="detail-value">{user.promotion || 'Non applicable'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Spécialité</span>
                  <span className="detail-value">{user.specialite || 'Non applicable'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Année scolaire</span>
                  <span className="detail-value">{user.anneeScolaire || 'Non spécifié'}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="section-title">Statut et activité</h3>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">Statut</span>
                  <span className={`detail-value status ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">En ligne</span>
                  <span className={`detail-value online-status ${user.isOnline ? 'online' : 'offline'}`}>
                    {user.isOnline ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Profil complet</span>
                  <span className={`detail-value profile-status ${user.profileComplete ? 'complete' : 'incomplete'}`}>
                    {user.profileComplete ? 'Complet' : 'Incomplet'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date d'inscription</span>
                  <span className="detail-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non spécifié'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="user-profile-card" style={{ marginTop: 30 }}>
          <div className="detail-section">
            <h3 className="section-title">Mot de passe</h3>
            <div className="detail-items">
              <div className="detail-item">
                <span className="detail-label">Mot de passe actuel</span>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="detail-value"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: 'calc(100% - 30px)', paddingRight: '30px' }}
                  />
                  <img
                    src={showCurrentPassword ? '/oeil(1).png' : '/oeil.png'}
                    alt="Toggle visibility"
                    onClick={toggleCurrentPasswordVisibility}
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, cursor: 'pointer' }}
                  />
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Nouveau mot de passe</span>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="detail-value"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: 'calc(100% - 30px)', paddingRight: '30px' }}
                  />
                  <img
                    src={showNewPassword ? '/oeil(1).png' : '/oeil.png'}
                    alt="Toggle visibility"
                    onClick={toggleNewPasswordVisibility}
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, cursor: 'pointer' }}
                  />
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Confirmer le nouveau mot de passe</span>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="detail-value"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: 'calc(100% - 30px)', paddingRight: '30px' }}
                  />
                  <img
                    src={showConfirmPassword ? '/oeil(1).png' : '/oeil.png'}
                    alt="Toggle visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleChangePassword} style={{ marginTop: 20, padding: '10px 20px', background: '#23c2a2', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Changer le mot de passe
            </button>
          </div>
        </div>

        {/* Document History Section */}
        <div className="document-history-section">
          <h2 className="history-title">Historique des demandes et documents</h2>

          {/* Convention Requests */}
          <div className="history-subsection">
            <h3 className="subsection-title">Demandes de conventions de stage</h3>
            {userConventions && userConventions.length > 0 ? (
              <div className="history-items">
                {userConventions.map((conv) => (
                  <div key={conv._id} className="history-item">
                    <div className="history-item-header">
                      <span className="history-type">Convention de stage</span>
                      <span className={`history-status ${conv.status?.toLowerCase() || 'pending'}`}>
                        {conv.status || 'En cours'}
                      </span>
                      <span className="history-date">
                        {new Date(conv.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="history-item-content">
                      <p><strong>Entreprise:</strong> {conv.entrepriseNom}</p>
                      <p><strong>Période:</strong> {conv.dateDebut} - {conv.dateFin}</p>
                      <p><strong>Tâches:</strong> {conv.taches || 'Non spécifié'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Aucune demande de convention trouvée.</p>
            )}
          </div>

          {/* Attestation Requests */}
          <div className="history-subsection">
            <h3 className="subsection-title">Demandes d'attestations</h3>
            {userAttestations && userAttestations.length > 0 ? (
              <div className="history-items">
                {userAttestations.map((att) => (
                  <div key={att._id} className="history-item">
                    <div className="history-item-header">
                      <span className="history-type">Attestation de frais de scolarité</span>
                      <span className={`history-status ${att.status?.toLowerCase() || 'pending'}`}>
                        {att.status || 'En cours'}
                      </span>
                      <span className="history-date">
                        {new Date(att.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="history-item-content">
                      <p><strong>Promotion:</strong> {att.promotion}</p>
                      <p><strong>Année scolaire:</strong> {att.anneeScolaire}</p>
                      <p><strong>Montant total:</strong> {att.totalPaye}€</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Aucune demande d'attestation trouvée.</p>
            )}
          </div>

          {/* Study Convention Requests */}
          <div className="history-subsection">
            <h3 className="subsection-title">Demandes de conventions d'étude</h3>
            {userConventionsEtude && userConventionsEtude.length > 0 ? (
              <div className="history-items">
                {userConventionsEtude.map((conv) => (
                  <div key={conv._id} className="history-item">
                    <div className="history-item-header">
                      <span className="history-type">Convention d'étude</span>
                      <span className={`history-status generated`}>
                        Générée
                      </span>
                      <span className="history-date">
                        {new Date(conv.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="history-item-content">
                      <p><strong>Candidat:</strong> {conv.prenomCandidat} {conv.nomCandidat}</p>
                      <p><strong>Promotion:</strong> {conv.etudes?.[0]?.etudeSuivie || 'Non spécifié'}</p>
                      <p><strong>Établissement:</strong> {conv.etudes?.[0]?.etablissement || 'Non spécifié'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Aucune demande de convention d'étude trouvée.</p>
            )}
          </div>

          {/* Bulletins */}
          <div className="history-subsection">
            <h3 className="subsection-title">Bulletins</h3>
            {userBulletins && userBulletins.length > 0 ? (
              <div className="history-items">
                {userBulletins.map((doc) => (
                  <div key={doc._id} className="history-item">
                    <div className="history-item-header">
                      <span className="history-type">Bulletin</span>
                      <span className={`history-status ${doc.status?.toLowerCase() || 'transferred'}`}>
                        {doc.status || 'Transféré'}
                      </span>
                      <span className="history-date">{doc.date}</span>
                    </div>
                    <div className="history-item-content">
                      <p><strong>Nom du document:</strong> {doc.name}</p>
                      <p><strong>Année:</strong> {doc.year}</p>
                      <p><strong>Extension:</strong> {doc.extension}</p>
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="download-link">
                          Télécharger
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Aucun bulletin trouvé.</p>
            )}
          </div>

          {/* Transferred Documents */}
          <div className="history-subsection">
            <h3 className="subsection-title">Documents transférés</h3>
            {userDocuments && userDocuments.length > 0 ? (
              <div className="history-items">
                {userDocuments.map((doc) => (
                  <div key={doc._id} className="history-item">
                    <div className="history-item-header">
                      <span className="history-type">{doc.docType}</span>
                      <span className={`history-status ${doc.status?.toLowerCase() || 'transferred'}`}>
                        {doc.status || 'Transféré'}
                      </span>
                      <span className="history-date">{doc.date}</span>
                    </div>
                    <div className="history-item-content">
                      <p><strong>Nom du document:</strong> {doc.name}</p>
                      <p><strong>Année:</strong> {doc.year}</p>
                      <p><strong>Extension:</strong> {doc.extension}</p>
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="download-link">
                          Télécharger
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Aucun document transféré trouvé.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profil;
