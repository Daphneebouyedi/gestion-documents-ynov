import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import './AlertsAndPendingDocs.css'; // Import the new CSS file
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FaUser } from 'react-icons/fa';

const AlertsAndPendingDocs = () => {
  // Fetch real users from database
  const usersFromDb = useQuery(api.auth.listUsers) || [];
  const sendReminderEmailAction = useAction(api.authActions.sendReminderEmailAction);
  const createAlertMutation = useMutation(api.alerts.createAlert);
  const navigate = useNavigate();

  // State for action statuses
  const [actionStatuses, setActionStatuses] = useState({});

  // State for alerts
  const [alerts, setAlerts] = useState([]);

  // Filter out admins and take first 7 non-admin users
  const nonAdminUsers = usersFromDb.filter(user => user.role.toLowerCase() !== 'admin').slice(0, 7);

  // Initialize alerts from users
  useEffect(() => {
    if (usersFromDb.length > 0 && alerts.length === 0) {
      const initialAlerts = nonAdminUsers.map((user, index) => ({
        id: user._id,
        profile: user.photoUrl || '/la-personne.png',
        name: user.lastName || '',
        firstName: user.firstName || '',
        promotion: user.promotion || '',
        specialty: user.specialite || '',
        documentType: getDocumentTypeForUser(user, index), // Function to assign document types
        deadline: getDeadlineForUser(index), // Function to assign deadlines
        status: getStatusForUser(index), // Function to assign status
        actionStatus: actionStatuses[user._id] || (index % 2 === 0 ? 'en attente' : 'relancé'), // Use state or default
        reminderDate: getDeadlineForUser(index),
        email: user.email,
        isOnline: user.isOnline,
      }));
      setAlerts(initialAlerts);
    }
  }, [usersFromDb, actionStatuses, alerts.length, nonAdminUsers]);

  // Helper functions to assign values based on index
  function getDocumentTypeForUser(user, index) {
    const types = [
      'Attestation de frais de scolarité',
      'Convention de stage',
      'Relevé de notes',
      'Certificat de scolarité',
      'Convention d\'étude',
      'Attestation de stage',
      'Convention de stage'
    ];
    return types[index % types.length];
  }

  function getDeadlineForUser(index) {
    const deadlines = [
      '07/10/2025',
      '09/10/2025',
      '15/10/2025',
      '10/10/2025',
      '05/10/2025',
      '12/10/2025',
      '20/10/2025'
    ];
    return deadlines[index % deadlines.length];
  }

  function getStatusForUser(index) {
    const statuses = ['urgent', 'pending', 'info', 'urgent', 'pending', 'info', 'pending'];
    return statuses[index % statuses.length];
  }

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPromotion, setFilterPromotion] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterActionStatus, setFilterActionStatus] = useState('all');
  const [filterDocumentType, setFilterDocumentType] = useState('all'); // New filter state

  // State for adding new alert
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [selectedDeadline, setSelectedDeadline] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showUserSearchResults, setShowUserSearchResults] = useState(false);

  const filteredAlerts = alerts.filter(alert => {
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    if (filterPromotion !== 'all' && alert.promotion !== filterPromotion) return false;
    if (filterSpecialty !== 'all' && alert.specialty !== filterSpecialty) return false;
    if (filterActionStatus !== 'all' && alert.actionStatus !== filterActionStatus) return false;
    if (filterDocumentType !== 'all' && alert.documentType !== filterDocumentType) return false; // New filter condition
    return true;
  });

  const filteredUsersForSearch = nonAdminUsers.filter(user => {
    const query = userSearchQuery.toLowerCase();
    return (
      user.lastName.toLowerCase().includes(query) ||
      user.firstName.toLowerCase().includes(query) ||
      user.promotion.toLowerCase().includes(query) ||
      user.specialite.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  const handleUserSearchChange = (e) => {
    setUserSearchQuery(e.target.value);
    setSelectedUserId(''); // Clear selected user when typing
    setShowUserSearchResults(true);
  };

  const handleUserSelect = (user) => {
    setSelectedUserId(user._id);
    setUserSearchQuery(`${user.lastName} ${user.firstName}`); // Display selected user in input
    setShowUserSearchResults(false);
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
    setActionStatuses(prev => ({
      ...prev,
      [alertId]: prev[alertId] === 'relancé' ? 'en attente' : 'relancé'
    }));
  };

  const handleActionClick = async (action, alertId) => {
    console.log(`${action} for alert ID: ${alertId}`);
    setOpenMenuId(null); // Close menu after action

    if (action === 'Relance par Mail') {
      const alert = alerts.find(a => a.id === alertId);
      if (alert) {
          try {
            await sendReminderEmailAction({
              to: alert.email,
              firstName: alert.firstName,
              lastName: alert.name,
              documentType: alert.documentType,
              deadline: alert.deadline,
            });
            // Update status to 'relancé' after sending email
            setActionStatuses(prev => ({
              ...prev,
              [alertId]: 'relancé'
            }));
            window.alert('Email de rappel envoyé avec succès!');
          } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            window.alert('Erreur lors de l\'envoi de l\'email.');
          }
      }
    } else if (action === 'Détails') {
      // Navigate to user details page
      navigate(`/utilisateur/${alertId}`);
    } else if (action === 'Relance par Téléphone') {
      // Handle phone reminder
      console.log('Phone reminder for', alertId);
    }
  };

  const addNewAlert = async () => {
    let currentSelectedUserId = selectedUserId;

    if (!currentSelectedUserId) {
      if (userSearchQuery) {
        const exactMatchUser = nonAdminUsers.find(user => 
          `${user.lastName} ${user.firstName}`.toLowerCase() === userSearchQuery.toLowerCase()
        );
        if (exactMatchUser) {
          currentSelectedUserId = exactMatchUser._id;
        } else {
          window.alert('Veuillez sélectionner un utilisateur dans la liste déroulante.');
          return;
        }
      } else {
        window.alert('Veuillez sélectionner un utilisateur, un type de document et une date limite.');
        return;
      }
    }

    if (!selectedDocumentType || !selectedDeadline) {
      window.alert('Veuillez sélectionner un type de document et une date limite.');
      return;
    }
    const user = usersFromDb.find(u => u._id === currentSelectedUserId);
    if (!user) {
      window.alert('L\'utilisateur sélectionné n\'est pas valide.');
      return;
    }
    const newAlert = {
      userId: user._id,
      profile: user.photoUrl || '/la-personne.png',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      promotion: user.promotion || '',
      specialty: user.specialite || '',
      documentType: selectedDocumentType,
      deadline: selectedDeadline,
      status: 'pending', // Default status
      actionStatus: 'en attente',
      reminderDate: selectedDeadline,
      email: user.email,
      isOnline: user.isOnline,
    };

    try {
      const alertId = await createAlertMutation(newAlert);
      // Update local state with the new alert, including the ID from the database
      setAlerts(prev => [...prev, { ...newAlert, id: alertId }]);
      setSelectedUserId('');
      setSelectedDocumentType('');
      setSelectedDeadline('');
      setUserSearchQuery(''); // Clear search query after adding alert
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to create alert:", error);
      window.alert("Échec de la création de l'alerte.");
    }
  };

  return (
    <DashboardLayout pageTitle="Alertes et documents en attente" pageDescription="Gérez les alertes et les documents en attente de traitement.">
      <div>
        <div className="alerts-main-content">
          {/* Add new alert form toggle */}
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <button
              className="add-button"
              style={{ padding: '0.7rem 1.5rem', fontSize: '1rem', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(45,114,254,0.08)' }}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Annuler' : '+ Ajouter une alerte'}
            </button>
          </div>

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

          {/* Add new alert form */} 
          {showAddForm && (
            <div className="modal">
              <div className="modal-content">
                <h2>Ajouter une alerte</h2>
                <div className="searchable-user-input-container">
                  <FaUser className="search-icon" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur (Nom, Prénom, Promotion, Spécialité, Rôle)"
                    value={userSearchQuery}
                    onChange={handleUserSearchChange}
                    onFocus={() => setShowUserSearchResults(true)}
                    onBlur={() => setTimeout(() => setShowUserSearchResults(false), 100)}
                    className="searchable-user-input"
                  />
                  {showUserSearchResults && userSearchQuery && (
                    <div className="search-results-dropdown">
                      {filteredUsersForSearch.length > 0 ? (
                        filteredUsersForSearch.map(user => (
                          <div
                            key={user._id}
                            className="search-results-item"
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                            onClick={() => handleUserSelect(user)}
                          >
                            {user.lastName} {user.firstName} - {user.promotion} - {user.specialite} - {user.role}
                          </div>
                        ))
                      ) : (
                        <div className="search-results-item" style={{ cursor: 'default', color: '#888' }}>Aucun utilisateur trouvé.</div>
                      )}
                    </div>
                  )}
                </div>
                <select value={selectedDocumentType} onChange={(e) => setSelectedDocumentType(e.target.value)}>
                  <option value="">Sélectionnez un type de document</option>
                  <option value="Convention de stage">Convention de stage</option>
                  <option value="Attestation de frais de scolarité">Attestation de frais de scolarité</option>
                  <option value="Relevé de notes">Relevé de notes</option>
                  <option value="Certificat de scolarité">Certificat de scolarité</option>
                  <option value="Convention d'étude">Convention d'étude</option>
                  <option value="Attestation de stage">Attestation de stage</option>
                </select>
                <input
                  type="date"
                  value={selectedDeadline}
                  onChange={(e) => setSelectedDeadline(e.target.value)}
                />
                <div className="modal-actions" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
                  <button className="cancel-button" onClick={() => setShowAddForm(false)}>Annuler</button>
                  <button className="confirm-button" onClick={addNewAlert}>Ajouter</button>
                </div>
              </div>
            </div>
          )}
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
                    <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ position: 'relative', width: 36, height: 36 }}>
                        <img src={alert.profile} alt="profil" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e6e6e6' }} />
                        <span style={{
                          position: 'absolute',
                          right: 2,
                          bottom: 2,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: alert.isOnline ? '#32CD32' : '#FF0000',
                          border: '2px solid #fff',
                          boxShadow: '0 0 2px #888',
                          display: 'inline-block',
                        }} />
                      </div>
                    </td>
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
      </div>
    </DashboardLayout>
  );
};

export default AlertsAndPendingDocs;