import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { api } from "./convex/_generated/api";
import { useAuth } from "./hooks/useAuth"; // Import custom useAuth hook

// Composants
import ReponseMail from './components/ReponseMail';
import NotificationsAlertes from "./components/Notifications-alertes";
import Alertes from "./components/Alertes";
import DocumentsDispo from "./components/Documents_Dispo";
import Recherche from "./components/Recherche";
import Login from "./components/Login";
import DetailPage from "./components/Detail";
import Demandes from "./components/Demandes";
import AttestationForm from "./components/Attestation";
import DemandesMails from "./components/Demandes-Mails";
import Demander from "./components/Demander_Convention";
import DetailsUtilisateurs from "./components/Details_utilisateurs";
import Profil from "./components/Profil"
import ConventionEtudeForm from "./components/Convention_Etude"
import AttestationInscription from "./components/Attestation_Inscription";
import AttestationReussite from "./components/Attestation_Reussite";
import Bulletin from "./components/Bulletin";
import DocumentDetail from "./components/DocumentDetail";
import TermsContent from "./components/TermsContent"; // Import TermsContent
import HomePage from "./components/HomePage";
import DetailsDemandes from "./components/Details_demandes";
import DetailsDemande from "./components/DetailsDemande";
import Notifications from "./components/Notifications";
import Details_Notifications from "./components/Details_Notifications";

const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL, {
  auth: {
    getToken: async () => {
      return localStorage.getItem("jwtToken");
    },
  },
});

function App() {
  return (
    <ConvexProvider client={convex}>
      <Router>
        <Routes>
          {/* Page par défaut */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />

          {/* Notifications */}
          <Route path="/notifications" element={<NotificationsAlertes />} />
          <Route path="/notifications/alertes" element={<Alertes />} />
          <Route path="/notifications/demandes" element={<Demandes />} />
          <Route path="/alerts" element={<Notifications />} />
          <Route path="/alerts/:id" element={<Details_Notifications />} />

          {/* Demandes */}
          <Route path="/demandes" element={<Demandes />} />
          <Route path="/demandes/:id" element={<DemandesMails />} />
          <Route path="/demandes-mail/:id" element={<DemandesMails />} />
          <Route path="/reponse-mail/:id" element={<ReponseMail />} />
          <Route path="/details-demandes/:id" element={<DetailsDemandes />} />
          <Route path="/details-demande/:id" element={<DetailsDemande />} />

          {/* Documents */}
          <Route path="/documents-dispo" element={<DocumentsDispo />} />
          <Route path="/documents-dispo/:id" element={<DocumentDetail />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route path="/documents/list/:id" element={<DetailPage />} />


          {/* Demander */}
          <Route path="/Demander/convention-stage" element={<Demander />} />
          <Route path="/Demander/attestation" element={<AttestationForm />} />
          <Route path="/Demander/convention-etude" element={<ConventionEtudeForm />} />
          <Route path="/Demander/attestation-inscription" element={<AttestationInscription />} />
          <Route path="/Demander/attestation-reussite" element={<AttestationReussite />} />
          <Route path="/Demander/bulletin" element={<Bulletin />} />

          {/* Profil */}
          <Route path="/profil" element={<Profil/>} />
          <Route path="/utilisateur/:id" element={<DetailsUtilisateurs />} />

          {/* Conditions générales */}
          <Route path="/terms" element={<TermsContent />} />
          <Route path="/view-terms" element={<TermsContent readOnly={true} />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/parents" element={<Login />} />
          <Route path="/login/students" element={<Login />} />
        </Routes>
      </Router>
    </ConvexProvider>
  );
}

export default App;
