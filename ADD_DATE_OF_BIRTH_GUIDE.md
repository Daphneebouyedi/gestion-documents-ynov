# 🎯 Guide Rapide - Ajouter la Date de Naissance

## ⚡ Méthode 1: Via Convex Dashboard (Recommandé)

### Étapes:

1. **Ouvrir Convex Dashboard**
   - Aller sur: https://dashboard.convex.dev
   - Se connecter
   - Sélectionner votre projet

2. **Naviguer vers la table users**
   - Cliquer sur "Data"
   - Sélectionner la table "users"

3. **Trouver Paul IKONDO**
   - Chercher l'email: `paul.ikondo@ynov.com`
   - Ou filtrer par firstName = "Paul"

4. **Modifier l'utilisateur**
   - Cliquer sur la ligne de Paul IKONDO
   - Ajouter le champ `dateOfBirth`
   - Entrer la valeur au format `YYYY-MM-DD`
   - Exemple: `2002-03-15`

5. **Sauvegarder**
   - Cliquer sur "Save"

6. **Tester**
   - Rafraîchir la page http://localhost:3002/Demander/bulletin
   - La date devrait maintenant apparaître

---

## ⚡ Méthode 2: Via Mutation Convex

### Option A: Dans Convex Dashboard Functions

1. Aller dans **Functions** sur Convex Dashboard
2. Sélectionner `updateDateOfBirth:updateUserDateOfBirth`
3. Entrer les arguments:
```json
{
  "email": "paul.ikondo@ynov.com",
  "dateOfBirth": "2002-03-15"
}
```
4. Cliquer sur "Run"

### Option B: Dans votre Code

Créer un composant admin temporaire:

```javascript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

const AddDateOfBirth = () => {
  const updateDOB = useMutation(api.updateDateOfBirth.updateUserDateOfBirth);
  const [email, setEmail] = useState("paul.ikondo@ynov.com");
  const [date, setDate] = useState("2002-03-15");

  const handleSubmit = async () => {
    try {
      const result = await updateDOB({ email, dateOfBirth: date });
      alert(result.message);
    } catch (error) {
      alert("Erreur: " + error.message);
    }
  };

  return (
    <div>
      <h2>Ajouter Date de Naissance</h2>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="date" 
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={handleSubmit}>Mettre à jour</button>
    </div>
  );
};
```

---

## ⚡ Méthode 3: Ajouter Plusieurs Utilisateurs

Si vous avez plusieurs utilisateurs à mettre à jour:

**Dans Convex Dashboard Functions:**
1. Fonction: `updateDateOfBirth:updateMultipleUsersDatesOfBirth`
2. Arguments:
```json
{
  "updates": [
    {
      "email": "paul.ikondo@ynov.com",
      "dateOfBirth": "2002-03-15"
    },
    {
      "email": "daphnee.bouyedi@ynov.com",
      "dateOfBirth": "2003-05-20"
    }
  ]
}
```
3. Cliquer sur "Run"

---

## 📋 Exemple de Dates par Utilisateur

Voici quelques exemples de dates de naissance (fictives):

```json
[
  {
    "email": "paul.ikondo@ynov.com",
    "dateOfBirth": "2002-03-15"
  },
  {
    "email": "daphnee.bouyedi@ynov.com",
    "dateOfBirth": "2003-05-20"
  },
  {
    "email": "alexandre.durieu@ynov.com",
    "dateOfBirth": "1985-08-10"
  },
  {
    "email": "sophie.leblanc@ynov.com",
    "dateOfBirth": "1988-11-25"
  }
]
```

---

## ✅ Vérification

### Vérifier que la date a été ajoutée:

**Dans Convex Dashboard:**
1. Table "users"
2. Chercher l'utilisateur
3. Vérifier que le champ `dateOfBirth` existe et contient une valeur

**Dans l'Application:**
1. Se connecter avec Paul IKONDO
2. Aller sur `/Demander/bulletin`
3. Le champ "Date de naissance" devrait être pré-rempli

---

## 🔍 Voir les Utilisateurs Sans Date de Naissance

**Dans Convex Dashboard Functions:**
1. Fonction: `updateDateOfBirth:getUsersWithoutDateOfBirth`
2. Aucun argument nécessaire
3. Cliquer sur "Run"
4. Voir la liste de tous les utilisateurs sans date

---

## ⚠️ Format Important

**✅ Format Correct:**
- `"2002-03-15"` (YYYY-MM-DD)
- `"2003-05-20"`
- `"1985-08-10"`

**❌ Formats Incorrects:**
- `"15/03/2002"` ❌
- `"15-03-2002"` ❌
- `"2002/03/15"` ❌
- `"03-15-2002"` ❌

---

## 🐛 Dépannage

### Problème: "Utilisateur non trouvé"
**Solution:** Vérifier l'email exact dans la table users

### Problème: "Format de date invalide"
**Solution:** Utiliser le format YYYY-MM-DD (ex: 2002-03-15)

### Problème: La date n'apparaît toujours pas
**Solutions:**
1. Rafraîchir la page
2. Se déconnecter et se reconnecter
3. Vérifier dans Convex Dashboard que la date a bien été sauvegardée
4. Vérifier la console browser pour les erreurs

---

## 🚀 Action Immédiate pour Paul IKONDO

**Commande Rapide (via Convex Dashboard):**

1. Aller sur https://dashboard.convex.dev
2. Functions → `updateDateOfBirth:updateUserDateOfBirth`
3. Copier-coller:
```json
{
  "email": "paul.ikondo@ynov.com",
  "dateOfBirth": "2002-03-15"
}
```
4. Run
5. Rafraîchir http://localhost:3002/Demander/bulletin

**✅ Fait! La date devrait apparaître maintenant.**

---

## 📞 Support

Si le problème persiste:
1. Vérifier que le schema a été déployé (`npx convex deploy`)
2. Vérifier que Convex est en cours d'exécution
3. Consulter la console Convex pour les logs
4. Vérifier le fichier `Bulletin.jsx` (ligne 63)
