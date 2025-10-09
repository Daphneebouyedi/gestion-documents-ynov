import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Password.css';
import Ynov from '../img/Ynov.png';

const Password = () => {
  const [email, setEmail] = useState('');
  const [isRobotChecked, setIsRobotChecked] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRobotCheck = (e) => {
    setIsRobotChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isRobotChecked) {
      alert('Veuillez confirmer que vous n\'êtes pas un robot');
      return;
    }
    console.log('Password reset requested for:', email);
    // Logique de réinitialisation du mot de passe
  };

  const handleConnexionClick = () => {
    navigate('/login');
  };

  return (
    <div className="password-reset-container">
      {/* Sidebar */}
            <div className="sidebar">
              <div className="logo-section-dashboard">
                <img src={Ynov} alt="Ynov Campus" className="logo-image" />
              </div>

        <div className="tip-section tip-align">
          <h2 className="tip-title">Astuce</h2>
          <p className="tip-text">
            En utilisant ce formulaire, vous réinitialisez le mot de passe de votre 
            Compte Ynov Campus mais également les mots de passe de vos 
            boîtes e-mail Ynov.
          </p>
        </div>

        <button className="connexion-button" onClick={handleConnexionClick}>
          Connexion
        </button>
      </div>

      {/* Right Panel - Form Section */}
      <div className="right-panel-reset">
        <div className="reset-form-container">
          <h1 className="reset-title">Réinitialisation du mot de passe</h1>
          <p className="reset-subtitle">
            Après avoir complété ce formulaire, vous recevrez un lien par e-mail vous 
            permettant de choisir votre nouveau mot de passe.
          </p>

          <form className="reset-form" onSubmit={handleSubmit}>
            <div className="form-group-reset">
              <label htmlFor="email" className="form-label-reset">E-mail :</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Tapez votre mail"
                value={email}
                onChange={handleEmailChange}
                className="form-input-reset"
                required
              />
            </div>

            <div className="recaptcha-section">
              <div className="recaptcha-container">
              <input
                type="checkbox"
                id="recaptcha"
                checked={isRobotChecked}
                onChange={handleRobotCheck}
                className="recaptcha-checkbox"
              />
              <span className="recaptcha-label">
                Je ne suis pas un robot
              </span>
            </div>
            </div>

            <button type="submit" className="validate-button-reset">
              Valider
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Password;
