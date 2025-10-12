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
    <DashboardLayout pageTitle="Conditions Générales d'Utilisation" pageDescription="Applicables aux étudiants et parents utilisateurs de la plateforme">
      <div className="terms-page-wrapper">
        <div className="terms-content-container">
        <main className="terms-body">
          <p className="terms-update-date">Dernière mise à jour : 30 septembre 2025</p>

          <section>
            <h2>Article 1 : Objet et Champ d'Application</h2>
            <p>Les présentes Conditions Générales d'Utilisation (CGU) encadrent l'accès et l'utilisation de la plateforme de gestion documentaire (ci-après "la Plateforme") par les étudiants et parents (ci-après "l'Utilisateur"). Tout accès à la Plateforme vaut acceptation sans réserve des présentes CGU. L'Utilisateur reconnaît avoir la compétence et les moyens nécessaires pour accéder et utiliser la Plateforme.</p>
          </section>

          <section>
            <h2>Article 2 : Définitions</h2>
            <ul>
              <li><strong>Donnée à Caractère Personnel :</strong> Toute information se rapportant à une personne physique identifiée ou identifiable (ci-après "Personne Concernée"), conformément à l'article 4 du RGPD.</li>
              <li><strong>Traitement :</strong> Toute opération ou tout ensemble d'opérations effectuées ou non à l'aide de procédés automatisés et appliquées à des données ou des ensembles de données à caractère personnel.</li>
              <li><strong>Utilisateur :</strong> Étudiant ou parent inscrit sur la Plateforme pour consulter et gérer des documents administratifs.</li>
            </ul>
          </section>

          <section>
            <h2>Article 3 : Collecte et Utilisation des Données Personnelles</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), les données personnelles de l'Utilisateur sont collectées et traitées uniquement pour les finalités suivantes :</p>
            <ul>
              <li>Gestion des demandes de documents administratifs (conventions de stage, attestations, bulletins, etc.)</li>
              <li>Communication sécurisée entre l'établissement, les étudiants et les parents</li>
              <li>Archivage et traçabilité des échanges documentaires</li>
            </ul>
            <p><strong>Attention :</strong> Les données de l'Utilisateur seront utilisées exclusivement dans le cadre de ces finalités. Toute utilisation détournée est strictement interdite et peut entraîner des sanctions.</p>
          </section>

          <section>
            <h2>Article 4 : Droits de l'Utilisateur (RGPD)</h2>
            <p>L'Utilisateur dispose des droits suivants concernant ses données personnelles :</p>
            <ul>
              <li><strong>Droit d'accès :</strong> Consulter ses données personnelles traitées par la Plateforme</li>
              <li><strong>Droit de rectification :</strong> Demander la correction de données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> Demander la suppression de ses données dans certains cas</li>
              <li><strong>Droit à la portabilité :</strong> Recevoir ses données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> S'opposer au traitement de ses données pour des motifs légitimes</li>
            </ul>
            <p>Pour exercer ces droits, contactez le Délégué à la Protection des Données (DPO) de l'établissement.</p>
          </section>

          <section>
            <h2>Article 5 : Conditions de Sécurité</h2>
            <ol>
              <li><strong>Gestion des Identifiants :</strong> Les identifiants de connexion sont personnels et confidentiels. L'Utilisateur est responsable de leur conservation. Ne partagez jamais vos identifiants avec des tiers.</li>
              <li><strong>Utilisation Sécurisée :</strong> Accédez à la Plateforme uniquement depuis des appareils et réseaux sécurisés. Évitez les réseaux Wi-Fi publics pour les opérations sensibles.</li>
              <li><strong>Protection des Données :</strong> Ne téléchargez pas de fichiers suspects et signalez immédiatement toute activité inhabituelle.</li>
              <li><strong>Déconnexion :</strong> Déconnectez-vous systématiquement après utilisation de la Plateforme.</li>
            </ol>
          </section>

          <section>
            <h2>Article 6 : Responsabilités de l'Utilisateur</h2>
            <p>L'Utilisateur s'engage à :</p>
            <ul>
              <li>Utiliser la Plateforme uniquement pour des fins légitimes liées à la gestion documentaire</li>
              <li>Ne pas tenter d'accéder à des données qui ne lui sont pas destinées</li>
              <li>Signaler immédiatement toute faille de sécurité ou tentative d'intrusion</li>
              <li>Respecter la confidentialité des informations consultées</li>
            </ul>
          </section>

          <section>
            <h2>Article 7 : Sécurité des Données</h2>
            <p>La Plateforme met en œuvre des mesures techniques et organisationnelles appropriées pour garantir la sécurité des données personnelles, conformément au RGPD. Cela inclut le chiffrement des données, les contrôles d'accès, et la surveillance continue.</p>
          </section>

          <section>
            <h2>Article 8 : Modifications des CGU</h2>
            <p>Les présentes CGU peuvent être modifiées à tout moment. L'Utilisateur sera informé des changements et devra accepter la nouvelle version pour continuer à utiliser la Plateforme.</p>
          </section>

          <section className="terms-acceptance-section">
            <h2>Article 9 : Acceptation</h2>
            <p>En accédant à la Plateforme, l'Utilisateur reconnaît avoir lu, compris et accepté l'ensemble de ces conditions générales d'utilisation orientées étudiants et parents.</p>
          </section>
        </main>

        {/* Removed the checkbox, label, and button as per request */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TermsContent;
