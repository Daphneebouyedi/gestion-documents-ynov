import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useActionLogger, ACTION_TYPES } from '../hooks/useActionLogger';
import Ynov from '../img/Ynov.png';
import './Login.css';
import ReCAPTCHA from 'react-google-recaptcha';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // Removed isSigningUp state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('credentials');
  const [challenge, setChallenge] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [showPwHelp, setShowPwHelp] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  // Initialize action logger
  const logAction = useActionLogger();

  // Initialize Convex login mutation only
  const startLoginWithOtp = useAction(api.authActions.startLoginWithOtp);
  const completeLoginWithOtp = useAction(api.authActions.completeLoginWithOtp);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 'credentials') return;
    setLoading(true);
    setError(null);

    if (!recaptchaValue) {
      setError("Veuillez cocher la case reCAPTCHA.");
      setLoading(false);
      return;
    }

    // Vérification sécurité du mot de passe
    const pw = formData.password || "";
    const hasMin = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasDigit = /\d/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);
    if (!(hasMin && hasUpper && hasLower && hasDigit && hasSymbol)) {
      setError("Le mot de passe doit contenir au minimum 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.");
      setLoading(false);
      return;
    }

    try {
      const res = await startLoginWithOtp(formData);
      setChallenge(res.challenge);
      setStep('otp');
    } catch (err) {
      console.error('OTP init failed:', err);
      setError(err.message || "Échec de l'initialisation OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (step !== 'otp') return;
    setLoading(true);
    setError(null);
    if (!challenge || !otpCode || otpCode.length !== 6) {
      setError("Code OTP invalide");
      setLoading(false);
      return;
    }
    try {
      const { token, userId, user } = await completeLoginWithOtp({ challenge, code: otpCode });
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", formData.email);
      if (user) {
        localStorage.setItem("userName", `${user.firstName || ''} ${user.lastName || ''}`.trim());
      }
      
      // Log the login action
      setTimeout(async () => {
        try {
          await logAction(
            ACTION_TYPES.LOGIN,
            "Connexion réussie",
            { 
              email: formData.email,
              timestamp: new Date().toISOString(),
              method: "OTP"
            }
          );
        } catch (logError) {
          console.error("Failed to log login action:", logError);
        }
      }, 500);
      
      navigate('/dashboard');
    } catch (err) {
      console.error('OTP verification failed:', err);
      setError(err.message || "Échec de la vérification OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Left Section - Headline */}
        <div className="left-section">
          <img src={Ynov} alt="Ynov Campus" className="logo-image-login" />
        </div>
        
        {/* Right Section - Form */}
        <div className="right-section">
          <div className="login-form-container">
            <h2 className="login-title">Connexion Administrateur</h2> {/* Updated title */}
            <form className="login-form" onSubmit={step === 'credentials' ? handleSubmit : handleOtpSubmit}>
              {step === 'credentials' && (
              <div className="form-group">
                <div className="input-with-icon">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Adresse e-mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              )}

              <div className="form-group">
                <div className="input-with-icon" style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={(e) => { setPwTouched(true); handleInputChange(e); }}
                    onFocus={() => { setShowPwHelp(true); }}
                    onBlur={() => { setShowPwHelp(false); }}
                    className="form-input"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    style={{ background: "transparent", border: "none", position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a20.29 20.29 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.29 20.29 0 0 1-2.06 3.34" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Aide mot de passe"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPwHelp((v) => !v)}
                    style={{ background: "transparent", border: "none", position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                    title="Règles de sécurité"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M12 8h.01"/>
                    </svg>
                  </button>

                  {showPwHelp && (
                    <div style={{ position: 'absolute', zIndex: 10, top: '110%', right: 0, background: '#fff', border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: 6, padding: '10px 12px', width: 260 }}>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>Règles du mot de passe</div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        <li style={{ color: (formData.password || "").length >= 8 ? '#2e7d32' : '#d32f2f' }}>8 caractères minimum</li>
                        <li style={{ color: /[A-Z]/.test(formData.password || "") ? '#2e7d32' : '#d32f2f' }}>Majuscule</li>
                        <li style={{ color: /[a-z]/.test(formData.password || "") ? '#2e7d32' : '#d32f2f' }}>Minuscule</li>
                        <li style={{ color: /\d/.test(formData.password || "") ? '#2e7d32' : '#d32f2f' }}>Chiffre</li>
                        <li style={{ color: /[^A-Za-z0-9]/.test(formData.password || "") ? '#2e7d32' : '#d32f2f' }}>Symbole</li>
                      </ul>
                    </div>
                  )}
                </div>
                </div>
                {step === 'credentials' && pwTouched && (
                (() => {
                const pw = formData.password || "";
                const missing = [];
                if (pw.length < 8) missing.push('• 8 caractères minimum');
                if (!/[A-Z]/.test(pw)) missing.push('• Majuscule');
                if (!/[a-z]/.test(pw)) missing.push('• Minuscule');
                if (!/\d/.test(pw)) missing.push('• Chiffre');
                if (!/[^A-Za-z0-9]/.test(pw)) missing.push('• Symbole');
                return missing.length > 0 ? (
                <div style={{ fontSize: 12, marginTop: -6, marginBottom: 8, lineHeight: 1.4, color: '#d32f2f' }}>
                {missing.map((m) => (<div key={m}>{m}</div>))}
                </div>
                ) : null;
                })()
                )}

              {step === 'otp' && (
                <div className="form-group">
                  <label>Code OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="^[0-9]{6}$"
                    maxLength="6"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="form-input"
                    placeholder="Entrez le code à 6 chiffres"
                    required
                  />
                  <button
                    type="button"
                    className="continue-button"
                    onClick={async () => {
                      setLoading(true);
                      setError(null);
                      try {
                        const res = await startLoginWithOtp(formData);
                        setChallenge(res.challenge);
                      } catch (err) {
                        setError(err.message || "Échec de l'envoi du code");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    style={{ marginTop: 8 }}
                  >
                    Renvoyer le code
                  </button>
                </div>
              )}
              
              {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

              {step === 'credentials' && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ReCAPTCHA
                    sitekey="6Le-9NorAAAAAOQLM5EudqzLqAJqJEa_-ZJCtX0F"
                    onChange={(value) => setRecaptchaValue(value)}
                  />
                </div>
              )}

              <button type="submit" className="continue-button" disabled={loading}>
                {loading ? 'Chargement...' : (step === 'credentials' ? 'Continuer' : 'Valider le code')}
              </button>
            </form>
            {/* Removed signup toggle */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
