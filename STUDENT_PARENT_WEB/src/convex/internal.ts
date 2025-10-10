import { internalMutation, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

export const insertActionLog = internalMutation({
  args: {
    userId: v.id("users"),
    action: v.string(),
    details: v.any(),
    timestamp: v.number(),
  },
  handler: async (ctx, { userId, action, details, timestamp }) => {
    await ctx.db.insert("actionLogs", {
      userId,
      action,
      details,
      timestamp,
    });
  },
});

export const logActionInternal = internalAction({
  args: {
    userId: v.id("users"),
    action: v.string(),
    details: v.any(),
  },
  handler: async (ctx, { userId, action, details }) => {
    await ctx.runMutation(insertActionLog as any, {
      userId,
      action,
      details,
      timestamp: Date.now(),
    });
  },
});

export const insertInternshipConvention = internalMutation({
  args: {
    document: v.object({
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
      entrepriseType: v.string(),
      entrepriseNom: v.string(),
      entrepriseAdresse: v.string(),
      entrepriseCodePostal: v.string(),
      entrepriseVille: v.string(),
      entreprisePays: v.string(),
      entrepriseTelephone: v.string(),
      entrepriseFax: v.string(),
      entrepriseSiteWeb: v.string(),
      entrepriseNbEmployes: v.string(),
      representantNom: v.string(),
      representantPrenom: v.string(),
      representantCivilite: v.string(),
      representantFonction: v.string(),
      representantTelephone: v.string(),
      representantEmail: v.string(),
      taches: v.string(),
      environnementTechno: v.string(),
      formations: v.string(),
      objectifs: v.string(),
      nbCollaborateurs: v.string(),
      commentaires: v.string(),
      indemniteMontant: v.string(),
      indemniteMonnaie: v.string(),
      indemniteCommentaire: v.string(),
      userId: v.id("users"),
      userName: v.string(),
      userEmail: v.string(),
      requestType: v.string(),
      timestamp: v.string(),
      status: v.string(),
      createdAt: v.number(),
    }),
  },
  handler: async (ctx, { document }): Promise<Id<"internshipConventions">> => {
    return await ctx.db.insert("internshipConventions", document);
  },
});

export const insertAttestation = internalMutation({
  args: {
    document: v.object({
      nom: v.string(),
      prenom: v.string(),
      dateNaissance: v.string(),
      promotion: v.string(),
      specialite: v.string(),
      anneeScolaire: v.string(),
      modalitePaiement: v.string(),
      fraisPreinscription: v.number(),
      fraisScolarite: v.number(),
      totalPaye: v.number(),
      modePaiement: v.string(),
      date: v.string(),
      userId: v.id("users"),
      email: v.string(),
      userName: v.string(),
      requestType: v.string(),
      status: v.string(),
      createdAt: v.number(),
    }),
  },
  handler: async (ctx, { document }): Promise<Id<"attestations">> => {
    return await ctx.db.insert("attestations", document);
  },
});
