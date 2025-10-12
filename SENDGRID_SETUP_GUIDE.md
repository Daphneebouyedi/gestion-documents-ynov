# 📧 Configuration SendGrid pour Envoi d'Emails

## 🎯 Objectif
Permettre l'envoi automatique d'emails de confirmation lors des demandes de bulletins de notes.

## 📋 Prérequis

### 1. Créer un Compte SendGrid
1. Aller sur https://sendgrid.com/
2. S'inscrire (plan gratuit: 100 emails/jour)
3. Vérifier votre email

### 2. Créer une API Key
1. Connexion à SendGrid Dashboard
2. Settings → API Keys
3. Cliquer sur "Create API Key"
4. **Nom**: `ynov-campus-bulletin-service`
5. **Permissions**: Full Access (ou Mail Send uniquement)
6. Copier la clé (elle ne sera affichée qu'une fois!)
   - Format: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Vérifier le Domaine d'Envoi (Optionnel mais Recommandé)

**Option A: Domaine Personnalisé**
1. Settings → Sender Authentication → Domain Authentication
2. Ajouter votre domaine (ex: `ynov-campus.ma`)
3. Configurer les DNS comme indiqué

**Option B: Single Sender Verification (Plus Rapide)**
1. Settings → Sender Authentication → Single Sender Verification
2. Email: `noreply@ynov-campus.ma` (ou votre email)
3. Nom: `Ynov Campus Maroc`
4. Vérifier l'email reçu

## ⚙️ Configuration Convex

### Étape 1: Ajouter la Variable d'Environnement

**Via Dashboard Convex:**
1. Aller sur https://dashboard.convex.dev
2. Sélectionner votre projet
3. Settings → Environment Variables
4. Ajouter:
   - **Key**: `SENDGRID_API_KEY`
   - **Value**: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (votre clé)
5. Sauvegarder

**Via CLI Convex:**
```bash
npx convex env set SENDGRID_API_KEY "SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Étape 2: Déployer les Fonctions

```bash
cd STUDENT_PARENT_WEB
npx convex deploy
```

## 🧪 Tester l'Envoi d'Email

### Test 1: Via Convex Dashboard
1. Aller dans **Functions**
2. Trouver `emailService:sendBulletinConfirmationEmail`
3. Entrer les paramètres de test:
```json
{
  "toEmail": "votre-email@example.com",
  "toName": "Test Utilisateur",
  "nom": "IKONDO",
  "prenom": "Paul",
  "promotion": "B3 Informatique",
  "specialite": "Développement Web",
  "anneeScolaire": "2024-2025",
  "dateEdition": "12/01/2025"
}
```
4. Cliquer sur **Run**
5. Vérifier votre boîte email

### Test 2: Via l'Application
1. Se connecter comme étudiant
2. Aller sur `/Demander/bulletin`
3. Remplir le formulaire
4. Cliquer sur "Demander"
5. Vérifier:
   - ✅ Alert de succès
   - ✅ Email reçu dans votre boîte
   - ✅ Demande visible dans `/demandes`

## 📧 Contenu de l'Email

L'email envoyé contient:

### En-tête
- Logo/Bannière Ynov
- Titre: "Confirmation de demande de bulletin"

### Corps
- Salutation personnalisée
- Informations de la demande:
  - Nom, Prénom
  - Promotion, Spécialité
  - Année scolaire
  - Date d'édition
- Message de confirmation avec délai (2 semaines)

### Pied de page
- Signature du responsable administratif
- Coordonnées complètes Ynov Campus
- Informations légales (CNSS, IF, RC, etc.)

## 🎨 Personnalisation de l'Email

### Modifier le Template
Fichier: `STUDENT_PARENT_WEB/src/convex/emailService.ts`

```typescript
const emailContent = `
<!DOCTYPE html>
<html>
...
</html>
`.trim();
```

### Champs Modifiables
- Couleurs (actuellement: #4ECDC4 teal, #003366 bleu)
- Logo (possibilité d'ajouter une image hébergée)
- Texte du message
- Signature
- Footer

## 🔍 Dépannage

### Problème: "Email service not configured"
**Solution:** Vérifier que `SENDGRID_API_KEY` est définie dans Convex Environment Variables

### Problème: "SendGrid API error: 401"
**Solution:** La clé API est invalide ou expirée. Générer une nouvelle clé.

### Problème: "SendGrid API error: 403"
**Solution:** Vérifier que l'email expéditeur est vérifié (Single Sender ou Domain Authentication)

### Problème: Email non reçu
**Solutions:**
1. Vérifier le dossier Spam/Courrier indésirable
2. Vérifier que l'email du destinataire est correct
3. Consulter Activity dans SendGrid Dashboard pour voir les logs

### Problème: "Failed to send confirmation email"
**Solution:** Vérifier la console Convex pour les détails de l'erreur. L'email peut échouer mais la demande est quand même enregistrée.

## 📊 Limites SendGrid (Plan Gratuit)

- **100 emails/jour**
- **1 email expéditeur vérifié** (Single Sender)
- **Pas de domaine personnalisé** (mais Single Sender fonctionne)

Pour plus, passer au plan payant (~$15/mois pour 40,000 emails)

## ✅ Checklist Finale

- [ ] Compte SendGrid créé
- [ ] API Key générée et copiée
- [ ] Single Sender vérifié (email confirmé)
- [ ] Variable `SENDGRID_API_KEY` ajoutée dans Convex
- [ ] Fonctions déployées (`npx convex deploy`)
- [ ] Test réussi via Convex Dashboard
- [ ] Test réussi via l'application
- [ ] Email reçu avec bon contenu

## 🎉 Résultat Final

Lorsqu'un étudiant demande un bulletin:
1. ✅ Formulaire soumis (sans semestre)
2. ✅ Demande enregistrée dans la base
3. ✅ Email automatique envoyé à l'étudiant
4. ✅ Aperçu email dans "Détails" (au lieu de PDF)
5. ✅ Admin voit la demande en temps réel
6. ✅ Aucun PDF généré (traitement manuel par admin)

---

## 📞 Support

En cas de problème:
- SendGrid Docs: https://docs.sendgrid.com/
- Convex Docs: https://docs.convex.dev/
- Support SendGrid: https://support.sendgrid.com/
