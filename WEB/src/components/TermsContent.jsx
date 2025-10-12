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
            <p>Les présentes Conditions Générales d'Utilisation (CGU) encadrent l'accès et l'utilisation de la plateforme de gestion documentaire (ci-après "la Plateforme") par les administrateurs (ci-après "l'Administrateur"). Tout accès à la Plateforme vaut acceptation sans réserve des présentes CGU. L'Administrateur reconnaît avoir la compétence technique et les moyens nécessaires pour administrer et gérer la Plateforme de manière sécurisée.</p>
          </section>

          <section>
            <h2>Article 2 : Définitions</h2>
            <ul>
              <li><strong>Donnée à Caractère Personnel :</strong> Toute information se rapportant à une personne physique identifiée ou identifiable (ci-après "Personne Concernée"), conformément à l'article 4 du RGPD.</li>
              <li><strong>Traitement :</strong> Toute opération ou tout ensemble d'opérations effectuées ou non à l'aide de procédés automatisés et appliquées à des données ou des ensembles de données à caractère personnel.</li>
              <li><strong>Administrateur :</strong> Personne habilitée à gérer la Plateforme, disposant de droits étendus pour administrer les utilisateurs, les documents et les paramètres système.</li>
              <li><strong>Responsable de Traitement :</strong> L'établissement d'enseignement qui détermine les finalités et les moyens du traitement des données personnelles.</li>
            </ul>
          </section>

          <section>
            <h2>Article 3 : Collecte et Utilisation des Données Personnelles</h2>
            <p>En tant qu'Administrateur, vous traitez des données personnelles sensibles des étudiants, parents et personnels. Conformément au RGPD, ces données doivent être traitées uniquement pour les finalités suivantes :</p>
            <ul>
              <li>Gestion et traitement des demandes de documents administratifs (conventions de stage, attestations, bulletins, etc.)</li>
              <li>Administration des comptes utilisateurs (création, modification, suppression)</li>
              <li>Communication sécurisée entre l'établissement, les étudiants et les parents</li>
              <li>Archivage et traçabilité des échanges documentaires</li>
              <li>Génération de statistiques et rapports d'activité anonymisés</li>
              <li>Maintenance et surveillance de la sécurité de la Plateforme</li>
            </ul>
            <p><strong>Attention :</strong> L'Administrateur est soumis au secret professionnel. Toute consultation, divulgation ou utilisation non autorisée des données personnelles constitue une violation du RGPD et peut entraîner des sanctions disciplinaires, civiles et pénales.</p>
          </section>

          <section>
            <h2>Article 4 : Responsabilités et Obligations de l'Administrateur</h2>
            <p>En tant qu'Administrateur, vous vous engagez à :</p>
            <ul>
              <li><strong>Confidentialité :</strong> Respecter le secret professionnel et ne pas divulguer les données personnelles consultées dans le cadre de vos fonctions</li>
              <li><strong>Minimisation des données :</strong> N'accéder qu'aux données strictement nécessaires à l'accomplissement de vos missions</li>
              <li><strong>Intégrité et disponibilité :</strong> Assurer la sauvegarde régulière des données et garantir la continuité du service</li>
              <li><strong>Traçabilité :</strong> Toutes vos actions sont enregistrées (logs). Ne pas tenter de contourner ou supprimer les journaux d'audit</li>
              <li><strong>Gestion des incidents :</strong> Signaler immédiatement toute violation de données ou incident de sécurité au DPO et à la direction</li>
              <li><strong>Formation continue :</strong> Maintenir vos compétences à jour en matière de protection des données et de sécurité informatique</li>
              <li><strong>Gestion des droits :</strong> Traiter dans les délais légaux les demandes d'exercice des droits RGPD (accès, rectification, effacement, etc.)</li>
            </ul>
          </section>

          <section>
            <h2>Article 5 : Conditions de Sécurité Renforcées</h2>
            <ol>
              <li><strong>Gestion des Identifiants :</strong> Vos identifiants d'administrateur sont strictement personnels et confidentiels. Ne les partagez jamais, même avec d'autres administrateurs. Utilisez un mot de passe fort (minimum 12 caractères avec majuscules, minuscules, chiffres et symboles) et activez l'authentification à deux facteurs (2FA) si disponible.</li>
              <li><strong>Utilisation Sécurisée :</strong> Accédez à la Plateforme uniquement depuis des postes de travail sécurisés et sur le réseau de l'établissement. L'accès à distance doit impérativement se faire via VPN sécurisé. Ne vous connectez jamais depuis des réseaux Wi-Fi publics.</li>
              <li><strong>Protection des Données :</strong> Chiffrez tous les documents sensibles lors de leur stockage et transmission. Ne stockez aucune donnée personnelle sur des supports amovibles non chiffrés.</li>
              <li><strong>Déconnexion et Verrouillage :</strong> Verrouillez votre poste de travail lors de toute absence et déconnectez-vous systématiquement après utilisation de la Plateforme.</li>
              <li><strong>Mises à jour :</strong> Maintenez à jour votre système d'exploitation, navigateur et tous les logiciels de sécurité.</li>
              <li><strong>Sauvegardes :</strong> Effectuez des sauvegardes régulières selon le calendrier établi et vérifiez leur intégrité.</li>
            </ol>
          </section>

          <section>
            <h2>Article 6 : Droits d'Accès et Habilitations</h2>
            <p>En tant qu'Administrateur, vous disposez de privilèges étendus incluant :</p>
            <ul>
              <li>Gestion complète des comptes utilisateurs (création, modification, désactivation)</li>
              <li>Accès aux données personnelles des étudiants et parents</li>
              <li>Génération et validation de documents administratifs</li>
              <li>Configuration des paramètres système et de sécurité</li>
              <li>Consultation des journaux d'activité et statistiques</li>
              <li>Gestion des alertes et notifications système</li>
            </ul>
            <p><strong>Important :</strong> Ces privilèges ne doivent être utilisés que dans le cadre strict de vos fonctions professionnelles. Tout abus sera sanctionné.</p>
          </section>

          <section>
            <h2>Article 7 : Gestion des Violations de Données</h2>
            <p>En cas de violation de données personnelles (accès non autorisé, perte, divulgation accidentelle, etc.), l'Administrateur doit :</p>
            <ol>
              <li>Informer immédiatement le Délégué à la Protection des Données (DPO) et la direction de l'établissement</li>
              <li>Documenter précisément l'incident : nature, date, données concernées, personnes affectées</li>
              <li>Prendre les mesures immédiates pour contenir la violation et limiter les dégâts</li>
              <li>Coopérer pleinement avec les enquêtes internes et externes</li>
              <li>Participer à la notification aux autorités de contrôle (CNIL) si nécessaire, dans les 72 heures</li>
            </ol>
            <p>Le non-respect de cette procédure constitue une faute grave.</p>
          </section>

          <section>
            <h2>Article 8 : Sécurité des Données et Conformité RGPD</h2>
            <p>L'Administrateur doit garantir la mise en œuvre et le maintien des mesures de sécurité suivantes :</p>
            <ul>
              <li>Chiffrement des données sensibles au repos et en transit (TLS/SSL, AES-256)</li>
              <li>Contrôles d'accès basés sur les rôles (RBAC) et principe du moindre privilège</li>
              <li>Journalisation exhaustive de toutes les actions administratives</li>
              <li>Surveillance continue et détection des anomalies</li>
              <li>Tests réguliers de restauration des sauvegardes</li>
              <li>Revues périodiques des droits d'accès et désactivation des comptes inactifs</li>
              <li>Analyses de vulnérabilité et application des correctifs de sécurité</li>
            </ul>
          </section>

          <section>
            <h2>Article 9 : Durée de Conservation des Données</h2>
            <p>L'Administrateur doit respecter les durées de conservation légales :</p>
            <ul>
              <li>Documents administratifs : durée de la scolarité + 5 ans</li>
              <li>Logs d'activité : minimum 6 mois, maximum 1 an</li>
              <li>Données de sécurité (incidents) : 5 ans</li>
              <li>Comptes utilisateurs inactifs : suppression après 2 ans d'inactivité</li>
            </ul>
            <p>L'Administrateur doit mettre en place des processus automatisés de purge conformes à ces durées.</p>
          </section>

          <section>
            <h2>Article 10 : Modifications des CGU</h2>
            <p>Les présentes CGU peuvent être modifiées à tout moment pour s'adapter aux évolutions légales et réglementaires. L'Administrateur sera informé des changements et devra accepter la nouvelle version pour continuer à exercer ses fonctions.</p>
          </section>

          <section>
            <h2>Article 11 : Sanctions</h2>
            <p>Tout manquement aux présentes CGU peut entraîner :</p>
            <ul>
              <li>La suspension ou révocation immédiate des droits d'accès</li>
              <li>Des sanctions disciplinaires (avertissement, mutation, licenciement)</li>
              <li>Des poursuites civiles pour dommages et intérêts</li>
              <li>Des poursuites pénales en cas de violation du RGPD (jusqu'à 5 ans d'emprisonnement et 300 000 € d'amende)</li>
            </ul>
          </section>

          <section className="terms-acceptance-section">
            <h2>Article 12 : Acceptation</h2>
            <p>En accédant à la Plateforme avec des droits d'administrateur, vous reconnaissez avoir lu, compris et accepté l'ensemble de ces conditions générales d'utilisation. Vous vous engagez à respecter scrupuleusement les obligations qui en découlent et acceptez votre responsabilité en tant que garant de la sécurité et de la confidentialité des données personnelles confiées.</p>
          </section>
        </main>

        {/* Removed the checkbox, label, and button as per request */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TermsContent;
