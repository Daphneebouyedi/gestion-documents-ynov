import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';

const DetailsDemandes = () => {
  const { id } = useParams();
  const demandeId = id.replace('mobile-', '');
  const demande = useQuery(api.demandes.getDemandeById, { id: demandeId });

  if (!demande) {
    return (
      <DashboardLayout pageTitle="Détails demande" pageDescription="Informations détaillées sur la demande">
        <div className="details-loading">
          <div className="spinner"></div>
          <p>Chargement des détails demande...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Détails demande" pageDescription="Informations détaillées sur la demande">
      <div className="details-container">
        <div className="user-profile-card">
          <div className="profile-details-grid">
            <div className="detail-section">
              <h3 className="section-title">Informations de la demande</h3>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">Type</span>
                  <span className="detail-value">{demande.type.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Statut</span>
                  <span className="detail-value">{demande.status}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Soumis le</span>
                  <span className="detail-value">{new Date(demande.submittedAt).toLocaleString('fr-FR')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Titre</span>
                  <span className="detail-value">{demande.title || 'Non spécifié'}</span>
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h3 className="section-title">Pièce jointe</h3>
              {demande.attachmentUrl && (
                <div className="detail-items">
                  <div className="detail-item">
                    <span className="detail-label">Document</span>
                    <a href={demande.attachmentUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                      Télécharger le PDF
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DetailsDemandes;
