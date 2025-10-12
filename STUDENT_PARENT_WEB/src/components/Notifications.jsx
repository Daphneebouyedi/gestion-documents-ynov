import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from "./DashboardLayout";
import "./Dashboard.css";

const Notifications = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [userIdFromToken, setUserIdFromToken] = useState(null);
  const verifyTokenAction = useAction(api.authActions.verifyTokenAction);

  useEffect(() => {
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

  const alerts = useQuery(api.alerts.getUserAlerts, userIdFromToken ? { userId: userIdFromToken } : "skip");
  const deleteAlertMutation = useMutation(api.alerts.deleteAlert);

  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState("Tous");

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDetails = (id) => {
    setOpenMenuId(null);
    navigate(`/alerts/${id}`);
  };

  const handleDelete = (id) => {
    setOpenMenuId(null);
    setModalMessage("Voulez-vous vraiment supprimer cette notification de manière irréversible ? Cette action ne peut pas être annulée.");
    setIsConfirmation(true);
    setConfirmAction(() => async () => {
      try {
        await deleteAlertMutation({ id });
        setShowModal(false);
        // Optionally refetch or update state
      } catch (error) {
        console.error('Delete error', error);
        setModalMessage("Erreur lors de la suppression.");
        setIsConfirmation(false);
        setShowModal(true);
      }
    });
    setShowModal(true);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Disponible":
        return { backgroundColor: 'green', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      case "Relance":
        return { backgroundColor: 'orange', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      case "En cours":
        return { backgroundColor: 'blue', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      case "Rejeté":
        return { backgroundColor: 'red', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      case "Validé":
        return { backgroundColor: 'green', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      default:
        return { backgroundColor: 'gray', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
    }
  };

  const types = ["Tous", ...Array.from(new Set(alerts?.map(a => a.documentType) || [])).sort()];

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAlerts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAlerts.map(a => a._id));
    }
  };

  const filteredAlerts = filter === "Tous" ? (alerts || []) : (alerts || []).filter(a => a.documentType === filter);

  return (
    <DashboardLayout pageTitle="Notifications" pageDescription="Gérez vos notifications et relances">
      <div className="main-content" style={{ background: '#F6F8FA', minHeight: '100vh', padding: 0, marginLeft: 32, overflow: 'visible' }}>
        {/* Filtres */}
        <div className="filters" style={{ display: 'flex', gap: 16, marginBottom: 24, marginTop: 0, flexWrap: 'wrap' }}>
          {types.map((t, idx) => {
            const count = t === "Tous"
              ? (alerts || []).filter(a => a.status !== "Lu").length
              : (alerts || []).filter(a => a.documentType === t && a.status !== "Lu").length;
            const isActive = filter === t;
            return (
              <div key={t} style={{ flex: 1, minWidth: 120, display: 'flex' }}>
                <button
                  onClick={() => setFilter(t)}
                  style={{
                    position: 'relative',
                    borderRadius: 8,
                    border: isActive ? '1.5px solid #23c2a2' : '1.5px solid #e6e6e6',
                    background: isActive ? '#23c2a2' : '#fff',
                    color: isActive ? '#fff' : '#222',
                    fontWeight: 600,
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 16,
                    padding: '18px 0',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    outline: 'none',
                    margin: 0,
                    minWidth: 0,
                    width: '100%',
                    borderColor: isActive ? '#23c2a2' : '#e6e6e6',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.border = '1.5px solid #23c2a2';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(35,194,162,0.13)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.border = isActive ? '1.5px solid #23c2a2' : '1.5px solid #e6e6e6';
                    e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.05)';
                  }}
                >
                  {t}
                  {count > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -11,
                      right: -11,
                      background: '#ff2d2d',
                      color: '#fff',
                      borderRadius: '50%',
                      minWidth: 22,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      border: '2px solid #fff',
                      boxShadow: '0 0 4px rgba(0,0,0,0.1)',
                      zIndex: 10
                    }}>{count}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Tableau notifications */}
        <div className="notifications-table-wrapper" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 0, marginTop: 0, overflow: 'visible', border: '1px solid #e6e6e6' }}>
          <table className="notifications-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#23c2a2', color: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 600, fontSize: 16 }}>
                <th style={{ padding: '16px 12px', borderTopLeftRadius: 16, borderBottom: 'none', textAlign: 'left', width: 48 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredAlerts.length && filteredAlerts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ padding: '16px 12px', borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Statut</th>
                <th style={{ padding: '16px 12px', borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Type</th>
                <th style={{ padding: '16px 12px', borderBottom: 'none', textAlign: 'left', minWidth: 150 }}>Date/heure</th>
                <th style={{ padding: '16px 12px', borderTopRightRadius: 16, borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map(a => (
                <tr
                  key={a._id}
                  style={{
                    background: '#F6F8FA',
                    borderBottom: '1px solid #e6e6e6',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 15,
                    transition: 'background 0.2s'
                  }}
                >
                  <td style={{ padding: '12px 12px' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(a._id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelection(a._id)}
                    />
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={getStatusStyle(a.status)}>{a.status}</span>
                  </td>
                  <td style={{ padding: '12px 12px', color: '#222' }}>{a.documentType}</td>
                  <td style={{ padding: '12px 12px', color: '#222' }}>{new Date(a.createdAt).toLocaleString('fr-FR')}</td>
                  <td style={{ padding: '12px 12px', color: '#222', position: 'relative' }}>
                    <button onClick={(e) => { e.stopPropagation(); handleMenuToggle(a._id); }} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>⋮</button>
                    {openMenuId === a._id && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e6e6e6', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10, minWidth: 120 }}>
                        <button onClick={() => handleDetails(a._id)} style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Détails</button>
                        <button onClick={() => {}} style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Répondre</button>
                        <button onClick={() => handleDelete(a._id)} style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Supprimer</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal pour les messages et confirmations */}
        {showModal && (
          <div className="modal-backdrop">
            <div className="floating-modal">
              <h2 className="modal-title">Notification</h2>
              <p className="modal-message">{modalMessage}</p>
              <div className="modal-actions">
                {isConfirmation && (
                  <>
                    <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
                    <button className="btn-confirm" onClick={confirmAction}>Confirmer</button>
                  </>
                )}
                {!isConfirmation && (
                  <button className="btn-confirm" onClick={() => setShowModal(false)}>OK</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
