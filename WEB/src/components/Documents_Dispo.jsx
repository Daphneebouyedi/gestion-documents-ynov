import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaIdBadge, FaCalendarAlt, FaLayerGroup, FaCogs, FaFileAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';
import ReactDOM from 'react-dom';
import DashboardLayout from './DashboardLayout';

const DocumentsDispo = () => {
  const [documents, setDocuments] = useState([]);
  const [editedValues, setEditedValues] = useState({});
  
  const [searchNom, setSearchNom] = useState('');
  const [searchPrenom, setSearchPrenom] = useState('');
  const [filterAnnee, setFilterAnnee] = useState('');
  const [filterPromotion, setFilterPromotion] = useState('');
  const [filterSpecialite, setFilterSpecialite] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterType, setFilterType] = useState('');

  const buttonRefs = useRef([]);

  // Filtrage prénom/nom
  function getNomPrenom(student) {
    const parts = student.split(' ');
    if (parts.length >= 2) {
      return { nom: parts[parts.length - 1], prenom: parts.slice(0, -1).join(' ') };
    }
    return { nom: student, prenom: '' };
  }

  // Documents filtrés
  const filteredDocuments = documents.filter(doc => {
    const { nom, prenom } = getNomPrenom(doc.student);
    const matchesNom = searchNom ? nom.toLowerCase().includes(searchNom.toLowerCase()) : true;
    const matchesPrenom = searchPrenom ? prenom.toLowerCase().includes(searchPrenom.toLowerCase()) : true;
    const matchesAnnee = filterAnnee ? doc.year === filterAnnee : true;
    const matchesPromotion = filterPromotion ? doc.promotion === filterPromotion : true;
    const matchesSpecialite = filterSpecialite ? doc.specialite === filterSpecialite : true;
    const matchesStatut = filterStatut ? doc.status === filterStatut : true;
    const matchesType = filterType ? doc.docType === filterType : true;
    return matchesNom && matchesPrenom && matchesAnnee && matchesPromotion && matchesSpecialite && matchesStatut && matchesType;
  });

  useEffect(() => {
    buttonRefs.current = Array(filteredDocuments.length).fill().map((_, i) => buttonRefs.current[i] || React.createRef());
  }, [filteredDocuments.length]);

  const handleDelete = (doc) => {
    if (window.confirm(`Supprimer le document "${doc.name}" ?`)) {
      setDocuments(docs => docs.filter(d => d._id !== doc._id));
    }
  };

  return (
    <DashboardLayout pageTitle="Documents disponibles" pageDescription="Consultez et gérez les documents mis à disposition">

        {/* Filtres */}
        <div
          style={{
            margin: '0 auto 24px auto',
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
            padding: '16px 20px 10px 20px',
            maxWidth: 950,
            minWidth: 220,
            width: '100%',
            position: 'relative',
          }}
        >
          <span style={{ position: 'absolute', top: 10, left: 22, fontWeight: 'bold', fontSize: '1.1rem', color: '#333', letterSpacing: '0.5px' }}>Filtres</span>
          <div style={{ height: '1.7rem' }}></div>
          <div style={{ display: 'flex', gap: 24, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <FaIdBadge style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
              <input
                type="text"
                placeholder="Nom"
                value={searchNom}
                onChange={e => setSearchNom(e.target.value)}
                style={{
                  borderRadius: 8,
                  border: '1.5px solid #e6e6e6',
                  padding: '12px 16px 12px 38px',
                  fontSize: 16,
                  minWidth: 120,
                  background: '#fafbfc',
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <FaUser style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
              <input
                type="text"
                placeholder="Prénom"
                value={searchPrenom}
                onChange={e => setSearchPrenom(e.target.value)}
                style={{
                  borderRadius: 8,
                  border: '1.5px solid #e6e6e6',
                  padding: '12px 16px 12px 38px',
                  fontSize: 16,
                  minWidth: 120,
                  background: '#fafbfc',
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <FaCalendarAlt style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
              <select value={filterAnnee} onChange={e => setFilterAnnee(e.target.value)} style={{ borderRadius: 8, border: '1.5px solid #e6e6e6', padding: '12px 16px 12px 38px', fontSize: 16, background: '#fafbfc', minWidth: 120 }}>
                <option value="">Année</option>
                <option value="2019-2020">2019-2020</option>
                <option value="2020-2021">2020-2021</option>
                <option value="2021-2022">2021-2022</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <FaLayerGroup style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
              <select value={filterPromotion} onChange={e => setFilterPromotion(e.target.value)} style={{ borderRadius: 8, border: '1.5px solid #e6e6e6', padding: '12px 16px 12px 38px', fontSize: 16, background: '#fafbfc', minWidth: 120 }}>
                <option value="">Promotion</option>
                <option value="Bachelor 1">Bachelor 1</option>
                <option value="Bachelor 2">Bachelor 2</option>
                <option value="Bachelor 3">Bachelor 3</option>
                <option value="Mastère 1">Mastère 1</option>
                <option value="Mastère 2">Mastère 2</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <FaCogs style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
              <select value={filterSpecialite} onChange={e => setFilterSpecialite(e.target.value)} style={{ borderRadius: 8, border: '1.5px solid #e6e6e6', padding: '12px 16px 12px 38px', fontSize: 16, background: '#fafbfc', minWidth: 120 }}>
                <option value="">Spécialité</option>
                <option value="Informatique">Informatique</option>
                <option value="Cybersécurité">Cybersécurité</option>
                <option value="Data & IA">Data & IA</option>
                <option value="Développement">Développement</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <FaFileAlt style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ borderRadius: 8, border: '1.5px solid #e6e6e6', padding: '12px 16px 12px 38px', fontSize: 16, background: '#fafbfc', minWidth: 120 }}>
                <option value="">Type de document</option>
                <option value="Certificat">Certificat</option>
                <option value="Bulletin">Bulletin</option>
                <option value="Attestation">Attestation</option>
                <option value="Convention">Convention</option>
                <option value="Relevé de notes">Relevé de notes</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <FaCogs style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
              <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={{ borderRadius: 8, border: '1.5px solid #e6e6e6', padding: '12px 16px 12px 38px', fontSize: 16, background: '#fafbfc', minWidth: 120 }}>
                <option value="">Statut</option>
                <option value="Validé">Validé</option>
                <option value="En cours">En cours</option>
                <option value="Rejeté">Rejeté</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <thead>
            <tr>
              <th style={{ padding: 12 }}>Nom</th>
              <th style={{ padding: 12 }}>Prénom</th>
              <th style={{ padding: 12 }}>Année</th>
              <th style={{ padding: 12 }}>Promotion</th>
              <th style={{ padding: 12 }}>Spécialité</th>
              <th style={{ padding: 12 }}>Statut</th>
              <th style={{ padding: 12 }}>Type</th>
              <th style={{ padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc, idx) => {
                const { nom, prenom } = getNomPrenom(doc.student);
                return (
                  <tr key={doc._id}>
                    <td style={{ padding: 12 }}>{nom}</td>
                    <td style={{ padding: 12 }}>{prenom}</td>
                    <td style={{ padding: 12 }}>{doc.year}</td>
                    <td style={{ padding: 12 }}>{doc.promotion || '-'}</td>
                    <td style={{ padding: 12 }}>{doc.specialite || '-'}</td>
                    <td style={{ padding: 12 }}>
                      <span className={`status-label ${doc.statusType}`}>{doc.status}</span>
                    </td>
                    <td style={{ padding: 12 }}>{doc.docType}</td>
                    <td style={{ padding: 12, position: 'relative' }}>
                      <button
                        ref={buttonRefs.current[idx]}
                        onClick={() => setEditedValues(v => ({ ...v, menuOpen: v.menuOpen === doc._id ? null : doc._id }))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 24 }}
                        title="Actions"
                      >
                        ⋯
                      </button>
                      {editedValues.menuOpen === doc._id && (() => {
                        const rect = buttonRefs.current[idx]?.current?.getBoundingClientRect();
                        const left = rect ? rect.left - 120 : 0;
                        const top = rect ? rect.bottom + 8 : 0;
                        return ReactDOM.createPortal(
                          <div
                            style={{
                              position: 'fixed',
                              left,
                              top,
                              zIndex: 99999,
                              background: '#fff',
                              borderRadius: 12,
                              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                              minWidth: 180,
                              padding: '8px 0',
                              display: 'flex',
                              flexDirection: 'column',
                              border: '1.5px solid #e6e6e6'
                            }}
                          >
                            <button
                              onClick={() => { alert('Détails de ' + doc.name); setEditedValues(v => ({ ...v, menuOpen: null })); }}
                              style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 20px', fontSize: 16, color: '#222', cursor: 'pointer', width: '100%' }}
                            >
                              Détails
                            </button>
                            <button
                              onClick={() => { handleDelete(doc); setEditedValues(v => ({ ...v, menuOpen: null })); }}
                              style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 20px', fontSize: 16, color: '#e53935', cursor: 'pointer', width: '100%' }}
                            >
                              Supprimer
                            </button>
                          </div>,
                          document.body
                        );
                      })()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} style={{ padding: 32, color: '#888', textAlign: 'center' }}>
                  Aucun document trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
    </DashboardLayout>
  );
};

export default DocumentsDispo;
