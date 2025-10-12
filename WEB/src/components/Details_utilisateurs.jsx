import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import "./Details_utilisateurs.css";
import DashboardLayout from './DashboardLayout';

const DetailsUtilisateurs = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useQuery(api.auth.getUser, { userId: id });
  const userConventions = useQuery(api.conventions.getUserInternshipConventions, { userId: id });
  const userAttestations = useQuery(api.attestations.getUserAttestations, { userId: id });
  const userDocuments = useQuery(api.documents.getUserTransferredDocuments, { userId: id });
  const userConventionsEtude = useQuery(api.conventions.getUserConventions, { userId: id });
  const userBulletins = useQuery(api.documents.getUserBulletins, { userId: id });

  if (!user) {
    return (
      <DashboardLayout pageTitle="Détails utilisateur" pageDescription="Informations détaillées sur l'utilisateur">
        <div className="details-loading">
          <div className="spinner"></div>
          <p>Chargement des détails utilisateur...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Détails utilisateur" pageDescription="Informations détaillées sur l'utilisateur">
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
              <p className="user-role">{user.role}</p>
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
                  <span className="detail-value">{user.phone || 'Non spécifié'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Adresse</span>
                  <span className="detail-value">{user.address || 'Non spécifié'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pays</span>
                  <span className="detail-value">{user.country || 'Non spécifié'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ville</span>
                  <span className="detail-value">{user.ville || 'Non spécifié'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date de naissance</span>
                  <span className="detail-value">{user.dateNaissance ? new Date(user.dateNaissance).toLocaleDateString('fr-FR') : 'Non spécifié'}</span>
                </div>
              </div>
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

export default DetailsUtilisateurs;
