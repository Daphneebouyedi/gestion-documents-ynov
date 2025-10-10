import React from 'react';
import DashboardLayout from './DashboardLayout';
import './Dashboard.css';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const Dashboard = () => {
  const actions = useQuery(api.user_actions.getActions) || [];
  const totalUsers = useQuery(api.auth.getTotalUsers) || 0;
  const totalDocuments = useQuery(api.documents.getTotalDocuments) || 0;
  const totalTransferredDocuments = useQuery(api.documents.getTotalTransferredDocuments) || 0;
  const totalRequests = useQuery(api.requests.getTotalRequests) || 0;

  // Mock Data for Charts
  const monthlyData = [];

  const documentTypeData = [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const requestVolumeData = [];

  // Mock Data for Alerts
  const alertsData = [];

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

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>Documents et Demandes par Mois</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="documents" fill="#8884d8" name="Documents Ajoutés" />
                <Bar dataKey="requests" fill="#82ca9d" name="Demandes Traitées" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Répartition des Documents par Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={documentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {documentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Évolution du Volume de Demandes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={requestVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="volume" stroke="#ffc658" activeDot={{ r: 8 }} name="Volume de Demandes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertes et documents en attente */}
        <div className="alerts-card">
          <h2>🔔 Alertes et documents en attente</h2>
          <div className="alerts-table-wrapper">
            <table className="alerts-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date limite</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {alertsData.map((alert, index) => (
                  <tr key={index}>
                    <td>
                      <span className={`alert-badge ${alert.severity}`}>{alert.type}</span>
                    </td>
                    <td>{alert.description}</td>
                    <td>{alert.deadline}</td>
                    <td>
                      <button className="view-folder-button">Voir le dossier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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