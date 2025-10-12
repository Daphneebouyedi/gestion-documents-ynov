import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from "./DashboardLayout";
import "./Dashboard.css";

const Demandes = () => {
  const navigate = useNavigate();
  
  // Get current user ID
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Fetch real data from Convex - Filter by userId
  const conventions = useQuery(
    api.conventions.getUserInternshipConventions, 
    userId ? { userId } : "skip"
  );
  const attestations = useQuery(
    api.attestations.getUserAttestations, 
    userId ? { userId } : "skip"
  );
  const mobileDemandes = useQuery(api.demandes.listDemandes);

  // Mutations
  const deleteInternshipConvention = useMutation(api.conventions.deleteInternshipConvention);
  const deleteAttestation = useMutation(api.attestations.deleteAttestation);
  const deleteDemande = useMutation(api.demandes.deleteDemande);

  // Combine and format the data
  const [demandes, setDemandes] = useState([]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "envoyé":
        return { backgroundColor: 'blue', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      case "en cours de traitement":
        return { backgroundColor: 'yellow', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      case "document reçu":
        return { backgroundColor: 'green', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      default:
        return { backgroundColor: 'gray', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
    }
  };

  useEffect(() => {
    if (conventions && attestations && mobileDemandes) {
      const formattedConventions = conventions.map((conv, index) => ({
        id: `conv-${conv._id}`,
        date: new Date(conv.createdAt).toLocaleString('fr-FR'),
        type: conv.type || "Convention de stage",
        lu: false,
        processingStatus: (conv.status.toLowerCase() === "pending" || conv.status.toLowerCase() === "generated") ? "envoyé" : conv.status.toLowerCase(),
        data: conv,
      }));

      const formattedAttestations = attestations.map((att, index) => ({
        id: `att-${att._id}`,
        date: new Date(att.createdAt).toLocaleString('fr-FR'),
        type: att.type || "Attestation",
        lu: false,
        processingStatus: (att.status.toLowerCase() === "pending" || att.status.toLowerCase() === "generated" || att.status.toLowerCase() === "en attente") ? "envoyé" : att.status.toLowerCase(),
        data: att,
      }));

      const formattedMobileDemandes = mobileDemandes.map((dem) => ({
        id: `mobile-${dem._id}`,
        date: new Date(dem.submittedAt).toLocaleString('fr-FR'),
        type: dem.type.replace('_', ' ').toUpperCase(),
        lu: false,
        processingStatus: (dem.status.toLowerCase() === "pending" || dem.status.toLowerCase() === "generated") ? "envoyé" : dem.status.toLowerCase(),
        data: dem,
      }));

      setDemandes([...formattedConventions, ...formattedAttestations, ...formattedMobileDemandes]);
    }
  }, [conventions, attestations, mobileDemandes]);

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
    if (id.startsWith('mobile-')) {
      navigate(`/details-demandes/${id}`);
    } else {
      navigate(`/details-demande/${id}`);
    }
  };

  const handleDelete = (id) => {
    setOpenMenuId(null);
    setModalMessage("Voulez-vous vraiment supprimer cette demande de manière irréversible ? Cette action ne peut pas être annulée.");
    setIsConfirmation(true);
    setConfirmAction(() => async () => {
      try {
        if (id.startsWith('conv-')) {
          const realId = id.replace('conv-', '');
          await deleteInternshipConvention({ id: realId });
        } else if (id.startsWith('att-')) {
          const realId = id.replace('att-', '');
          await deleteAttestation({ id: realId });
        } else if (id.startsWith('mobile-')) {
          const realId = id.replace('mobile-', '');
          await deleteDemande({ id: realId });
        }
        setDemandes(prev => prev.filter(d => d.id !== id));
        setShowModal(false);
      } catch (error) {
        console.error('Delete error', error);
        setModalMessage("Erreur lors de la suppression.");
        setIsConfirmation(false);
        setShowModal(true);
      }
    });
    setShowModal(true);
  };

  const types = ["Tous", ...Array.from(new Set(demandes.map(d => d.type))).sort()];

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDemandes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDemandes.map(d => d.id));
    }
  };



  const markSelected = (etat) => {
    if (selectedIds.length === 0) {
      setModalMessage("Veuillez sélectionner au moins une demande !");
      setIsConfirmation(false);
      setShowModal(true);
      return;
    }
    const confirmMsg = etat
      ? "Voulez-vous vraiment marquer ces demandes comme lues ?"
      : "Voulez-vous vraiment marquer ces demandes comme non lues ?";
      
    setModalMessage(confirmMsg);
    setIsConfirmation(true);
    setConfirmAction(() => () => {
      setDemandes(prev =>
        prev.map(d => (selectedIds.includes(d.id) ? { ...d, lu: etat } : d))
      );
      setSelectedIds([]);
      setShowModal(false);
    });
    setShowModal(true);
  };

  const filteredDemandes = filter === "Tous" ? demandes : demandes.filter(d => d.type === filter);

  return (
  <DashboardLayout pageTitle="Demandes" pageDescription="Gérez et traitez les demandes des utilisateurs">
    <div className="main-content" style={{ background: '#F6F8FA', minHeight: '100vh', padding: 0, marginLeft: 32, overflow: 'visible' }}>
        {/* Filtres */}
        <div className="filters" style={{ display: 'flex', gap: 16, marginBottom: 24, marginTop: 0, flexWrap: 'wrap' }}>
          {types.map((t, idx) => {
            const count = t === "Tous"
              ? demandes.filter(d => !d.lu).length
              : demandes.filter(d => d.type === t && !d.lu).length;
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
                      top: -11, // Positionne la pastille au bord supérieur
                      right: -11, // Positionne la pastille au bord droit
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
                      boxShadow: '0 0 4px rgba(0,0,0,0.1)', // ✅ pour un meilleur contraste visuel
                      zIndex: 10
                    }}>{count}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
        {/* Légende et actions supprimées, remplacées par icônes dans le tableau */}
        {/* Tableau demandes */}
        <div className="notifications-table-wrapper" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 0, marginTop: 0, overflow: 'visible', border: '1px solid #e6e6e6' }}>
          <table className="notifications-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#23c2a2', color: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 600, fontSize: 16 }}>
                <th style={{ padding: '16px 12px', borderTopLeftRadius: 16, borderBottom: 'none', textAlign: 'left', width: 48 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredDemandes.length && filteredDemandes.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ padding: '16px 12px', borderBottom: 'none', textAlign: 'left', minWidth: 150 }}>Statut du traitement</th>
                <th style={{ padding: '16px 12px', borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Date/heure</th>
                <th style={{ padding: '16px 12px', borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Type</th>
                <th style={{ padding: '16px 12px', borderTopRightRadius: 16, borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemandes.map(d => (
                <tr
                  key={d.id}
                  className={d.lu ? "lu" : "non-lu"}
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
                      checked={selectedIds.includes(d.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelection(d.id)}
                    />
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={getStatusStyle(d.processingStatus)}>{d.processingStatus}</span>
                  </td>
                  <td style={{ padding: '12px 12px', color: '#222' }}>{d.date}</td>
                  <td style={{ padding: '12px 12px', color: '#222', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {d.type}
                    {/* Icône trombone si pièce jointe (exemple : type Convention ou Certificat) */}
                    {(d.type === 'Convention de stage' || d.type === 'Attestation de frais de scolarité' || d.type === 'Convention d\'étude') && (
                      <img src="/pieces-jointes.png" alt="Pièce jointe" style={{ width: 18, height: 18, marginLeft: 6, opacity: 0.7 }} />
                    )}
                  </td>
                  <td style={{ padding: '12px 12px', color: '#222', position: 'relative' }}>
                    <button onClick={(e) => { e.stopPropagation(); handleMenuToggle(d.id); }} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>⋮</button>
                    {openMenuId === d.id && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e6e6e6', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10, minWidth: 120 }}>
                        <button onClick={() => handleDetails(d.id)} style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Détails</button>
                        <button onClick={() => handleDelete(d.id)} style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Supprimer</button>
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

export default Demandes;
