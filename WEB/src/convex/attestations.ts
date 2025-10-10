import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const requestAttestation = mutation({
  args: {
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
    userId: v.optional(v.id("users")), // Made optional for admin generation
    email: v.optional(v.string()), // Made optional
    userName: v.optional(v.string()), // Made optional
    requestType: v.optional(v.string()), // Made optional
    status: v.optional(v.string()), // Made optional
  },
  handler: async (ctx, args) => {
    const attestationId = await ctx.db.insert("attestations", {
      nom: args.nom,
      prenom: args.prenom,
      dateNaissance: args.dateNaissance,
      promotion: args.promotion,
      specialite: args.specialite,
      anneeScolaire: args.anneeScolaire,
      modalitePaiement: args.modalitePaiement,
      fraisPreinscription: args.fraisPreinscription,
      fraisScolarite: args.fraisScolarite,
      totalPaye: args.totalPaye,
      modePaiement: args.modePaiement,
      date: args.date,
      userId: args.userId,
      email: args.email || "",
      userName: args.userName || "",
      requestType: args.requestType || "Admin Generated",
      status: args.status || "Generated",
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

export const getUserAttestations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.query("attestations").filter(q => q.eq(q.field("userId"), userId)).collect();
  },
});
