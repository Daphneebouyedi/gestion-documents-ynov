import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import "./Journalisation.css";
import DashboardLayout from './DashboardLayout';

const Journalisation = () => {
  const navigate = useNavigate();
  
  // Fetch action logs in real-time
  const actionLogs = useQuery(api.actionLogger.getAllActionLogs, { limit: 100 });
  const actionStats = useQuery(api.actionLogger.getActionStatistics);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  
  // Function to format timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Function to get action label in French
  const getActionLabel = (actionType) => {
    const labels = {
      login: "Connexion",
      logout: "Déconnexion",
      profile_update: "Modification du profil",
      profile_view: "Consultation du profil",
      password_change: "Changement de mot de passe",
      document_request: "Demande de document",
      document_upload: "Téléversement de document",
      document_download: "Téléchargement de document",
      document_delete: "Suppression de document",
      document_validate: "Validation de document",
      document_reject: "Rejet de document",
      user_create: "Création d'utilisateur",
      user_update: "Modification d'utilisateur",
      user_delete: "Suppression d'utilisateur",
      user_activate: "Activation d'utilisateur",
      user_deactivate: "Désactivation d'utilisateur",
      convention_create: "Création de convention",
      convention_update: "Modification de convention",
      convention_delete: "Suppression de convention",
      attestation_create: "Création d'attestation",
      attestation_update: "Modification d'attestation",
      attestation_delete: "Suppression d'attestation",
      alert_create: "Création d'alerte",
      alert_read: "Lecture d'alerte",
      alert_delete: "Suppression d'alerte",
      settings_update: "Modification des paramètres",
      terms_accept: "Acceptation des CGU",
      search: "Recherche",
    };
    return labels[actionType] || actionType;
  };
  
  // Filter logs based on search and filters
  const filteredLogs = actionLogs?.filter(log => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userName && log.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Type filter
    const matchesType = filterType === "all" || log.actionType === filterType;
    
    // Date range filter
    let matchesDate = true;
    if (dateRange !== "all") {
      const now = Date.now();
      const logTime = log.timestamp;
      
      switch(dateRange) {
        case "today":
          matchesDate = logTime >= now - 24 * 60 * 60 * 1000;
          break;
        case "week":
          matchesDate = logTime >= now - 7 * 24 * 60 * 60 * 1000;
          break;
        case "month":
          matchesDate = logTime >= now - 30 * 24 * 60 * 60 * 1000;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <DashboardLayout pageTitle="Historique des Actions" pageDescription="Journalisation en temps réel des actions des utilisateurs">
      <div className="journalisation-wrapper">
        {/* Statistics Cards */}
        {actionStats && (
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Actions</h3>
              <p className="stat-value">{actionStats.totalActions}</p>
            </div>
            <div className="stat-card">
              <h3>Aujourd'hui</h3>
              <p className="stat-value">{actionStats.actionsToday}</p>
            </div>
            <div className="stat-card">
              <h3>Cette Semaine</h3>
              <p className="stat-value">{actionStats.actionsThisWeek}</p>
            </div>
            <div className="stat-card">
              <h3>Ce Mois</h3>
              <p className="stat-value">{actionStats.actionsThisMonth}</p>
            </div>
          </div>
        )}
        
        {/* Filters */}
        <div className="filters-container">
          <input
            type="text"
            placeholder="Rechercher par utilisateur ou action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les types</option>
            <option value="login">Connexions</option>
            <option value="profile_update">Modifications de profil</option>
            <option value="document_request">Demandes de documents</option>
            <option value="document_upload">Téléversements</option>
            <option value="document_validate">Validations</option>
            <option value="document_reject">Rejets</option>
            <option value="user_create">Créations d'utilisateur</option>
            <option value="convention_create">Conventions</option>
            <option value="attestation_create">Attestations</option>
          </select>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>
        
        {/* Logs Table */}
        <div className="logs-table-wrapper">
          {!actionLogs ? (
            <div className="loading-message">Chargement des logs...</div>
          ) : filteredLogs && filteredLogs.length > 0 ? (
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Date/Heure</th>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Action</th>
                  <th>Type</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log._id}>
                    <td>{formatDate(log.timestamp)}</td>
                    <td>{log.userFullName || log.userName || "N/A"}</td>
                    <td>{log.userEmail}</td>
                    <td>{log.action}</td>
                    <td>
                      <span className={`action-badge action-${log.actionType}`}>
                        {getActionLabel(log.actionType)}
                      </span>
                    </td>
                    <td className="details-cell">
                      {log.details && typeof log.details === 'object' ? (
                        <details>
                          <summary>Voir détails</summary>
                          <pre>{JSON.stringify(log.details, null, 2)}</pre>
                        </details>
                      ) : (
                        log.details || "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-logs-message">
              Aucun log trouvé avec les filtres sélectionnés.
            </div>
          )}
        </div>
        
        <div className="logs-footer">
          <p>Total affiché: {filteredLogs?.length || 0} actions</p>
          <p className="refresh-note">✓ Actualisation automatique en temps réel</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Journalisation;