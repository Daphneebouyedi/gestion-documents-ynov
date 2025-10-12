import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from "./DashboardLayout";
import "./Dashboard.css";

const Details_Notifications = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const alert = useQuery(api.alerts.getUserAlerts, userIdFromToken ? { userId: userIdFromToken } : "skip")?.find(a => a._id === id);
  const user = useQuery(api.auth.getUser, userIdFromToken ? { userId: userIdFromToken } : "skip");

  const generateMessage = (alert, user) => {
    if (!alert || !user) return "";
    const { firstName, lastName } = user;
    const { status, documentType, deadline } = alert;

    switch (status) {
      case "Disponible":
        return `Bonjour ${firstName} ${lastName}, Votre ${documentType} est prêt, veuillez consulter la rubrique documents disponibles.`;
      case "Relance":
        return `Bonjour ${firstName} ${lastName}, Rappel : Votre ${documentType} est en attente. Veuillez le compléter avant la date limite : ${deadline}.`;
      case "En cours":
        return `Bonjour ${firstName} ${lastName}, Votre demande de ${documentType} est en cours de traitement.`;
      case "Rejeté":
        return `Bonjour ${firstName} ${lastName}, Votre demande de ${documentType} a été rejetée. Veuillez vérifier les raisons et soumettre à nouveau.`;
      case "Validé":
        return `Bonjour ${firstName} ${lastName}, Votre ${documentType} a été validé avec succès.`;
      default:
        return `Bonjour ${firstName} ${lastName}, N'oubliez pas de mettre à jour votre profil.`;
    }
  };

  const message = generateMessage(alert, user);

  return (
    <DashboardLayout pageTitle="Détails de la Notification" pageDescription="Informations détaillées sur la notification">
      <div className="main-content" style={{ background: '#F6F8FA', minHeight: '100vh', padding: 0, marginLeft: 32, overflow: 'visible' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32, marginTop: 24, border: '1px solid #e6e6e6' }}>
          <button
            onClick={() => navigate('/alerts')}
            style={{
              background: '#23c2a2',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 24
            }}
          >
            Retour
          </button>

          <div style={{ display: 'flex', gap: 32 }}>
            {/* Left side: Information */}
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#222', fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
                Informations de la {alert?.status === "Relance" ? "relance" : "notification"}
              </h3>
              <div style={{ background: '#F6F8FA', padding: 16, borderRadius: 8, border: '1px solid #e6e6e6' }}>
                <p><strong>Type:</strong> {alert?.documentType}</p>
                <p><strong>Statut:</strong> {alert?.status}</p>
                <p><strong>Date/heure:</strong> {alert ? new Date(alert.createdAt).toLocaleString('fr-FR') : ''}</p>
                {alert?.deadline && <p><strong>Date limite:</strong> {alert.deadline}</p>}
                <p><strong>Promotion:</strong> {alert?.promotion}</p>
                <p><strong>Spécialité:</strong> {alert?.specialty}</p>
              </div>
            </div>

            {/* Right side: Message */}
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#222', fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
                Message
              </h3>
              <div style={{ background: '#F6F8FA', padding: 16, borderRadius: 8, border: '1px solid #e6e6e6', minHeight: 200 }}>
                <p style={{ fontSize: 16, lineHeight: 1.5 }}>{message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Details_Notifications;
