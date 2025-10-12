import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';
import "./Dashboard.css";

const DocumentsDispo = () => {
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

  // Fetch documents for the user
  const documents = useQuery(api.documents.getDocuments, userIdFromToken ? { studentId: userIdFromToken } : {});

  const [filterAnnee, setFilterAnnee] = useState('Tous');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [filterType, setFilterType] = useState('Tous');

  const [openMenuId, setOpenMenuId] = useState(null);

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDetails = (id) => {
    setOpenMenuId(null);
    navigate(`/documents-dispo/${id}`);
  };

  const handleDelete = (id) => {
    setOpenMenuId(null);
    // Implement delete if needed
    alert('Supprimer document ' + id);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Validé":
        return { backgroundColor: 'green', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      case "En cours":
        return { backgroundColor: 'blue', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      case "Rejeté":
        return { backgroundColor: 'red', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
      default:
        return { backgroundColor: 'gray', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' };
    }
  };

  const annees = ["Tous", "2020-2021", "2021-2022", "2022-2023", "2023-2024", "2024-2025", "2025-2026", "2026-2027", "2027-2028", "2028-2029", "2029-2030", "2030-2031"];
  const statuts = ["Tous", "En cours", "Rejeté", "Validé", "Disponible", "En attente"];
  const types = ["Tous", "Convention de stage", "Convention d'étude", "Attestation de frais de scolarité", "Attestation d’inscription", "Attestation de réussite", "Bulletin"];

  const filteredDocuments = documents?.filter(doc => {
    const matchesAnnee = filterAnnee === 'Tous' || doc.year === filterAnnee;
    const matchesStatut = filterStatut === 'Tous' || doc.status === filterStatut;
    const matchesType = filterType === 'Tous' || doc.docType === filterType;
    return matchesAnnee && matchesStatut && matchesType;
  }) || [];

  return (
    <DashboardLayout pageTitle="Documents disponibles" pageDescription="Consultez et gérez les documents mis à disposition">
      <div className="main-content" style={{ background: '#F6F8FA', minHeight: '100vh', padding: 0, marginLeft: 32, overflow: 'visible' }}>
        {/* Filtres */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, fontWeight: 600, color: '#666', whiteSpace: 'nowrap' }}>Année</label>
            <select
              value={filterAnnee}
              onChange={(e) => setFilterAnnee(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                backgroundColor: '#fff',
                fontFamily: 'Arial, sans-serif',
                fontSize: 14,
                color: '#374151',
                minWidth: 120,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#23c2a2';
                e.target.style.boxShadow = '0 0 0 3px rgba(35,194,162,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              {annees.map((annee) => {
                const count = annee === "Tous"
                  ? (documents || []).length
                  : (documents || []).filter(d => d.year === annee).length;
                return (
                  <option key={annee} value={annee}>
                    {annee} {count > 0 && `(${count})`}
                  </option>
                );
              })}
            </select>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, fontWeight: 600, color: '#666', whiteSpace: 'nowrap' }}>Statut</label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                backgroundColor: '#fff',
                fontFamily: 'Arial, sans-serif',
                fontSize: 14,
                color: '#374151',
                minWidth: 120,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#23c2a2';
                e.target.style.boxShadow = '0 0 0 3px rgba(35,194,162,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              {statuts.map((statut) => {
                const count = statut === "Tous"
                  ? (documents || []).length
                  : (documents || []).filter(d => d.status === statut).length;
                return (
                  <option key={statut} value={statut}>
                    {statut} {count > 0 && `(${count})`}
                  </option>
                );
              })}
            </select>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, fontWeight: 600, color: '#666', whiteSpace: 'nowrap' }}>Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                backgroundColor: '#fff',
                fontFamily: 'Arial, sans-serif',
                fontSize: 14,
                color: '#374151',
                minWidth: 120,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#23c2a2';
                e.target.style.boxShadow = '0 0 0 3px rgba(35,194,162,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              {types.map((type) => {
                const count = type === "Tous"
                  ? (documents || []).length
                  : (documents || []).filter(d => d.docType === type).length;
                return (
                  <option key={type} value={type}>
                    {type} {count > 0 && `(${count})`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Tableau documents */}
        <div className="notifications-table-wrapper" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 0, marginTop: 0, overflow: 'visible', border: '1px solid #e6e6e6' }}>
          <table className="notifications-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#23c2a2', color: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 600, fontSize: 16 }}>
                <th style={{ padding: '16px 12px', borderTopLeftRadius: 16, borderBottom: 'none', textAlign: 'left', minWidth: 200 }}>Nom du document</th>
                <th style={{ padding: '16px 12px', borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Date</th>
                <th style={{ padding: '16px 12px', borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Année</th>
                <th style={{ padding: '16px 12px', borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Statut</th>
                <th style={{ padding: '16px 12px', borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Type</th>
                <th style={{ padding: '16px 12px', borderTopRightRadius: 16, borderBottom: 'none', textAlign: 'left', minWidth: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map(doc => (
                <tr
                  key={doc._id}
                  style={{
                    background: '#F6F8FA',
                    borderBottom: '1px solid #e6e6e6',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 15,
                    transition: 'background 0.2s'
                  }}
                >
                  <td style={{ padding: '12px 12px', color: '#222' }}>{doc.name}</td>
                  <td style={{ padding: '12px 12px', color: '#222' }}>{doc.date}</td>
                  <td style={{ padding: '12px 12px', color: '#222' }}>{doc.year}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={getStatusStyle(doc.status)}>{doc.status}</span>
                  </td>
                  <td style={{ padding: '12px 12px', color: '#222' }}>{doc.docType}</td>
                  <td style={{ padding: '12px 12px', color: '#222', position: 'relative' }}>
                    <button onClick={(e) => { e.stopPropagation(); handleMenuToggle(doc._id); }} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>⋮</button>
                    {openMenuId === doc._id && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e6e6e6', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10, minWidth: 120 }}>
                        <button onClick={() => handleDetails(doc._id)} style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Détails</button>
                        <button onClick={() => handleDelete(doc._id)} style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Supprimer</button>
                      </div>
                    )}
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

export default DocumentsDispo;
