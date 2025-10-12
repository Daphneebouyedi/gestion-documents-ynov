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
                <span style={{ color: '#4ECDC4', fontWeight: 900 }}> documents
                      <span className="black"> pour </span>
                       parents et étudiants
            </span>
          </h1>
          <div className="homepage-rubriques-row homepage-rubriques-row-centered">
            <div className="homepage-bigcard" onClick={() => navigate('/login/parents')}>
              <img src="/parents.png" alt="Parents" className="homepage-bigicon" />
              <div className="homepage-bigtitle">Parents</div>
            </div>
            <div className="homepage-bigcard" onClick={() => navigate('/login/students')}>
              <img src="/graduated.png" alt="Etudiants" className="homepage-bigicon" />
              <div className="homepage-bigtitle">Etudiants</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
