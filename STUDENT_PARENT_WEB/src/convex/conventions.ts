import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const requestConvention = mutation({
  args: {
    dateDebut: v.string(),
    dateFin: v.string(),
    stagiaireNom: v.string(),
    stagiairePrenom: v.string(),
    stagiaireCivilite: v.string(),
    stagiaireAdresse: v.string(),
    stagiaireCodePostal: v.string(),
    stagiaireVille: v.string(),
    stagiaireTelephone: v.string(),
    stagiaireEmail: v.string(),
    entrepriseType: v.optional(v.string()),
    entrepriseNom: v.string(),
    entrepriseAdresse: v.string(),
    entrepriseCodePostal: v.string(),
    entrepriseVille: v.string(),
    entreprisePays: v.optional(v.string()),
    entrepriseTelephone: v.optional(v.string()),
    entrepriseFax: v.optional(v.string()),
    entrepriseSiteWeb: v.optional(v.string()),
    entrepriseNbEmployes: v.optional(v.number()),
    representantNom: v.string(),
    representantPrenom: v.string(),
    representantCivilite: v.string(),
    representantFonction: v.optional(v.string()),
    representantTelephone: v.optional(v.string()),
    representantEmail: v.optional(v.string()),
    taches: v.optional(v.string()),
    environnementTechno: v.optional(v.string()),
    formations: v.optional(v.string()),
    objectifs: v.optional(v.string()),
    nbCollaborateurs: v.optional(v.string()),
    commentaires: v.optional(v.string()),
    indemniteMontant: v.optional(v.number()),
    indemniteMonnaie: v.optional(v.string()),
    indemniteCommentaire: v.optional(v.string()),
    // Add any other fields you deem necessary, e.g., userId
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Non authentifié. Veuillez vous connecter pour demander une convention.");
    }
    
    console.log("Convention Request Received:", args);

   

    return { success: true, message: "Convention request received successfully!" };
  },
});

// Create and persist a full convention entry
export const createConvention = mutation({
  args: {
    // État civil du candidat
    civiliteCandidat: v.string(),
    nomCandidat: v.string(),
    prenomCandidat: v.string(),
    dateNaissanceCandidat: v.string(),
    lieuNaissanceCandidat: v.string(),
    paysCandidat: v.string(),
    nationaliteCandidat: v.string(),
    adresseCandidat: v.string(),
    villeCandidat: v.string(),
    codePostalCandidat: v.string(),
    telephoneCandidat: v.string(),
    portableCandidat: v.optional(v.string()),
    emailCandidat: v.string(),
    idCandidat: v.string(),
    photoCandidatStorageId: v.optional(v.id("_storage")),

    // Responsable légal
    civiliteRespLegal: v.string(),
    qualiteRespLegal: v.string(),
    nomRespLegal: v.string(),
    prenomRespLegal: v.string(),
    dateNaissanceRespLegal: v.string(),
    lieuNaissanceRespLegal: v.string(),
    paysRespLegal: v.string(),
    nationaliteRespLegal: v.string(),
    adresseRespLegal: v.string(),
    villeRespLegal: v.string(),
    codePostalRespLegal: v.string(),
    telephoneRespLegal: v.string(),
    portableRespLegal: v.optional(v.string()),
    emailRespLegal: v.string(),
    idRespLegal: v.string(),

    // Responsable financier
    civiliteRespFin: v.string(),
    qualiteRespFin: v.string(),
    nomRespFin: v.string(),
    prenomRespFin: v.string(),
    dateNaissanceRespFin: v.string(),
    lieuNaissanceRespFin: v.string(),
    paysRespFin: v.string(),
    nationaliteRespFin: v.string(),
    adresseRespFin: v.string(),
    villeRespFin: v.string(),
    codePostalRespFin: v.string(),
    telephoneRespFin: v.string(),
    emailRespFin: v.string(),
    idRespFin: v.string(),

    // Études antérieures
    etudes: v.array(v.object({
      annee: v.string(),
      etudeSuivie: v.string(),
      etablissement: v.string(),
      diplome: v.string(),
      dateObtention: v.string(),
    })),

    commentaire: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Non authentifié. Veuillez vous connecter.");
    }

    const conventionId = await ctx.db.insert("conventions", {
      ...args,
      createdAt: Date.now(),
    });
    return conventionId;
  },
});

// List all persisted conventions (for Documents Générés page)
export const listConventions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("conventions").collect();
  },
});

// Internship (stage) convention persistence and listing
export const createInternshipConvention = mutation({
  args: {
    dateDebut: v.string(),
    dateFin: v.string(),
    stagiaireNom: v.string(),
    stagiairePrenom: v.string(),
    stagiaireCivilite: v.string(),
    stagiaireAdresse: v.string(),
    stagiaireCodePostal: v.string(),
    stagiaireVille: v.string(),
    stagiaireTelephone: v.string(),
    stagiaireEmail: v.string(),
    entrepriseType: v.optional(v.string()),
    entrepriseNom: v.string(),
    entrepriseAdresse: v.string(),
    entrepriseCodePostal: v.string(),
    entrepriseVille: v.string(),
    entreprisePays: v.optional(v.string()),
    entrepriseTelephone: v.optional(v.string()),
    entrepriseFax: v.optional(v.string()),
    entrepriseSiteWeb: v.optional(v.string()),
    entrepriseNbEmployes: v.optional(v.string()),
    representantNom: v.string(),
    representantPrenom: v.string(),
    representantCivilite: v.string(),
    representantFonction: v.optional(v.string()),
    representantTelephone: v.optional(v.string()),
    representantEmail: v.optional(v.string()),
    taches: v.optional(v.string()),
    environnementTechno: v.optional(v.string()),
    formations: v.optional(v.string()),
    objectifs: v.optional(v.string()),
    nbCollaborateurs: v.optional(v.string()),
    commentaires: v.optional(v.string()),
    indemniteMontant: v.optional(v.string()),
    indemniteMonnaie: v.optional(v.string()),
    indemniteCommentaire: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Non authentifié. Veuillez vous connecter.");
    }
    const id = await ctx.db.insert("internshipConventions", {
      ...args,
      userId: identity.subject as any,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const listInternshipConventions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("internshipConventions").collect();
  },
});

export const getUserInternshipConventions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.query("internshipConventions").filter(q => q.eq(q.field("userId"), userId)).collect();
  },
});

export const getUserConventions = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db.query("conventions").filter(q => q.eq(q.field("idCandidat"), userId)).collect();
  },
});
