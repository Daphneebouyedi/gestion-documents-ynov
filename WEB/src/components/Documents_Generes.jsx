import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaIdBadge, FaCalendarAlt, FaLayerGroup, FaCogs, FaFileAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';
import ReactDOM from 'react-dom';
import DashboardLayout from './DashboardLayout';

const DocumentsGeneres = () => {
  const [documents, setDocuments] = useState([]);
  const [editedValues, setEditedValues] = useState({});
  const [searchNom, setSearchNom] = useState('');
  const [searchPrenom, setSearchPrenom] = useState('');
  const [filterAnnee, setFilterAnnee] = useState('');
  const [filterPromotion, setFilterPromotion] = useState('');
  const [filterSpecialite, setFilterSpecialite] = useState('');
  const [filterDateEdition, setFilterDateEdition] = useState('');
  const [filterType, setFilterType] = useState('');
  const buttonRefs = useRef([]);

  function getNomPrenom(student) {
    const parts = student.split(' ');
    return { nom: parts[parts.length - 1], prenom: parts.slice(0, -1).join(' ') };
  }

  const filteredDocuments = documents.filter(doc => {
    const { nom, prenom } = getNomPrenom(doc.student);
    const matchesNom = searchNom ? nom.toLowerCase().includes(searchNom.toLowerCase()) : true;
    const matchesPrenom = searchPrenom ? prenom.toLowerCase().includes(searchPrenom.toLowerCase()) : true;
    const matchesAnnee = filterAnnee ? doc.year === filterAnnee : true;
    const matchesPromotion = filterPromotion ? doc.promotion === filterPromotion : true;
    const matchesSpecialite = filterSpecialite ? doc.specialite === filterSpecialite : true;
  const matchesDateEdition = filterDateEdition ? (doc.dateEdition && doc.dateEdition.includes(filterDateEdition)) : true;
    const matchesType = filterType ? doc.docType === filterType : true;
  return matchesNom && matchesPrenom && matchesAnnee && matchesPromotion && matchesSpecialite && matchesDateEdition && matchesType;
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
    <DashboardLayout pageTitle="Documents générés" pageDescription="Consultez et gérez les documents générés">
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
              <FaCalendarAlt style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
              <input
                type="text"
                placeholder="Date d'édition"
                value={filterDateEdition}
                onChange={e => setFilterDateEdition(e.target.value)}
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
              <th style={{ padding: 12 }}>Date d'édition</th>
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
                    <td style={{ padding: 10 }}>{nom}</td>
                    <td style={{ padding: 10 }}>{prenom}</td>
                    <td style={{ padding: 10 }}>{doc.year}</td>
                    <td style={{ padding: 10 }}>{doc.promotion}</td>
                    <td style={{ padding: 10 }}>{doc.specialite}</td>
                    <td style={{ padding: 10 }}>{doc.dateEdition}</td>
                    <td style={{ padding: 10 }}>{doc.docType}</td>
                    <td style={{ padding: 10 }}>
                      {/* Actions CRUD à adapter selon vos besoins */}
                      <button onClick={() => handleDelete(doc)} style={{ color: '#fff', background: '#e74c3c', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Supprimer</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: '#888', padding: 24 }}>Aucun document généré trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
    </DashboardLayout>
  );
};
 
export default DocumentsGeneres;  
