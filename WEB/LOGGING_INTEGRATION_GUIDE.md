# Intégration du Logging - Actions Automatiques

## ✅ Déjà Intégré

### 1. Login.jsx
**Action:** Connexion réussie  
**Code ajouté:**
```javascript
// Lors de la connexion OTP réussie (ligne ~90)
await logAction(
  ACTION_TYPES.LOGIN,
  "Connexion réussie",
  { 
    email: formData.email,
    timestamp: new Date().toISOString(),
    method: "OTP"
  }
);
```

### 2. DashboardLayout.jsx
**Action:** Déconnexion  
**Code ajouté:**
```javascript
// Lors du clic sur Se déconnecter
await logAction(
  ACTION_TYPES.LOGOUT,
  "Déconnexion",
  { timestamp: new Date().toISOString() }
);
```

## 📝 À Intégrer Manuellement

### 3. Profile.jsx / Profil.jsx
**Quand:** Après modification du profil (téléphone, adresse, photo, etc.)

**Code à ajouter:**
```javascript
import { useActionLogger, ACTION_TYPES } from '../hooks/useActionLogger';

// Dans le composant
const logAction = useActionLogger();

// Après sauvegarde réussie
await logAction(
  ACTION_TYPES.PROFILE_UPDATE,
  "Modification du profil",
  { 
    fields: ["phone", "address"], // Champs modifiés
    timestamp: new Date().toISOString()
  }
);
```

### 4. Convention_Etude.jsx / Generer_Convention.jsx
**Quand:** Après soumission d'une demande de convention

**Code à ajouter:**
```javascript
import { useActionLogger, ACTION_TYPES } from '../hooks/useActionLogger';

const logAction = useActionLogger();

// Après soumission réussie
await logAction(
  ACTION_TYPES.CONVENTION_CREATE,
  "Demande de convention de stage",
  { 
    entreprise: formData.entrepriseNom,
    dateDebut: formData.dateDebut,
    dateFin: formData.dateFin
  }
);
```

### 5. Attestation.jsx
**Quand:** Après demande d'attestation

**Code à ajouter:**
```javascript
import { useActionLogger, ACTION_TYPES } from '../hooks/useActionLogger';

const logAction = useActionLogger();

// Après soumission
await logAction(
  ACTION_TYPES.ATTESTATION_CREATE,
  "Demande d'attestation",
  { 
    type: formData.type, // "Scolarité", "Réussite", etc.
    anneeScolaire: formData.anneeScolaire
  }
);
```

### 6. Upload de Documents
**Quand:** Après téléversement réussi

**Code à ajouter:**
```javascript
await logAction(
  ACTION_TYPES.DOCUMENT_UPLOAD,
  `Téléversement de ${file.name}`,
  { 
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  }
);
```

### 7. Téléchargement de Documents
**Quand:** Lors du clic sur télécharger

**Code à ajouter:**
```javascript
await logAction(
  ACTION_TYPES.DOCUMENT_DOWNLOAD,
  `Téléchargement de ${documentName}`,
  { 
    documentId: doc.id,
    documentType: doc.type
  }
);
```

### 8. Actions Admin - Validation/Rejet
**Quand:** Admin valide ou rejette un document

**Code à ajouter:**
```javascript
// Validation
await logAction(
  ACTION_TYPES.DOCUMENT_VALIDATE,
  `Validation de ${documentName}`,
  { 
    documentId: doc.id,
    studentEmail: student.email
  }
);

// Rejet
await logAction(
  ACTION_TYPES.DOCUMENT_REJECT,
  `Rejet de ${documentName}`,
  { 
    documentId: doc.id,
    reason: rejectReason,
    studentEmail: student.email
  }
);
```

### 9. Gestion Utilisateurs (Admin)
**Quand:** Création, modification, désactivation

**Code à ajouter:**
```javascript
// Création
await logAction(
  ACTION_TYPES.USER_CREATE,
  `Création de ${userEmail}`,
  { email: userEmail, role: userRole }
);

// Modification
await logAction(
  ACTION_TYPES.USER_UPDATE,
  `Modification de ${userEmail}`,
  { fields: changedFields }
);

// Désactivation
await logAction(
  ACTION_TYPES.USER_DEACTIVATE,
  `Désactivation de ${userEmail}`,
  { targetUserId: userId }
);
```

## 🎯 Résultat Attendu

Après intégration, l'historique affichera automatiquement :
- ✅ Connexions de daphnee.bouyedi@ynov.com (et autres)
- ✅ Déconnexions
- ✅ Modifications de profil (dates de naissance, téléphone, adresse, etc.)
- ✅ Demandes de documents (conventions, attestations)
- ✅ Téléversements de fichiers
- ✅ Téléchargements
- ✅ Toutes actions admin

## 📊 Consultation de l'Historique

L'admin peut voir l'historique en temps réel sur:
**URL:** `/journalisation`

L'interface affiche:
- Date/Heure précise
- Utilisateur (email + nom)
- Action effectuée
- Type (avec badge coloré)
- Détails JSON

## 🔄 Temps Réel

Les logs apparaissent **instantanément** grâce à Convex (pas besoin de rafraîchir la page).

## 🛠️ Pour Tester

1. Se connecter avec daphnee.bouyedi@ynov.com
2. Faire des actions (modifier profil, demander un document, etc.)
3. L'admin consulte `/journalisation`
4. Voir les actions apparaître en temps réel

## 📝 Note Importante

Les actions sont automatiquement associées à l'utilisateur connecté via:
- `localStorage.getItem("userId")`
- `localStorage.getItem("userEmail")`
- `localStorage.getItem("userName")`

Ces valeurs sont définies lors de la connexion dans `Login.jsx`.
