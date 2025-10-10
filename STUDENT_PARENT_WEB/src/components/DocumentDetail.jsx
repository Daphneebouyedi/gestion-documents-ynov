import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import './DocumentDetail.css'; // Import the CSS file

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const document = useQuery(api.documents.getDocumentById, { id });

  const handleDownload = () => {
    if (document && document.url) {
      const a = document.createElement("a");
      a.href = document.url;
      a.download = document.name + "." + document.extension.toLowerCase();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert(`⚠️ Aucun fichier disponible pour le téléchargement.`);
    }
  };

  if (document === undefined) {
    return (
      <div className="document-detail-container">
        <div className="document-detail-loading-container">
          <div className="document-detail-spinner"></div>
          <p>Chargement du document...</p>
        </div>
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="document-detail-container">
        <div className="document-detail-error-container">
          <p>Document non trouvé.</p>
          <button onClick={() => navigate(-1)} className="document-detail-back-button">Retour</button>
        </div>
      </div>
    );
  }

  return (
    <div className="document-detail-container">
      <div className="document-detail-header">
        <button onClick={() => navigate(-1)} className="document-detail-back-button">Retour</button>
        <h1 className="document-detail-title">Détails du document: {document.name}</h1>
        {document.url && (
          <button onClick={handleDownload} className="document-detail-back-button" style={{ marginLeft: 'auto' }}>
            Télécharger
          </button>
        )}
      </div>

      <div className="document-detail-content-wrapper">
        <div className="document-detail-metadata-card">
          <h2 className="document-detail-metadata-title">Informations sur le document</h2>
          <p className="document-detail-metadata-item"><strong>ID:</strong> {document._id}</p>
          <p className="document-detail-metadata-item"><strong>Étudiant:</strong> {document.student}</p>
          <p className="document-detail-metadata-item"><strong>Année:</strong> {document.year}</p>
          <p className="document-detail-metadata-item"><strong>Type:</strong> {document.docType}</p>
          <p className="document-detail-metadata-item"><strong>Statut:</strong> <span className="document-detail-status-label" style={{ backgroundColor: document.statusType === 'success' ? '#4CAF50' : document.statusType === 'pending' ? '#FFC107' : '#F44336' }}>{document.status}</span></p>
          <p className="document-detail-metadata-item"><strong>Condition:</strong> {document.condition}</p>
          <p className="document-detail-metadata-item"><strong>Extension:</strong> {document.extension}</p>
          <p className="document-detail-metadata-item"><strong>Date:</strong> {document.date}</p>
          {document.reason && <p className="document-detail-metadata-item"><strong>Raison:</strong> {document.reason}</p>}
        </div>

        {document.url && (
          <div className="document-detail-viewer-card">
            <h2 className="document-detail-metadata-title">Visualisation du document</h2>
            <div className="document-detail-viewer">
              {document.extension.toLowerCase() === 'pdf' ? (
                <iframe src={document.url} className="document-detail-iframe-viewer" title="Document Viewer"></iframe>
              ) : (
                <img src={document.url} alt="Document" className="document-detail-image-viewer" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentDetail;
