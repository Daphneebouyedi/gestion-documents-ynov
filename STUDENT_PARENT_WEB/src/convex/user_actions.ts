import { action, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel"; // Import Id type
import { insertInternshipConvention, insertAttestation, logActionInternal, insertActionLog } from "./internal"; // Import internal mutations/actions directly

export const createConventionRequest = action({
  args: {
    authToken: v.string(),
    formData: v.object({
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
      userId: v.id("users"), // Assuming userId is passed and is a Convex Id
      userName: v.string(),
      userEmail: v.string(),
      requestType: v.string(),
      timestamp: v.string(),
    }),
  },
  handler: async (ctx, { authToken, formData }): Promise<string> => {
    // TODO: Verify authToken and extract userId if not already in formData

    // Log the action for the administrator
    await ctx.runAction(logActionInternal as any, {
      userId: formData.userId,
      action: "create_convention_request",
      details: formData,
    });

    // Store the convention request in a new table (e.g., 'internshipConventions')
    const requestId: Id<"internshipConventions"> = await ctx.runMutation(insertInternshipConvention as any, {
      document: {
        ...formData,
        userId: formData.userId,
        status: "Pending",
        createdAt: Date.now(),
      },
    });

    return requestId.toString();
  },
});

export const createAttestation = action({
  args: {
    authToken: v.string(),
    formData: v.object({
      nom: v.string(),
      prenom: v.string(),
      dateNaissance: v.string(),
      promotion: v.string(),
      specialite: v.string(),
      anneeScolaire: v.string(),
      modalitePaiement: v.string(),
      fraisPreinscription: v.string(),
      fraisScolarite: v.string(),
      totalPaye: v.string(),
      modePaiement: v.string(),
      date: v.string(),
      email: v.string(),
      userId: v.id("users"),
      userName: v.string(),
      requestType: v.string(),
      timestamp: v.string(),
    }),
  },
  handler: async (ctx, { authToken, formData }): Promise<string> => {
    // TODO: Verify authToken and extract userId if not already in formData

    // Log the action for the administrator
    await ctx.runAction(api.user_actions.logAction, {
      userId: formData.userId,
      action: "create_attestation_request",
      details: formData,
    });

    // Store the attestation request in the 'attestations' table
    const requestId: Id<"attestations"> = await ctx.runMutation(insertAttestation as any, {
      document: {
        ...formData,
        userId: formData.userId,
        status: "Pending",
        createdAt: Date.now(),
        fraisPreinscription: parseFloat(formData.fraisPreinscription),
        fraisScolarite: parseFloat(formData.fraisScolarite),
        totalPaye: parseFloat(formData.totalPaye),
      },
    });

    return requestId.toString();
  },
});

export const logAction = action({
  args: {
    userId: v.id("users"),
    action: v.string(),
    details: v.any(), // Can be any object with details about the action
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

export const getActions = query({
  handler: async (ctx) => {
    const actions = await ctx.db.query("actionLogs").order("desc").take(10);
    const actionsWithUsers = await Promise.all(
      actions.map(async (action) => {
        const user = await ctx.db.get(action.userId);
        return {
          ...action,
          user: user ? user.email : "Unknown user",
        };
      })
    );
    return actionsWithUsers;
  },
});
