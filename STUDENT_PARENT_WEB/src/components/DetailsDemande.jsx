import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';
import { jsPDF } from 'jspdf';

const DetailsDemande = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);

  const isConvention = id.startsWith('conv-');
  const isAttestation = id.startsWith('att-');
  const realId = id.replace('conv-', '').replace('att-', '');

  const convention = useQuery(api.conventions.getInternshipConventionById, isConvention ? { id: realId } : "skip");
  const attestation = useQuery(api.attestations.getAttestationById, isAttestation ? { id: realId } : "skip");

  const data = isConvention ? convention : attestation;
  const type = isConvention ? 'Convention de stage' : 'Attestation de frais de scolarité';
  const status = data ? (data.status === 'Generated' ? 'envoyé' : data.status || 'envoyé') : '';
  const dateEdition = data ? new Date(data.createdAt).toLocaleString('fr-FR') : '';

  useEffect(() => {
    if (data) {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(type, 105, 30, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Date d'édition: ${dateEdition}`, 10, 50);
      doc.text(`Statut: ${status}`, 10, 60);
      if (isConvention) {
        doc.text(`Stagiaire: ${data.stagiaireNom} ${data.stagiairePrenom}`, 10, 70);
        doc.text(`Entreprise: ${data.entrepriseNom}`, 10, 80);
        // Add more fields as needed
      } else {
        doc.text(`Nom: ${data.nom} ${data.prenom}`, 10, 70);
        doc.text(`Promotion: ${data.promotion}`, 10, 80);
      }
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    }
  }, [data, type, dateEdition, status, isConvention]);

  if (isConvention && !convention) return <div>Loading...</div>;
  if (isAttestation && !attestation) return <div>Loading...</div>;

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

  const handleBack = () => navigate('/demandes');

  return (
    <DashboardLayout pageTitle="Détails de la demande" pageDescription="Informations détaillées sur la demande">
      <div className="details-container">
        <button onClick={handleBack} className="back-button" style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#23c2a2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Retour</button>
        <div className="user-profile-card">
          <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div className="detail-section">
              <h3 className="section-title">Informations de la demande</h3>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">Type</span>
                  <span className="detail-value">{type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Statut</span>
                  <span className="detail-value"><span style={getStatusStyle(status)}>{status}</span></span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date d'édition</span>
                  <span className="detail-value">{dateEdition}</span>
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h3 className="section-title">Aperçu du document PDF</h3>
              {pdfUrl && <iframe src={pdfUrl} width="100%" height="600px" style={{ border: 'none' }} title="PDF Preview"></iframe>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DetailsDemande;
