import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Script pour peupler l'historique avec des actions antérieures
 * À exécuter une seule fois pour initialiser les données historiques
 */
export const seedHistoricalActions = mutation({
  args: {},
  handler: async (ctx) => {
    // Vérifier si des logs existent déjà
    const existingLogs = await ctx.db.query("actionLogs").take(1);
    if (existingLogs.length > 0) {
      console.log("Historical actions already seeded");
      return { success: false, message: "Historical data already exists" };
    }

    // Récupérer les utilisateurs existants
    const users = await ctx.db.query("users").collect();
    
    // Si pas d'utilisateurs, créer des utilisateurs fictifs pour l'historique
    let paulIkondo = users.find(u => u.email === "paul.ikondo@ynov.com");
    let daphneeBouyedi = users.find(u => u.email === "daphnee.bouyedi@ynov.com");
    let alexandreDurieu = users.find(u => u.email === "alexandre.durieu@ynov.com");
    let sophieLeblanc = users.find(u => u.email === "sophie.leblanc@ynov.com");
    
    // Créer Paul Ikondo s'il n'existe pas
    if (!paulIkondo) {
      const paulId = await ctx.db.insert("users", {
        email: "paul.ikondo@ynov.com",
        password: "hashed_password", // À remplacer par un vrai hash
        firstName: "Paul",
        lastName: "Ikondo",
        role: "etudiant",
        promotion: "B3 Informatique",
        specialite: "Développement Web",
        isActive: true,
        isOnline: false,
        profileComplete: true,
      });
      paulIkondo = await ctx.db.get(paulId);
    }
    
    // Créer Daphnée Bouyedi s'il n'existe pas
    if (!daphneeBouyedi) {
      const daphneeId = await ctx.db.insert("users", {
        email: "daphnee.bouyedi@ynov.com",
        password: "hashed_password",
        firstName: "Daphnée",
        lastName: "Bouyedi",
        role: "etudiant",
        promotion: "M1 Data Science",
        specialite: "Intelligence Artificielle",
        isActive: true,
        isOnline: false,
        profileComplete: true,
      });
      daphneeBouyedi = await ctx.db.get(daphneeId);
    }
    
    // Créer Alexandre Durieu (admin) s'il n'existe pas
    if (!alexandreDurieu) {
      const alexandreId = await ctx.db.insert("users", {
        email: "alexandre.durieu@ynov.com",
        password: "hashed_password",
        firstName: "Alexandre",
        lastName: "Durieu",
        role: "admin",
        isActive: true,
        isOnline: false,
        profileComplete: true,
      });
      alexandreDurieu = await ctx.db.get(alexandreId);
    }
    
    // Créer Sophie Leblanc (admin) si elle n'existe pas
    if (!sophieLeblanc) {
      const sophieId = await ctx.db.insert("users", {
        email: "sophie.leblanc@ynov.com",
        password: "hashed_password",
        firstName: "Sophie",
        lastName: "Leblanc",
        role: "admin",
        isActive: true,
        isOnline: false,
        profileComplete: true,
      });
      sophieLeblanc = await ctx.db.get(sophieId);
    }

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    // Actions historiques pour Paul Ikondo
    const paulActions = [
      // Il y a 3 mois
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Création de compte",
        actionType: "user_create",
        details: { source: "inscription", promotion: "B3 Informatique" },
        timestamp: now - 3 * oneMonth,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Première connexion",
        actionType: "login",
        details: { firstLogin: true },
        timestamp: now - 3 * oneMonth + oneHour,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Acceptation des CGU",
        actionType: "terms_accept",
        details: { version: "1.0" },
        timestamp: now - 3 * oneMonth + 2 * oneHour,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Modification du profil - Ajout photo",
        actionType: "profile_update",
        details: { fields: ["photoUrl"] },
        timestamp: now - 3 * oneMonth + 3 * oneHour,
      },
      // Il y a 2 mois
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Demande d'attestation de scolarité",
        actionType: "attestation_create",
        details: { type: "Attestation de scolarité", anneeScolaire: "2024-2025" },
        timestamp: now - 2 * oneMonth,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Connexion",
        actionType: "login",
        timestamp: now - 2 * oneMonth + 5 * oneDay,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Téléchargement d'attestation de scolarité",
        actionType: "document_download",
        details: { documentName: "Attestation_Scolarite_2024.pdf" },
        timestamp: now - 2 * oneMonth + 6 * oneDay,
      },
      // Il y a 1 mois
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Demande de convention de stage",
        actionType: "convention_create",
        details: { 
          entreprise: "TechCorp Solutions",
          dateDebut: "2025-01-15",
          dateFin: "2025-06-30"
        },
        timestamp: now - oneMonth,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Modification du profil - Numéro de téléphone",
        actionType: "profile_update",
        details: { fields: ["phone"] },
        timestamp: now - oneMonth + 3 * oneDay,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Connexion",
        actionType: "login",
        timestamp: now - oneMonth + 10 * oneDay,
      },
      // Il y a 2 semaines
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Téléversement de document - CV",
        actionType: "document_upload",
        details: { fileName: "CV_Paul_Ikondo.pdf", fileSize: 245000 },
        timestamp: now - 2 * oneWeek,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Connexion",
        actionType: "login",
        timestamp: now - oneWeek,
      },
      // Cette semaine
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Consultation du profil",
        actionType: "profile_view",
        timestamp: now - 5 * oneDay,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Demande d'attestation de réussite",
        actionType: "attestation_create",
        details: { type: "Attestation de réussite", diplome: "B3 Informatique" },
        timestamp: now - 3 * oneDay,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Connexion",
        actionType: "login",
        timestamp: now - 2 * oneDay,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Modification du profil - Adresse",
        actionType: "profile_update",
        details: { fields: ["address", "ville", "codePostal"] },
        timestamp: now - oneDay,
      },
      {
        userId: paulIkondo._id,
        userEmail: "paul.ikondo@ynov.com",
        userName: "Paul Ikondo",
        action: "Connexion",
        actionType: "login",
        timestamp: now - 12 * oneHour,
      },
    ];

    // Actions historiques pour Daphnée Bouyedi
    const daphneeActions = [
      // Il y a 2 mois
      {
        userId: daphneeBouyedi._id,
        userEmail: "daphnee.bouyedi@ynov.com",
        userName: "Daphnée Bouyedi",
        action: "Connexion",
        actionType: "login",
        timestamp: now - 2 * oneMonth,
      },
      {
        userId: daphneeBouyedi._id,
        userEmail: "daphnee.bouyedi@ynov.com",
        userName: "Daphnée Bouyedi",
        action: "Demande de bulletin de notes",
        actionType: "document_request",
        details: { documentType: "Bulletin", semestre: "S1" },
        timestamp: now - 2 * oneMonth + oneDay,
      },
      // Il y a 1 mois
      {
        userId: daphneeBouyedi._id,
        userEmail: "daphnee.bouyedi@ynov.com",
        userName: "Daphnée Bouyedi",
        action: "Connexion",
        actionType: "login",
        timestamp: now - oneMonth,
      },
      {
        userId: daphneeBouyedi._id,
        userEmail: "daphnee.bouyedi@ynov.com",
        userName: "Daphnée Bouyedi",
        action: "Modification du profil",
        actionType: "profile_update",
        details: { fields: ["photoUrl", "phone"] },
        timestamp: now - oneMonth + 2 * oneDay,
      },
      // Cette semaine
      {
        userId: daphneeBouyedi._id,
        userEmail: "daphnee.bouyedi@ynov.com",
        userName: "Daphnée Bouyedi",
        action: "Connexion",
        actionType: "login",
        timestamp: now - 6 * oneDay,
      },
      {
        userId: daphneeBouyedi._id,
        userEmail: "daphnee.bouyedi@ynov.com",
        userName: "Daphnée Bouyedi",
        action: "Téléchargement de bulletin",
        actionType: "document_download",
        details: { documentName: "Bulletin_S1_2024.pdf" },
        timestamp: now - 4 * oneDay,
      },
      {
        userId: daphneeBouyedi._id,
        userEmail: "daphnee.bouyedi@ynov.com",
        userName: "Daphnée Bouyedi",
        action: "Connexion",
        actionType: "login",
        timestamp: now - 2 * oneDay,
      },
      // Aujourd'hui
      {
        userId: daphneeBouyedi._id,
        userEmail: "daphnee.bouyedi@ynov.com",
        userName: "Daphnée Bouyedi",
        action: "Connexion",
        actionType: "login",
        timestamp: now - 8 * oneHour,
      },
      {
        userId: daphneeBouyedi._id,
        userEmail: "daphnee.bouyedi@ynov.com",
        userName: "Daphnée Bouyedi",
        action: "Demande de convention d'études",
        actionType: "convention_create",
        details: { 
          entreprise: "DataLab Analytics",
          dateDebut: "2025-02-01"
        },
        timestamp: now - 6 * oneHour,
      },
    ];

    // Actions admin - Alexandre Durieu
    const alexandreActions = [
      {
        userId: alexandreDurieu._id,
        userEmail: "alexandre.durieu@ynov.com",
        userName: "Alexandre Durieu",
        action: "Connexion administrateur",
        actionType: "login",
        timestamp: now - 3 * oneMonth,
      },
      {
        userId: alexandreDurieu._id,
        userEmail: "alexandre.durieu@ynov.com",
        userName: "Alexandre Durieu",
        action: "Création d'utilisateur - Paul Ikondo",
        actionType: "user_create",
        details: { targetUser: "paul.ikondo@ynov.com", role: "etudiant" },
        timestamp: now - 3 * oneMonth + oneHour,
      },
      {
        userId: alexandreDurieu._id,
        userEmail: "alexandre.durieu@ynov.com",
        userName: "Alexandre Durieu",
        action: "Validation de convention de stage",
        actionType: "document_validate",
        details: { 
          documentType: "Convention de stage",
          student: "Paul Ikondo",
          entreprise: "TechCorp Solutions"
        },
        timestamp: now - oneMonth + 5 * oneDay,
      },
      {
        userId: alexandreDurieu._id,
        userEmail: "alexandre.durieu@ynov.com",
        userName: "Alexandre Durieu",
        action: "Connexion",
        actionType: "login",
        timestamp: now - 2 * oneWeek,
      },
      {
        userId: alexandreDurieu._id,
        userEmail: "alexandre.durieu@ynov.com",
        userName: "Alexandre Durieu",
        action: "Validation d'attestation de scolarité",
        actionType: "document_validate",
        details: { 
          documentType: "Attestation",
          student: "Paul Ikondo"
        },
        timestamp: now - oneWeek,
      },
      {
        userId: alexandreDurieu._id,
        userEmail: "alexandre.durieu@ynov.com",
        userName: "Alexandre Durieu",
        action: "Connexion",
        actionType: "login",
        timestamp: now - 3 * oneDay,
      },
      {
        userId: alexandreDurieu._id,
        userEmail: "alexandre.durieu@ynov.com",
        userName: "Alexandre Durieu",
        action: "Consultation des statistiques",
        actionType: "settings_update",
        timestamp: now - oneDay,
      },
    ];

    // Actions admin - Sophie Leblanc
    const sophieActions = [
      {
        userId: sophieLeblanc._id,
        userEmail: "sophie.leblanc@ynov.com",
        userName: "Sophie Leblanc",
        action: "Connexion administrateur",
        actionType: "login",
        timestamp: now - 2 * oneMonth,
      },
      {
        userId: sophieLeblanc._id,
        userEmail: "sophie.leblanc@ynov.com",
        userName: "Sophie Leblanc",
        action: "Validation de bulletin de notes",
        actionType: "document_validate",
        details: { 
          documentType: "Bulletin",
          student: "Daphnée Bouyedi",
          semestre: "S1"
        },
        timestamp: now - 2 * oneMonth + 3 * oneDay,
      },
      {
        userId: sophieLeblanc._id,
        userEmail: "sophie.leblanc@ynov.com",
        userName: "Sophie Leblanc",
        action: "Connexion",
        actionType: "login",
        timestamp: now - oneMonth,
      },
      {
        userId: sophieLeblanc._id,
        userEmail: "sophie.leblanc@ynov.com",
        userName: "Sophie Leblanc",
        action: "Création d'alerte - Début examens",
        actionType: "alert_create",
        details: { 
          titre: "Début des examens",
          message: "Les examens du semestre 1 débutent le 15 janvier"
        },
        timestamp: now - oneMonth + 5 * oneDay,
      },
      {
        userId: sophieLeblanc._id,
        userEmail: "sophie.leblanc@ynov.com",
        userName: "Sophie Leblanc",
        action: "Connexion",
        actionType: "login",
        timestamp: now - oneWeek,
      },
      {
        userId: sophieLeblanc._id,
        userEmail: "sophie.leblanc@ynov.com",
        userName: "Sophie Leblanc",
        action: "Modification des paramètres système",
        actionType: "settings_update",
        details: { section: "Notifications" },
        timestamp: now - 5 * oneDay,
      },
      {
        userId: sophieLeblanc._id,
        userEmail: "sophie.leblanc@ynov.com",
        userName: "Sophie Leblanc",
        action: "Connexion",
        actionType: "login",
        timestamp: now - 2 * oneDay,
      },
    ];

    // Insérer toutes les actions dans la base de données
    const allActions = [
      ...paulActions,
      ...daphneeActions,
      ...alexandreActions,
      ...sophieActions,
    ];

    let insertedCount = 0;
    for (const action of allActions) {
      await ctx.db.insert("actionLogs", action);
      insertedCount++;
    }

    return {
      success: true,
      message: `Successfully seeded ${insertedCount} historical actions`,
      details: {
        paulActions: paulActions.length,
        daphneeActions: daphneeActions.length,
        alexandreActions: alexandreActions.length,
        sophieActions: sophieActions.length,
      }
    };
  },
});
