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
    modalitePaiement: v.optional(v.string()),
    fraisPreinscription: v.optional(v.number()),
    fraisScolarite: v.optional(v.number()),
    totalPaye: v.optional(v.number()),
    modePaiement: v.optional(v.string()),
    moyenne: v.optional(v.string()),
    mention: v.optional(v.string()),
    semestre: v.optional(v.string()),
    type: v.optional(v.string()),
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
      moyenne: args.moyenne,
      mention: args.mention,
      semestre: args.semestre,
      date: args.date,
      userId: args.userId,
      email: args.email || "",
      userName: args.userName || "",
      requestType: args.requestType || "Admin Generated",
      status: args.status || "Generated",
      type: args.type,
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

export const getAttestationById = query({
  args: { id: v.id("attestations") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const deleteAttestation = mutation({
  args: { id: v.id("attestations") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
