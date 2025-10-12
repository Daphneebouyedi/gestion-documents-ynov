# Guide d'Intégration du Système de Journalisation

## Vue d'ensemble
Le système de journalisation en temps réel capture toutes les actions des utilisateurs dans la plateforme.

## Fichiers créés/modifiés

### Backend (Convex)
1. **`WEB/src/convex/actionLogger.ts`** - Fonctions de logging et queries
2. **`WEB/src/convex/schema.ts`** - Table actionLogs mise à jour avec index

### Frontend
1. **`WEB/src/hooks/useActionLogger.js`** - Hook personnalisé pour logger facilement
2. **`WEB/src/components/Journalisation.jsx`** - Interface d'affichage des logs en temps réel
3. **`WEB/src/components/Journalisation.css`** - Styles pour l'interface

## Comment utiliser

### 1. Dans un composant React

```javascript
import { useActionLogger, ACTION_TYPES } from '../hooks/useActionLogger';

const MyComponent = () => {
  const logAction = useActionLogger();
  
  const handleLogin = async () => {
    // ... code de connexion
    await logAction(ACTION_TYPES.LOGIN, "Connexion réussie");
  };
  
  const handleProfileUpdate = async (data) => {
    // ... code de mise à jour
    await logAction(
      ACTION_TYPES.PROFILE_UPDATE, 
      "Modification du profil", 
      { fields: Object.keys(data) }
    );
  };
  
  return <div>...</div>;
};
```

### 2. Actions à logger

#### Authentification
- `ACTION_TYPES.LOGIN` - Connexion
- `ACTION_TYPES.LOGOUT` - Déconnexion
- `ACTION_TYPES.PASSWORD_CHANGE` - Changement de mot de passe

#### Profil
- `ACTION_TYPES.PROFILE_UPDATE` - Modification du profil
- `ACTION_TYPES.PROFILE_VIEW` - Consultation du profil

#### Documents
- `ACTION_TYPES.DOCUMENT_REQUEST` - Demande de document
- `ACTION_TYPES.DOCUMENT_UPLOAD` - Téléversement
- `ACTION_TYPES.DOCUMENT_DOWNLOAD` - Téléchargement
- `ACTION_TYPES.DOCUMENT_DELETE` - Suppression
- `ACTION_TYPES.DOCUMENT_VALIDATE` - Validation (admin)
- `ACTION_TYPES.DOCUMENT_REJECT` - Rejet (admin)

#### Gestion Utilisateurs (Admin)
- `ACTION_TYPES.USER_CREATE` - Création d'utilisateur
- `ACTION_TYPES.USER_UPDATE` - Modification d'utilisateur
- `ACTION_TYPES.USER_DELETE` - Suppression d'utilisateur
- `ACTION_TYPES.USER_ACTIVATE` - Activation
- `ACTION_TYPES.USER_DEACTIVATE` - Désactivation

#### Conventions et Attestations
- `ACTION_TYPES.CONVENTION_CREATE` - Création de convention
- `ACTION_TYPES.ATTESTATION_CREATE` - Création d'attestation

#### Autres
- `ACTION_TYPES.ALERT_CREATE` - Création d'alerte
- `ACTION_TYPES.ALERT_READ` - Lecture d'alerte
- `ACTION_TYPES.TERMS_ACCEPT` - Acceptation des CGU
- `ACTION_TYPES.SEARCH` - Recherche

## Exemples d'Intégration

### Login.jsx
```javascript
import { useActionLogger, ACTION_TYPES } from '../hooks/useActionLogger';

const Login = () => {
  const logAction = useActionLogger();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ... logique de connexion
      await logAction(ACTION_TYPES.LOGIN, "Connexion réussie");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };
};
```

### Profile.jsx
```javascript
const Profile = () => {
  const logAction = useActionLogger();
  
  const handleUpdateProfile = async (formData) => {
    try {
      // ... logique de mise à jour
      await logAction(
        ACTION_TYPES.PROFILE_UPDATE,
        "Modification du profil",
        {
          updatedFields: Object.keys(formData),
          timestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
};
```

### Document Upload
```javascript
const DocumentUpload = () => {
  const logAction = useActionLogger();
  
  const handleUpload = async (file) => {
    try {
      // ... logique d'upload
      await logAction(
        ACTION_TYPES.DOCUMENT_UPLOAD,
        `Téléversement du document: ${file.name}`,
        {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
};
```

### Convention Request
```javascript
const ConventionForm = () => {
  const logAction = useActionLogger();
  
  const handleSubmit = async (formData) => {
    try {
      // ... logique de soumission
      await logAction(
        ACTION_TYPES.CONVENTION_CREATE,
        "Création d'une demande de convention de stage",
        {
          entreprise: formData.entrepriseNom,
          dateDebut: formData.dateDebut,
          dateFin: formData.dateFin
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
};
```

### Admin - User Management
```javascript
const UserManagement = () => {
  const logAction = useActionLogger();
  
  const handleCreateUser = async (userData) => {
    try {
      // ... création utilisateur
      await logAction(
        ACTION_TYPES.USER_CREATE,
        `Création d'un utilisateur: ${userData.email}`,
        {
          email: userData.email,
          role: userData.role
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDeactivateUser = async (userId, userEmail) => {
    try {
      // ... désactivation
      await logAction(
        ACTION_TYPES.USER_DEACTIVATE,
        `Désactivation de l'utilisateur: ${userEmail}`,
        { targetUserId: userId }
      );
    } catch (error) {
      console.error(error);
    }
  };
};
```

## Affichage des Logs

L'interface de journalisation (`/journalisation`) affiche:
- **Statistiques en temps réel**: Total, aujourd'hui, cette semaine, ce mois
- **Filtres**: Par utilisateur, type d'action, période
- **Tableau détaillé**: Date/heure, utilisateur, email, action, type, détails

Les logs se mettent à jour automatiquement grâce à Convex (temps réel).

## Bonnes Pratiques

1. **Toujours logger les actions sensibles**:
   - Connexions/Déconnexions
   - Modifications de profil
   - Opérations sur les documents
   - Actions administratives

2. **Inclure des détails pertinents** dans le paramètre `details`:
   ```javascript
   await logAction(
     ACTION_TYPES.DOCUMENT_VALIDATE,
     "Validation du document",
     {
       documentId: docId,
       documentType: "Attestation",
       studentEmail: "student@example.com"
     }
   );
   ```

3. **Descriptions claires**: Utilisez des messages explicites
   - ✅ "Modification du profil - Changement de numéro de téléphone"
   - ❌ "Update"

4. **Gestion des erreurs**: Enrobez dans try-catch
   ```javascript
   try {
     await logAction(...);
   } catch (error) {
     console.error("Failed to log action:", error);
     // Ne pas bloquer l'action principale si le log échoue
   }
   ```

## Queries Disponibles

### Frontend (via useQuery)
```javascript
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

// Tous les logs
const logs = useQuery(api.actionLogger.getAllActionLogs, { limit: 100 });

// Logs d'un utilisateur
const userLogs = useQuery(api.actionLogger.getActionLogsByUser, { 
  userId: "user_id_here",
  limit: 50 
});

// Logs par type
const loginLogs = useQuery(api.actionLogger.getActionLogsByType, { 
  actionType: "login",
  limit: 30 
});

// Statistiques
const stats = useQuery(api.actionLogger.getActionStatistics);
```

## Sécurité et Conformité RGPD

- Les logs incluent les informations minimales nécessaires
- Conservation recommandée: 6-12 mois
- Accès restreint aux administrateurs
- Traçabilité complète des actions
- Possibilité d'exporter pour audits

## Prochaines Étapes

Pour intégrer complètement:

1. ✅ Ajouter le hook dans `Login.jsx`
2. ✅ Ajouter dans `Profile.jsx` et autres composants de profil
3. ✅ Intégrer dans les formulaires de demande (Convention, Attestation)
4. ✅ Ajouter dans les actions admin (gestion utilisateurs, validation docs)
5. ✅ Logger les uploads/downloads de documents
6. ✅ Intégrer dans STUDENT_PARENT_WEB également
