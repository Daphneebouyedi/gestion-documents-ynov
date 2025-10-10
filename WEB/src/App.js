import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { api } from "./convex/_generated/api";
import { useAuth } from "./hooks/useAuth"; // Import custom useAuth hook

// Composants
import ReponseMail from './components/ReponseMail';
import Dashboard from "./components/Dashboard";
import NotificationsAlertes from "./components/Notifications-alertes"; 
import Alertes from "./components/Alertes";
import AlertsAndPendingDocs from "./components/AlertsAndPendingDocs";
import DocumentsDispo from "./components/Documents_Dispo";
import Recherche from "./components/Recherche";
import DocumentsTransferts from "./components/Documents_Transferts";
import DetailTransfert from "./components/DetailTransfert";
import Login from "./components/Login";
import DetailPage from "./components/Detail";
import Demandes from "./components/Demandes";
import AttestationForm from "./components/Attestation";
import DemandesMails from "./components/Demandes-Mails";
import Generer from "./components/Generer_Convention";
import GestionUtilisateurs from "./components/Gestion-Utilisateurs";
import DetailsUtilisateurs from "./components/Details_utilisateurs";
import Profil from "./components/Profil"
import ConventionEtudeForm from "./components/Convention_Etude"
import DocumentsGeneres from "./components/Documents_Generes";
import DocumentGeneresDetailPage from "./components/DetailDocGeneres";
import DocumentDetail from "./components/DocumentDetail";
import TermsContent from "./components/TermsContent"; // Import TermsContent
import HomePage from "./components/HomePage";
import DetailsDemandes from "./components/Details_demandes";

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
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Notifications */}
          <Route path="/notifications" element={<NotificationsAlertes />} />
          <Route path="/notifications/alertes" element={<Alertes />} />   
          <Route path="/notifications/demandes" element={<Demandes />} />
          <Route path="/alerts" element={<AlertsAndPendingDocs />} />

          {/* Demandes */}
          <Route path="/demandes" element={<Demandes />} />
          <Route path="/demandes/:id" element={<DemandesMails />} />
          <Route path="/demandes-mail/:id" element={<DemandesMails />} />
          <Route path="/reponse-mail/:id" element={<ReponseMail />} />
          <Route path="/details-demandes/:id" element={<DetailsDemandes />} />

          {/* Documents */}
          <Route path="/documents-dispo" element={<DocumentsDispo />} />
          <Route path="/documents-dispo/:id" element={<DocumentDetail />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route path="/documents-transferts" element={<DocumentsTransferts />} />
          <Route path="/document-transfert/:id" element={<DetailTransfert />} />
          <Route path="/documents-generes" element={<DocumentsGeneres />} />
          <Route path="/documents/list/:id" element={<DetailPage />} />
          <Route path="/documents/genere/:id" element={<DocumentGeneresDetailPage />} />

          {/* Générer */}
          <Route path="/generer/convention-stage" element={<Generer />} />
          <Route path="/generer/attestation" element={<AttestationForm />} />
          <Route path="/generer/convention-etude" element={<ConventionEtudeForm />} />

          {/* Profil */}
          <Route path="/profil" element={<Profil/>} />
          <Route path="/utilisateur/:id" element={<DetailsUtilisateurs />} />
          <Route path="/gestion-utilisateurs" element={<GestionUtilisateurs />} />  

          {/* Conditions générales */}
          <Route path="/terms" element={<TermsContent />} />
          <Route path="/view-terms" element={<TermsContent readOnly={true} />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ConvexProvider>
  );
}

export default App;
