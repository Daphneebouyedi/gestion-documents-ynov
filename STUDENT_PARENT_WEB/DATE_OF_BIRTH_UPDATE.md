# Mise à Jour de la Date de Naissance

## ✅ Modifications Apportées

### 1. **Schéma de Base de Données**
Ajout du champ `dateOfBirth` dans la table `users` (WEB et STUDENT_PARENT_WEB):
```typescript
dateOfBirth: v.optional(v.string()), // Format: YYYY-MM-DD
```

### 2. **Nouveau Module userProfile.ts**
Création de fonctions Convex pour gérer le profil utilisateur:
- `updateUserProfile` - Mise à jour complète du profil
- `getUserById` - Récupération d'un utilisateur par ID
- `updateDateOfBirth` - Mise à jour uniquement de la date de naissance

### 3. **Bulletin.jsx**
Le composant récupère déjà automatiquement la date de naissance:
```javascript
useEffect(() => {
  if (user) {
    setFormData(prev => ({
      ...prev,
      nom: user.lastName || '',
      prenom: user.firstName || '',
      dateNaissance: user.dateOfBirth || '', // ✅ Récupéré automatiquement
    }));
  }
}, [user]);
```

## 📝 Comment Ajouter/Modifier la Date de Naissance

### Option 1: Directement dans Convex Dashboard
1. Aller sur [Convex Dashboard](https://dashboard.convex.dev)
2. Sélectionner votre projet
3. Onglet "Data" → Table "users"
4. Trouver l'utilisateur (par email: daphnee.bouyedi@ynov.com)
5. Cliquer sur "Edit"
6. Ajouter le champ `dateOfBirth` avec la valeur au format `YYYY-MM-DD`
   Exemple: `"2003-05-15"`
7. Sauvegarder

### Option 2: Via un Composant de Profil
Créer ou modifier un composant de profil pour permettre la mise à jour:

```javascript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const ProfileEdit = () => {
  const updateProfile = useMutation(api.userProfile.updateUserProfile);
  const [dateOfBirth, setDateOfBirth] = useState("");
  
  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    await updateProfile({
      userId,
      dateOfBirth: dateOfBirth, // Format: YYYY-MM-DD
    });
    alert("Date de naissance mise à jour!");
  };
  
  return (
    <div>
      <label>Date de naissance:</label>
      <input 
        type="date" 
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
      />
      <button onClick={handleSubmit}>Sauvegarder</button>
    </div>
  );
};
```

### Option 3: Via Script de Migration
Pour mettre à jour plusieurs utilisateurs en masse, créer un script:

```typescript
// Dans convex/migrations/addDateOfBirth.ts
import { mutation } from "./_generated/server";

export const addDateOfBirthToUsers = mutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    for (const user of users) {
      if (!user.dateOfBirth) {
        // Attribuer une date par défaut ou laisser vide
        await ctx.db.patch(user._id, {
          dateOfBirth: "", // Ou une date par défaut
        });
      }
    }
    
    return { updated: users.length };
  },
});
```

## 🎯 Résultat Attendu

Une fois la date de naissance ajoutée dans la base de données:

1. **Sur `/Demander/bulletin`**:
   - Le champ "Date de naissance" sera automatiquement pré-rempli
   - Le champ est en lecture seule (readOnly)
   - La date provient directement de la base de données

2. **Dans le PDF généré**:
   - La date de naissance apparaîtra au format `DD/MM/YYYY`
   - Exemple: `15/05/2003`

## 📋 Exemple de Données Utilisateur

```json
{
  "_id": "user_xxx",
  "email": "daphnee.bouyedi@ynov.com",
  "firstName": "Daphnée",
  "lastName": "Bouyedi",
  "dateOfBirth": "2003-05-15",
  "promotion": "M1 Data Science",
  "specialite": "Intelligence Artificielle",
  "role": "etudiant",
  "isActive": true
}
```

## 🔄 Après la Modification

1. **Redéployer Convex** (si nécessaire):
   ```bash
   cd STUDENT_PARENT_WEB
   npx convex deploy
   ```

2. **Rafraîchir l'Application**:
   - Déconnexion/Reconnexion
   - Ou rafraîchir la page

3. **Tester**:
   - Aller sur `/Demander/bulletin`
   - Vérifier que la date de naissance est pré-remplie
   - Générer le bulletin et vérifier le PDF

## 📝 Note Importante

Le champ `dateOfBirth` dans Bulletin.jsx utilise:
```javascript
dateNaissance: user.dateOfBirth || ''
```

Si `user.dateOfBirth` est:
- `undefined` ou `null` → Le champ sera vide
- `"2003-05-15"` → Le champ affichera la date

## 🛠️ Dépannage

**Problème**: Le champ date de naissance reste vide
**Solutions**:
1. Vérifier que le champ `dateOfBirth` existe dans Convex Dashboard
2. Vérifier le format: doit être `YYYY-MM-DD`
3. Déconnexion/Reconnexion pour recharger les données utilisateur
4. Vérifier la console browser pour les erreurs

**Problème**: Erreur "dateOfBirth is not defined"
**Solution**: Déployer le nouveau schema sur Convex:
```bash
npx convex deploy
```

## ✅ Checklist

- [x] Schéma `users` mis à jour avec `dateOfBirth`
- [x] Fichier `userProfile.ts` créé
- [x] Bulletin.jsx récupère déjà la date automatiquement
- [ ] Ajouter la date de naissance dans Convex Dashboard
- [ ] Tester la fonctionnalité
- [ ] (Optionnel) Créer une interface de modification du profil
