import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar-column">
      <div className="sidebar-main">
        <aside className="sidebar">
          <div className="logo">
            <img 
              src="/Ynov.png"
              alt="MAROC Ynov Campus"
              className="logo-image"
            />
          </div>
          <nav className="navigation">
            <ul className="nav-list">
              <li className="nav-item active">Accueil</li>
              <li className="nav-item">Demandes</li>
              <li className="nav-item">Documents</li>
              <li className="nav-item">Générer un document</li>
              <li className="nav-item">Conditions générales</li>
              <li className="nav-item">Profil</li>
            </ul>
          </nav>
        </aside>
      </div>
      <div className="user-card">
        <div className="user-avatar-container">
          <img
            src="/la-personne.png"
            alt="Avatar utilisateur"
            className="user-avatar"
          />
          <span className="user-status-dot"></span>
        </div>
        <div className="user-details">
          <div className="user-role">Administrateur</div>
          <div className="user-email">daphnee.bouyedi641@gmail.com</div>
        </div>
        <button className="user-settings-icon" title="Paramètres">
          <img src="/reglages.png" alt="Paramètres" style={{ width: 24, height: 24 }} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
