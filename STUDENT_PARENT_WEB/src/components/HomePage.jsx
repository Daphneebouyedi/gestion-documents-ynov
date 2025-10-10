import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <div className="homepage-content-flex">
        <div className="homepage-left">
          <img src="/Etudiants1.png" alt="Illustration étudiants" className="homepage-side-img" />
        </div>
        <div className="homepage-right">
          <h1 className="homepage-title-ynov" style={{whiteSpace: 'pre-line'}}>
            <span style={{ color: '#4ECDC4', fontWeight: 900 }}>
              Bienvenue  </span> dans la plateforme de
           
            <br />
            <span className="black">
               gestion des  </span>
                <span style={{ color: '#4ECDC4', fontWeight: 900 }}> frais de scolarité 
                      <span className="black"> et </span>
                       documents
            </span>
          </h1>
          <div className="homepage-rubriques-row homepage-rubriques-row-centered">
            <div className="homepage-bigcard" onClick={() => navigate('/frais-scolarite')}>
              <img src="/frais-de-scolarite.png" alt="Frais Scolarité" className="homepage-bigicon" />
              <div className="homepage-bigtitle">Frais Scolarité</div>
            </div>
            <div className="homepage-bigcard" onClick={() => navigate('/login')}>
              <img src="/fichier-de-documents.png" alt="Gestion des documents administratifs" className="homepage-bigicon" />
              <div className="homepage-bigtitle">Gestion des documents administratifs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
