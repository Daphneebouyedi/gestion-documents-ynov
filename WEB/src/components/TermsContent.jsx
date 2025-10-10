import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from "convex/react";
import { useAuth } from "../hooks/useAuth"; // Import custom useAuth hook
import { api } from "../convex/_generated/api";
import './TermsContent.css';
import DashboardLayout from './DashboardLayout';

const CURRENT_TERMS_VERSION = "1.0"; // Définir la version actuelle des termes

const TermsContent = ({ readOnly = false }) => {
  const navigate = useNavigate();
  const acceptTerms = useMutation(api.auth.acceptTerms);
  const [isChecked, setIsChecked] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const handleAcceptTerms = async () => {
    if (isLoading) {
      // Auth state is still loading, prevent action
      return;
    }
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour accepter les CGU.");
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        // This should not happen if the user is on this page, but as a safeguard:
        alert("Erreur: Impossible de trouver l'identifiant de l'utilisateur. Veuillez vous reconnecter.");
        navigate('/login');
        return;
      }
      await acceptTerms({ version: CURRENT_TERMS_VERSION, userId: userId });
      navigate('/dashboard'); // Rediriger vers le tableau de bord après acceptation
    } catch (error) {
      if (error.message.includes("Not authenticated")) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userId");
        navigate('/login');
      } else {
        alert("Une erreur est survenue lors de l'acceptation des CGU: " + error.message);
      }
    }
  };

  return (
    <DashboardLayout pageTitle="Conditions Générales d'Utilisation" pageDescription="Applicables aux administrateurs de la plateforme">
      <div className="terms-page-wrapper">
        <div className="terms-content-container">
        <main className="terms-body">
          <p className="terms-update-date">Dernière mise à jour : 30 septembre 2025</p>

          <section>
            <h2>Article 1 : Objet et Champ d'Application</h2>
            <p>Les présentes Conditions Générales d'Utilisation (CGU) encadrent l'accès et l'utilisation du tableau de bord d'administration (ci-après "la Plateforme"). Tout accès à la Plateforme par un utilisateur habilité (ci-après "l'Administrateur") vaut acceptation sans réserve des présentes CGU. L'Administrateur reconnaît avoir la compétence et les moyens nécessaires pour accéder et utiliser la Plateforme.</p>
          </section>

          <section>
            <h2>Article 2 : Définitions</h2>
            <ul>
              <li><strong>Donnée à Caractère Personnel :</strong> Toute information se rapportant à une personne physique identifiée ou identifiable (ci-après "Personne Concernée"), conformément à l'article 4 du RGPD.</li>
              <li><strong>Traitement :</strong> Toute opération ou tout ensemble d'opérations effectuées ou non à l'aide de procédés automatisés et appliquées à des données ou des ensembles de données à caractère personnel.</li>
              <li><strong>Administrateur :</strong> Tout membre du personnel habilité à accéder à la Plateforme à des fins de gestion, de consultation ou de traitement de données.</li>
            </ul>
          </section>

          <section>
            <h2>Article 3 : Obligations Fondamentales de l'Administrateur</h2>
            <p>L'Administrateur est le garant de la sécurité et de la confidentialité des données qu'il traite. À ce titre, il s'engage à respecter les principes suivants, issus du Règlement Général sur la Protection des Données (RGPD) :</p>
            <ul>
              <li><strong>Principe de Finalité :</strong> Les données ne doivent être collectées et traitées que pour des objectifs déterminés, explicites et légitimes. L'Administrateur s'interdit d'utiliser les données à des fins autres que celles prévues par ses missions.</li>
              <li><strong>Principe de Minimisation :</strong> Seules les données strictement nécessaires à la poursuite de la finalité du traitement doivent être consultées et traitées. L'Administrateur doit s'abstenir de consulter des dossiers ou des informations non requis pour l'accomplissement de sa tâche en cours.</li>
              <li><strong>Principe d'Intégrité et de Confidentialité :</strong> L'Administrateur doit prendre toutes les mesures nécessaires pour garantir la sécurité des données, notamment pour empêcher qu'elles soient déformées, endommagées ou que des tiers non autorisés y aient accès.</li>
            </ul>
          </section>

          <section>
            <h2>Article 4 : Règles de Sécurité Stricte</h2>
            <ol>
              <li><strong>Gestion des Identifiants :</strong> Les identifiants de connexion sont personnels, uniques et incessibles. L'Administrateur est entièrement responsable de la conservation et de la confidentialité de son mot de passe. Il s'engage à ne jamais le communiquer. En cas de compromission ou de suspicion de compromission, il doit en informer le responsable de la sécurité sans délai.</li>
              <li><strong>Utilisation d'un Poste de Travail Sécurisé :</strong> L'accès à la Plateforme doit se faire depuis un poste de travail sécurisé, doté d'un antivirus à jour et d'un pare-feu. L'utilisation de réseaux Wi-Fi publics non sécurisés pour accéder à la Plateforme est formellement proscrite.</li>
              <li><strong>Interdiction d'Exportation Non Autorisée :</strong> Toute exportation, copie sur des supports amovibles (clés USB, disques durs externes) ou envoi par email non sécurisé de données à caractère personnel est interdit, sauf procédure exceptionnelle validée par la hiérarchie.</li>
              <li><strong>Verrouillage de Session :</strong> L'Administrateur doit systématiquement verrouiller sa session de travail (Ctrl+Alt+Suppr sur Windows, ou équivalent) dès qu'il quitte son poste, même pour une courte durée.</li>
            </ol>
          </section>

          <section>
            <h2>Article 5 : Traçabilité et Audit</h2>
            <p>Conformément aux exigences de sécurité, toutes les actions réalisées sur la Plateforme font l'objet d'une journalisation (logs de connexion, consultations, modifications, exportations). Ces journaux sont conservés de manière sécurisée et peuvent être audités à tout moment par les services habilités afin de détecter et d'analyser toute activité suspecte ou non conforme.</p>
          </section>

          <section>
            <h2>Article 6 : Signalement des Violations de Données</h2>
            <p>L'Administrateur a l'obligation de signaler immédiatement à son supérieur hiérarchique et/ou au Délégué à la Protection des Données (DPO) toute violation de données à caractère personnel ou toute suspicion de violation (perte d'identifiants, accès suspect, etc.), conformément à l'article 33 du RGPD. L'absence de signalement constitue une faute grave.</p>
          </section>

          <section>
            <h2>Article 7 : Sanctions</h2>
            <p>Tout manquement délibéré ou par négligence aux règles édictées dans les présentes CGU expose l'Administrateur à des sanctions disciplinaires pouvant aller jusqu'au licenciement pour faute grave, sans préjudice d'éventuelles poursuites judiciaires (civiles ou pénales) engagées à son encontre ou à l'encontre de l'organisation.</p>
          </section>

          <section className="terms-acceptance-section">
            <h2>Article 8 : Acceptation</h2>
            <p>En accédant à la plateforme, l'Administrateur reconnaît avoir lu, compris et accepté l'ensemble de ces conditions et s'engage à les respecter scrupuleusement dans le cadre de ses fonctions.</p>
          </section>
        </main>

        {/* Removed the checkbox, label, and button as per request */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TermsContent;
