# ⚙️ Configuration de la Variable d'Environnement SendGrid

## 🎯 Objectif
Configurer la clé API SendGrid dans Convex pour permettre l'envoi d'emails.

## 📋 Étapes de Configuration

### Option 1: Via Convex Dashboard (Recommandé)

1. **Aller sur Convex Dashboard**
   - URL: https://dashboard.convex.dev
   - Se connecter avec votre compte

2. **Sélectionner votre projet**
   - Choisir le projet de gestion documentaire Ynov

3. **Accéder aux Variables d'Environnement**
   - Dans le menu latéral, cliquer sur **Settings**
   - Puis sur **Environment Variables**

4. **Ajouter la variable SENGDRID**
   - Cliquer sur **Add Environment Variable**
   - **Key (Nom)**: `SENGDRID`
   - **Value (Valeur)**: `SG.YOUR_SENDGRID_API_KEY_HERE`
   - Cliquer sur **Save** ou **Add**

5. **Vérifier la configuration**
   - La variable devrait apparaître dans la liste
   - Status: Active

### Option 2: Via CLI Convex

```bash
# Dans le dossier STUDENT_PARENT_WEB
cd STUDENT_PARENT_WEB

# Définir la variable d'environnement
npx convex env set SENGDRID "SG.YOUR_SENDGRID_API_KEY_HERE"

# Vérifier
npx convex env list
```

## 🚀 Déploiement

Après avoir configuré la variable, déployez les fonctions:

```bash
cd STUDENT_PARENT_WEB
npx convex deploy
```

Répondre **Y** (Yes) quand demandé.

## ✅ Test de la Configuration

### Test 1: Via Convex Dashboard

1. Aller dans **Functions**
2. Chercher `emailService:sendBulletinConfirmationEmail`
3. Entrer des paramètres de test:

```json
{
  "toEmail": "votre-email@example.com",
  "toName": "Test Étudiant",
  "nom": "TEST",
  "prenom": "Étudiant",
  "promotion": "B3 Informatique",
  "specialite": "Développement Web",
  "anneeScolaire": "2024-2025",
  "dateEdition": "12/01/2025"
}
```

4. Cliquer sur **Run**
5. Vérifier:
   - ✅ Résultat: `{ success: true, message: "Email sent successfully" }`
   - ✅ Email reçu dans votre boîte

### Test 2: Via l'Application

1. Lancer l'application STUDENT_PARENT_WEB
```bash
cd STUDENT_PARENT_WEB
npm start
```

2. Se connecter en tant qu'étudiant

3. Aller sur `/Demander/bulletin`

4. Remplir le formulaire

5. Cliquer sur **Demander**

6. Vérifier:
   - ✅ Alert: "Demande envoyée! Email de confirmation envoyé"
   - ✅ Email reçu
   - ✅ Demande visible dans `/demandes`

## 🔍 Dépannage

### Erreur: "Email service not configured"

**Cause**: La variable `SENGDRID` n'est pas définie dans Convex

**Solution**:
1. Vérifier que la variable existe dans Convex Dashboard
2. Le nom doit être exactement `SENGDRID` (sans faute)
3. Redéployer: `npx convex deploy`

### Erreur: "SendGrid API error: 401"

**Cause**: La clé API est invalide

**Solution**:
1. Vérifier que la valeur de `SENGDRID` est correcte
2. La clé doit commencer par `SG.`
3. Pas d'espaces au début/fin de la valeur

### Erreur: "SendGrid API error: 403"

**Cause**: L'email expéditeur n'est pas vérifié

**Solution**:
1. Aller sur SendGrid Dashboard
2. Settings → Sender Authentication
3. Vérifier l'email `noreply@ynov-campus.ma` via Single Sender Verification

### Email non reçu

**Solutions**:
1. Vérifier le dossier Spam/Courrier indésirable
2. Vérifier l'adresse email du destinataire
3. Consulter SendGrid Activity pour voir les logs d'envoi

### La demande est enregistrée mais pas d'email

**C'est normal!** Le code continue même si l'email échoue:
```javascript
try {
  await sendBulletinEmail(...);
} catch (emailError) {
  console.error("Email sending failed:", emailError);
  // Continue even if email fails
}
```

La demande est sauvegardée même si l'email ne part pas.

## 📊 Informations sur la Clé API

**Clé actuelle:**
```
SG.YOUR_SENDGRID_API_KEY_HERE
```

**Compte SendGrid:**
- Plan: Free (100 emails/jour)
- Email vérifié: À configurer via Single Sender

**Email expéditeur configuré:**
- Email: `noreply@ynov-campus.ma`
- Nom: `Ynov Campus Maroc`

## 🎉 Résultat Final

Une fois configuré, chaque demande de bulletin déclenchera:

1. ✅ Enregistrement dans la base de données
2. ✅ Envoi automatique d'un email professionnel
3. ✅ Aperçu email dans les détails de la demande
4. ✅ Message de confirmation à l'utilisateur

**Tout est prêt pour la production!** 🚀

## 📝 Note de Sécurité

⚠️ **Important**: Ne jamais commiter la clé API dans le code source!

- ✅ Utiliser les variables d'environnement Convex
- ❌ Ne pas mettre la clé directement dans le code
- ✅ GitHub bloque automatiquement les pushes contenant des secrets
- ✅ La clé est sécurisée dans Convex

---

**Configuration terminée!** L'envoi d'emails est maintenant opérationnel. 📧
