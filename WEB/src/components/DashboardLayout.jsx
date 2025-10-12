import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActionLogger, ACTION_TYPES } from '../hooks/useActionLogger';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, pageTitle, pageDescription }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const logAction = useActionLogger();
  
  const handleLogout = async () => {
    try {
      await logAction(
        ACTION_TYPES.LOGOUT,
        "Déconnexion",
        { timestamp: new Date().toISOString() }
      );
    } catch (error) {
      console.error("Failed to log logout:", error);
    }
    
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate('/login');
  };

  return (
    <div className="dashboard" style={{ display: 'flex', minHeight: '100vh', background: '#F6F8FA' }}>
      <Sidebar showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} />
      <div className="main-content" style={{ background: '#F6F8FA', padding: 0, marginLeft: 32, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '24px 32px 24px 24px', marginBottom: 32, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 6, height: 56, background: '#23c2a2', borderRadius: 3, marginRight: 18 }}></div>
            <div>
              <h1 style={{ fontWeight: 700, fontSize: 32, margin: 0, fontFamily: 'Arial, sans-serif', color: '#222' }}>{pageTitle}</h1>
              <p style={{ color: '#888', fontFamily: 'Arial, sans-serif', fontSize: 16, margin: 0, marginTop: 4 }}>{pageDescription}</p>
            </div>
          </div>
          <div onClick={() => setShowUserMenu(showUserMenu === 'top' ? false : 'top')} style={{ position: 'relative', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <img src="/la-personne.png" alt="Avatar utilisateur" style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0e0e0' }} />
            <span style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderRadius: '50%', background: '#23c16b', border: '2px solid #fff' }}></span>
          </div>
        </div>
        {children}
      </div>
      {/* Menu utilisateur flottant */}
      {showUserMenu === 'top' && (
        <>
          <div onClick={() => setShowUserMenu(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }} />
          <div className="user-menu" style={{ top: 80, right: 32 }}>
            <div className="user-menu-item" onClick={() => { setShowUserMenu(false); navigate('/profil'); }}>
              <img src="/la-personne.png" alt="Mon Profil" />
              <span>Mon Profil</span>
            </div>
            <div className="user-menu-separator"></div>
            <div className="user-menu-item" style={{ color: '#e53935' }} onClick={handleLogout}>
              <img src="/bouton-dalimentation.png" alt="Déconnexion" />
              <span>Se déconnecter</span>
            </div>
          </div>
        </>
      )}
      {showUserMenu === 'bottom' && (
        <>
          <div onClick={() => setShowUserMenu(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }} />
          <div className="user-menu" style={{ left: 250, bottom: 32 }}>
            <div className="user-menu-item" onClick={() => { setShowUserMenu(false); navigate('/profil'); }}>
              <img src="/la-personne.png" alt="Mon Profil" />
              <span>Mon Profil</span>
            </div>
            <div className="user-menu-separator"></div>
            <div className="user-menu-item" style={{ color: '#e53935' }} onClick={handleLogout}>
              <img src="/bouton-dalimentation.png" alt="Déconnexion" />
              <span>Se déconnecter</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;