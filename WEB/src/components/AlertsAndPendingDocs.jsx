import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import './AlertsAndPendingDocs.css'; // Import the new CSS file

const AlertsAndPendingDocs = () => {
  // Mock Data for Alerts
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      profile: '/profil_etudiant.png', // Placeholder image
      name: 'Dupont',
      firstName: 'Marie',
      promotion: 'B3 Informatique',
      specialty: 'Développement',
      documentType: 'Attestation de frais de scolarité',
      deadline: '07/10/2025',
      status: 'urgent', // red
      actionStatus: 'en attente', // New field
      reminderDate: '07/10/2025', // Example reminder date
    },
    {
      id: 2,
      profile: '/profil_etudiant.png',
      name: 'Martin',
      firstName: 'Paul',
      promotion: 'M1 Marketing',
      specialty: 'Informatique',
      documentType: 'Convention de stage',
      deadline: '09/10/2025',
      status: 'pending', // orange/blue
      actionStatus: 'relancé', // New field
      reminderDate: '09/10/2025', // Example reminder date
    },
    {
      id: 3,
      profile: '/profil_etudiant.png',
      name: 'Lefevre',
      firstName: 'Sophie',
      promotion: 'B2 Design',
      specialty: 'Data & IA',
      documentType: 'Relevé de notes',
      deadline: '15/10/2025',
      status: 'info', // green/blue
      actionStatus: 'en attente', // New field
      reminderDate: '15/10/2025', // Example reminder date
    },
    {
      id: 4,
      profile: '/profil_etudiant.png',
      name: 'Dubois',
      firstName: 'Thomas',
      promotion: 'B3 Informatique',
      specialty: 'Cybersécurité',
      documentType: 'Certificat de scolarité',
      deadline: '10/10/2025',
      status: 'urgent',
      actionStatus: 'en attente', // New field
      reminderDate: '10/10/2025', // Example reminder date
    },
    {
      id: 5,
      profile: '/profil_etudiant.png',
      name: 'Garcia',
      firstName: 'Lucas',
      promotion: 'M2 Finance',
      specialty: 'Informatique',
      documentType: 'Convention d\'étude',
      deadline: '05/10/2025',
      status: 'pending',
      actionStatus: 'relancé', // New field
      reminderDate: '05/10/2025', // Example reminder date
    },
    {
      id: 6,
      profile: '/profil_etudiant.png',
      name: 'Moreau',
      firstName: 'Chloé',
      promotion: 'B3 Informatique',
      specialty: 'Développement',
      documentType: 'Attestation de stage',
      deadline: '12/10/2025',
      status: 'info',
      actionStatus: 'en attente', // New field
      reminderDate: '12/10/2025', // Example reminder date
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPromotion, setFilterPromotion] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterActionStatus, setFilterActionStatus] = useState('all');
  const [filterDocumentType, setFilterDocumentType] = useState('all'); // New filter state

  const filteredAlerts = alerts.filter(alert => {
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    if (filterPromotion !== 'all' && alert.promotion !== filterPromotion) return false;
    if (filterSpecialty !== 'all' && alert.specialty !== filterSpecialty) return false;
    if (filterActionStatus !== 'all' && alert.actionStatus !== filterActionStatus) return false;
    if (filterDocumentType !== 'all' && alert.documentType !== filterDocumentType) return false; // New filter condition
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent':
        return 'red';
      case 'pending':
        return 'orange';
      case 'info':
        return 'blue'; // Using blue for general info/less urgent
      default:
        return 'gray';
    }
  };

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const toggleActionStatus = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? { ...alert, actionStatus: alert.actionStatus === 'relancé' ? 'en attente' : 'relancé' }
          : alert
      )
    );
  };


  const handleActionClick = (action, alertId) => {
    console.log(`${action} for alert ID: ${alertId}`);
    setOpenMenuId(null); // Close menu after action
    // Implement actual logic here (e.g., navigate to details, send email)
  };

  return (
    <DashboardLayout pageTitle="Alertes et documents en attente" pageDescription="Gérez les alertes et les documents en attente de traitement.">
      <div className="alerts-main-content">
        <div className="alerts-filters-container">
          <h3>Filtres</h3>
          <div className="alerts-filters">
            <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
              <option value="all">Tous les statuts</option>
              <option value="urgent">Urgent (Rouge)</option>
              <option value="pending">En attente (Orange)</option>
              <option value="info">Info (Bleu)</option>
            </select>
            <select onChange={(e) => setFilterPromotion(e.target.value)} value={filterPromotion}>
              <option value="all">Toutes les promotions</option>
              <option value="Bachelor 1">Bachelor 1</option>
              <option value="Bachelor 2">Bachelor 2</option>
              <option value="Bachelor 3">Bachelor 3</option>
              <option value="Mastère 1">Mastère 1</option>
              <option value="Mastère 2">Mastère 2</option>
            </select>
            <select onChange={(e) => setFilterSpecialty(e.target.value)} value={filterSpecialty}>
              <option value="all">Toutes les spécialités</option>
              <option value="Informatique">Informatique</option>
              <option value="Développement">Développement</option>
              <option value="Cybersécurité">Cybersécurité</option>
              <option value="Data & IA">Data & IA</option>
            </select>
            <select onChange={(e) => setFilterActionStatus(e.target.value)} value={filterActionStatus}>
              <option value="all">Tous les statuts d'action</option>
              <option value="en attente">En attente</option>
              <option value="relancé">Relancé</option>
            </select>
            <select onChange={(e) => setFilterDocumentType(e.target.value)} value={filterDocumentType}>
              <option value="all">Tous les types de document</option>
              <option value="Convention de stage">Convention de stage</option>
              <option value="Attestation de frais de scolarité">Attestation de frais de scolarité</option>
              <option value="Relevé de notes">Relevé de notes</option>
              <option value="Certificat de scolarité">Certificat de scolarité</option>
              <option value="Convention d'étude">Convention d'étude</option>
              <option value="Attestation de stage">Attestation de stage</option>
            </select>
          </div>
        </div>

        <div className="alerts-table-container">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Profil</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Promotion</th>
                <th>Spécialité</th>
                <th>Type de document</th>
                <th>Date de la Relance</th>
                <th>Statut</th> {/* New column header */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map(alert => (
                <tr key={alert.id}>
                  <td><img src={alert.profile} alt="Profile" className="alert-profile-img" /></td>
                  <td>{alert.name}</td>
                  <td>{alert.firstName}</td>
                  <td>{alert.promotion}</td>
                  <td>{alert.specialty}</td>
                  <td>
                    <span>
                      {alert.documentType}
                    </span>
                  </td>
                  <td>{alert.reminderDate || 'N/A'} {/* Display reminderDate or N/A */}</td>
                  <td>
                    <button
                      className={`action-status-button ${alert.actionStatus === 'relancé' ? 'status-relance' : 'status-attente'}`}
                      onClick={() => toggleActionStatus(alert.id)}
                    >
                      {alert.actionStatus}
                    </button>
                  </td> {/* New column data */}
                  <td className="actions-cell">
                    <div className="action-menu-wrapper" ref={openMenuId === alert.id ? menuRef : null}>
                      <button className="three-dots-button" onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === alert.id ? null : alert.id); }}>
                        &#8942; {/* Unicode for three vertical dots */}
                      </button>
                      {openMenuId === alert.id && (
                        <div className="action-menu">
                          <button onClick={() => handleActionClick('Détails', alert.id)}>Détails</button>
                          <button onClick={() => handleActionClick('Relance par Mail', alert.id)}>Relance par Mail</button>
                          <button onClick={() => handleActionClick('Relance par Téléphone', alert.id)}>Relance par Téléphone</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AlertsAndPendingDocs;