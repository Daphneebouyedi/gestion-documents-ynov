import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";

const Sidebar = ({ showUserMenu, setShowUserMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDemanderPanel, setShowDemanderPanel] = React.useState(false);

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

  const user = useQuery(api.auth.getUser, userIdFromToken ? { userId: userIdFromToken } : "skip");

  const navItemStyle = {
    borderRadius: 8,
    padding: '12px 16px',
    color: '#222',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 500,
    transition: 'background 0.2s, color 0.2s',
    cursor: 'pointer',
    wordBreak: 'break-word',
  };

  const getNavItemStyle = (path) => {
    const isActive = location.pathname.startsWith(path);
    return {
      ...navItemStyle,
      background: isActive ? '#23c2a2' : 'transparent',
      color: isActive ? '#fff' : '#222',
    };
  };
  
  const getExactNavItemStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      ...navItemStyle,
      background: isActive ? '#23c2a2' : 'transparent',
      color: isActive ? '#fff' : '#222',
    };
  };

  return (
    <div className="sidebar-column" style={{ width: 320, background: '#fff', display: 'flex', flexDirection: 'column', minHeight: '100vh', borderRight: '1px solid #e6e6e6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px', boxSizing: 'border-box' }}>
      <div className="sidebar-main" style={{ display: 'flex', flexDirection: 'column', borderRadius: 8, background: '#fff', padding: '0 20px 24px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '2px solid #E6E6E6', boxSizing: 'border-box' }}>
        <div className="logo" style={{ margin: 0, textAlign: 'center', marginTop: 24 }}>
          <img 
            src="/Ynov.png"
            alt="MAROC Ynov Campus"
            className="logo-image"
            style={{ width: 120, height: 'auto', display: 'inline-block' }}
          />
        </div>
        <nav className="navigation" style={{ margin: 0 }}>
          <ul className="nav-list" style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li className={`nav-item${location.pathname.startsWith('/demandes') ? ' active' : ''}`} onClick={() => navigate('/demandes')}
              style={getNavItemStyle('/demandes')}>
              Demandes
            </li>
            <li className={`nav-item${location.pathname.startsWith('/alerts') ? ' active' : ''}`} onClick={() => navigate('/alerts')}
              style={getNavItemStyle('/alerts')}>
              Notifications
            </li>
            <li className={`nav-item${location.pathname.startsWith('/documents') ? ' active' : ''}`}
              onClick={() => navigate('/documents-dispo')}
              style={{...getNavItemStyle('/documents'), position: 'relative'}}>
              Documents disponibles
            </li>
            <li className={`nav-item${location.pathname.startsWith('/Demander') ? ' active' : ''}`}
              onClick={() => setShowDemanderPanel(!showDemanderPanel)}
              style={{...getNavItemStyle('/Demander'), position: 'relative'}}>
              Demander un document
            </li>
            <li className={`nav-item${location.pathname === '/terms' ? ' active' : ''}`} onClick={() => navigate('/terms')}
              style={getExactNavItemStyle('/terms')}>
              Conditions générales
            </li>
          </ul>
        </nav>
      </div>

      {/* Panneau latéral à droite pour Demander un document */}
      {showDemanderPanel && (
        <>
          {/* Overlay flouté */}
          <div onClick={() => setShowDemanderPanel(false)} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(30, 41, 59, 0.18)',
            backdropFilter: 'blur(2.5px)',
            zIndex: 999,
            transition: 'background 0.3s',
          }} />
          <div style={{
            position: 'fixed',
            top: 0,
            left: 320,
            height: '100vh',
            width: 300,
            background: '#fff',
            boxShadow: '4px 0 24px 0 rgba(30,41,59,0.13)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 48,
            borderLeft: 'none',
            borderTopRightRadius: 18,
            borderBottomRightRadius: 18,
            animation: 'slideInPanel .32s cubic-bezier(.4,0,.2,1)',
            overflow: 'hidden',
          }}>
            <style>{`
              @keyframes slideInPanel {
                from { transform: translateX(60px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
            `}</style>
            <button onClick={() => setShowDemanderPanel(false)} style={{
              position: 'absolute',
              top: 16,
              right: 18,
              background: 'none',
              border: 'none',
              fontSize: 22,
              color: '#888',
              cursor: 'pointer',
              borderRadius: '50%',
              width: 36,
              height: 36,
              transition: 'background 0.2s',
            }} title="Fermer le menu">×</button>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, marginLeft: 32, marginTop: 8, color: '#222' }}>Demander un document</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className={`nav-item${location.pathname === '/Demander/convention-stage' ? ' active' : ''}`} onClick={() => { setShowDemanderPanel(false); navigate('/Demander/convention-stage'); }}
                style={{ borderRadius: 8, padding: '12px 18px', margin: '0 24px 8px 24px', color: '#222', fontFamily: 'Arial, sans-serif', fontWeight: 500, background: location.pathname === '/Demander/convention-stage' ? '#23c2a2' : 'transparent', color: location.pathname === '/Demander/convention-stage' ? '#fff' : '#222', transition: 'background 0.2s, color 0.2s', cursor: 'pointer', fontSize: 16 }}>
                Convention de stage
              </li>
              <li className={`nav-item${location.pathname === '/Demander/convention-etude' ? ' active' : ''}`} onClick={() => { setShowDemanderPanel(false); navigate('/Demander/convention-etude'); }}
                style={{ borderRadius: 8, padding: '12px 18px', margin: '0 24px 8px 24px', color: '#222', fontFamily: 'Arial, sans-serif', fontWeight: 500, background: location.pathname === '/Demander/convention-etude' ? '#23c2a2' : 'transparent', color: location.pathname === '/Demander/convention-etude' ? '#fff' : '#222', transition: 'background 0.2s, color 0.2s', cursor: 'pointer', fontSize: 16 }}>
                Convention d'étude
              </li>
              <li className={`nav-item${location.pathname === '/Demander/attestation' ? ' active' : ''}`} onClick={() => { setShowDemanderPanel(false); navigate('/Demander/attestation'); }}
                style={{ borderRadius: 8, padding: '12px 18px', margin: '0 24px 8px 24px', color: '#222', fontFamily: 'Arial, sans-serif', fontWeight: 500, background: location.pathname === '/Demander/attestation' ? '#23c2a2' : 'transparent', color: location.pathname === '/Demander/attestation' ? '#fff' : '#222', transition: 'background 0.2s, color 0.2s', cursor: 'pointer', fontSize: 16 }}>
                Attestation frais de scolarité
              </li>
              <li className={`nav-item${location.pathname === '/Demander/attestation-inscription' ? ' active' : ''}`} onClick={() => { setShowDemanderPanel(false); navigate('/Demander/attestation-inscription'); }}
                style={{ borderRadius: 8, padding: '12px 18px', margin: '0 24px 8px 24px', color: '#222', fontFamily: 'Arial, sans-serif', fontWeight: 500, background: location.pathname === '/Demander/attestation-inscription' ? '#23c2a2' : 'transparent', color: location.pathname === '/Demander/attestation-inscription' ? '#fff' : '#222', transition: 'background 0.2s, color 0.2s', cursor: 'pointer', fontSize: 16 }}>
                Attestation d’inscription
              </li>
              <li className={`nav-item${location.pathname === '/Demander/attestation-reussite' ? ' active' : ''}`} onClick={() => { setShowDemanderPanel(false); navigate('/Demander/attestation-reussite'); }}
                style={{ borderRadius: 8, padding: '12px 18px', margin: '0 24px 8px 24px', color: '#222', fontFamily: 'Arial, sans-serif', fontWeight: 500, background: location.pathname === '/Demander/attestation-reussite' ? '#23c2a2' : 'transparent', color: location.pathname === '/Demander/attestation-reussite' ? '#fff' : '#222', transition: 'background 0.2s, color 0.2s', cursor: 'pointer', fontSize: 16 }}>
                Attestation de réussite
              </li>
              <li className={`nav-item${location.pathname === '/Demander/bulletin' ? ' active' : ''}`} onClick={() => { setShowDemanderPanel(false); navigate('/Demander/bulletin'); }}
                style={{ borderRadius: 8, padding: '12px 18px', margin: '0 24px 8px 24px', color: '#222', fontFamily: 'Arial, sans-serif', fontWeight: 500, background: location.pathname === '/Demander/bulletin' ? '#23c2a2' : 'transparent', color: location.pathname === '/Demander/bulletin' ? '#fff' : '#222', transition: 'background 0.2s, color 0.2s', cursor: 'pointer', fontSize: 16 }}>
                Bulletin
              </li>
            </ul>
          </div>
        </>
      )}

      <div style={{ marginTop: 'auto' }}>
        {/* Icône la-personne en bas à gauche, qui ouvre le menu utilisateur */}
        {/* User card en bas à gauche (toujours visible) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #e6e6e6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderRadius: 8, padding: '8px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 6, background: 'linear-gradient(90deg, #f8fafc 60%, #e6f7f1 100%)', borderRadius: 8, minWidth: 210 }}>
            <div style={{ position: 'relative', cursor: 'pointer', minWidth: 52, minHeight: 52 }} onClick={() => setShowUserMenu(showUserMenu === 'bottom' ? false : 'bottom')}>
              <img src="/la-personne.png" alt="Avatar utilisateur" style={{ width: 48, height: 48, borderRadius: '50%', background: '#e0e0e0', border: '2.5px solid #23c2a2' }} />
              <span style={{ position: 'absolute', bottom: 6, right: 6, width: 14, height: 14, borderRadius: '50%', background: '#23c16b', border: '2.5px solid #fff', boxShadow: '0 0 0 2px #23c2a2' }}></span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#222', letterSpacing: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
              </span>
              <span style={{ color: '#23c2a2', fontSize: 14, fontWeight: 500, letterSpacing: 0.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                {user ? user.email : 'contact@etando.ma'}
              </span>
              <span style={{ marginTop: 4, background: '#e6f7f1', color: '#23c2a2', fontWeight: 600, borderRadius: 8, padding: '2.5px 12px', fontSize: 13, letterSpacing: 0.2, border: '1.5px solid #23c2a2' }}>
                {user ? (user.role === 'student' ? 'Étudiant' : user.role === 'parent' ? 'Parent' : 'Administrateur') : 'Administrateur'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
