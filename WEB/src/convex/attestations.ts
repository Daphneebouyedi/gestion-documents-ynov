import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const requestAttestation = mutation({
  args: {
    nom: v.string(),
    prenom: v.string(),
    dateNaissance: v.string(),
    promotion: v.string(),
    specialite: v.string(),
    anneeScolaire: v.string(),
    modalitePaiement: v.string(),
    fraisPreinscription: v.number(), // Changed to v.number()
    fraisScolarite: v.number(),     // Changed to v.number()
    totalPaye: v.number(),          // Changed to v.number()
    modePaiement: v.string(),
    date: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Non authentifié. Veuillez vous connecter pour demander une attestation.");
    }

    const attestationId = await ctx.db.insert("attestations", {
      ...args,
      createdAt: Date.now(),
    });

    return attestationId;
  },
});

// List all persisted attestations (for Documents Générés page)
export const listAttestations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("attestations").collect();
  },
});