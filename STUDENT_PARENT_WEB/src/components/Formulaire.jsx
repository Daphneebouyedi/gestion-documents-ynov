import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Formulaire.css';
import Ynov from "../img/Ynov.png";

const passwordChecks = [
  { label: "8 caractères minimum", test: password => password.length >= 8, key: "length" },
  { label: "Majuscule", test: password => /[A-Z]/.test(password), key: "uppercase" },
  { label: "Minuscule", test: password => /[a-z]/.test(password), key: "lowercase" },
  { label: "Chiffre", test: password => /\d/.test(password), key: "digit" },
  { label: "Symbole", test: password => /[^A-Za-z0-9]/.test(password), key: "symbol" }
];

const Formulaire = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const passwordValidCriteria = passwordChecks.map(rule => rule.test(formData.password));
  const passwordValidCount = passwordValidCriteria.filter(Boolean).length;
  const passwordValid = passwordValidCount >= 5;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordValid) {
      alert('Le mot de passe ne respecte pas les règles de sécurité.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    console.log('Form submitted:', formData);
    navigate('/login');
  };

  const handleConnectClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="create-account-container">
      {/* Sidebar */}
                  <div className="sidebar">
                    <div className="logo-section-dashboard">
                      <img src={Ynov} alt="Ynov Campus" className="logo-image" />
                    </div>
        <button className="connect-button" onClick={handleConnectClick}>
          Se connecter
        </button>
      </div>

      <div className="right-column">
        <div className="form-container">
          <h1 className="form-title">Formulaire de création de compte</h1>
          <p className="form-subtitle">
            La saisie des informations relatives à votre compte sera effectuée à l'étape suivante.
          </p>

          <form className="account-form" onSubmit={handleSubmit}>
            {/* Prénom + Nom */}
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="firstName">Prénom :</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Tapez votre prénom"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group half">
                <label htmlFor="lastName">Nom :</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Tapez votre nom"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Email + Rôle */}
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="email">E-mail :</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Tapez votre mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group half">
                <label htmlFor="role">Rôle :</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Choisir un rôle --</option>
                  <option value="eleve">Élève</option>
                  <option value="administrateur">Administrateur</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
            </div>

            {/* Téléphone */}
            <div className="form-group">
              <label htmlFor="phone">Numéro de téléphone :</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Tapez votre numéro de téléphone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Mot de passe + Confirmation */}
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="password">Nouveau mot de passe :</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Tapez votre mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group half">
                <label htmlFor="confirmPassword">Répétez le mot de passe :</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Tapez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Paragraphe dynamique */}
            <p className="password-info password-info-below">
              Votre mot de passe doit comprendre au moins les critères suivants : <br />
              <span className={passwordValidCriteria[1] ? "valid" : ""}>majuscule</span>,{" "}
              <span className={passwordValidCriteria[2] ? "valid" : ""}>minuscule</span>,{" "}
              <span className={passwordValidCriteria[3] ? "valid" : ""}>chiffre</span>,{" "}
              <span className={passwordValidCriteria[4] ? "valid" : ""}>symbole</span>,{" "}
              <span className={passwordValidCriteria[0] ? "valid" : ""}>8 caractères</span>.
            </p>

            <button type="submit" className="validate-button">
              Valider
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Formulaire;
