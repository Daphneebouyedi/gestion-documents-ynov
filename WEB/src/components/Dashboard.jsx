import React from 'react';
import DashboardLayout from './DashboardLayout';
import './Dashboard.css';

import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const Dashboard = () => {
  const actions = useQuery(api.user_actions.getActions) || [];
  const totalUsers = useQuery(api.auth.getTotalUsers) || 0;
  const totalDocuments = useQuery(api.documents.getTotalDocuments) || 0;
  const totalTransferredDocuments = useQuery(api.documents.getTotalTransferredDocuments) || 0;
  const totalRequests = useQuery(api.requests.getTotalRequests) || 0;

  return (
    <DashboardLayout pageTitle="Tableau de bord" pageDescription="Bienvenue sur votre espace d'administration">
      <div className="main-content dashboard-main-content-grid">
        {/* Summary Cards */}
        <div className="summary-cards">
          {[
            { img: '/Total_Users.png', label: 'Utilisateurs', number: totalUsers },
            { img: '/Total_Demandes.png', label: 'Demandes', number: totalRequests },
            { img: '/Total_transferts.png', label: 'Documents transférés', number: totalTransferredDocuments },
            { img: '/Total_Documents_Disponibles.png', label: 'Documents Disponibles', number: totalDocuments },
          ].map((item, i) => (
            <div
              key={i}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                gap: 0, // aucune marge entre les éléments
              }}
            >
              <div
                className="card-icon"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 0, // supprimé
                }}
              >
                <img src={item.img} alt={item.label} style={{ width: 48, height: 48, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
              </div>
              <div
                className="card-label"
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  marginTop: 2, // très léger espace
                }}
              >
                {item.label}
              </div>
              <div
                className="card-number"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {item.number}
              </div>
            </div>
          ))}
        </div>

        {/* Historique des actions */}
        <div className="logs-card">
          <h2>Historique des actions</h2>
          <div className="logs-table-wrapper">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Action</th>
                  <th>Date/Heure</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action, index) => (
                  <tr key={index}>
                    <td>{action.user}</td>
                    <td>{action.action}</td>
                    <td>{new Date(action.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;