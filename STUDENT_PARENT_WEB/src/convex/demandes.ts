import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listDemandes = query({
  args: {},
  handler: async (ctx) => {
    const demandes = await ctx.db.query("demandes").collect();
    const demandesWithUrls = await Promise.all(
      demandes.map(async (demande) => {
        const url = demande.attachmentId ? await ctx.storage.getUrl(demande.attachmentId as any) : null;
        const user = await ctx.db.get(demande.userId);
        return { ...demande, attachmentUrl: url, userFirstName: user?.firstName, userLastName: user?.lastName };
      })
    );
    return demandesWithUrls;
  },
});

export const getDemandeById = query({
  args: { id: v.id("demandes") },
  handler: async (ctx, { id }) => {
    const demande = await ctx.db.get(id);
    if (!demande) return null;
    const url = demande.attachmentId ? await ctx.storage.getUrl(demande.attachmentId as any) : null;
    return { ...demande, attachmentUrl: url };
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const addDemande = mutation({
  args: {
    type: v.string(),
    userId: v.id("users"),
    submittedAt: v.optional(v.number()),
    status: v.string(),
    attachmentId: v.optional(v.id("_storage")),
    title: v.optional(v.string()),
    // Champs pour toutes les demandes
    userEmail: v.optional(v.string()),
    userName: v.optional(v.string()),
    nom: v.optional(v.string()),
    prenom: v.optional(v.string()),
    dateNaissance: v.optional(v.string()),
    promotion: v.optional(v.string()),
    specialite: v.optional(v.string()),
    // Champs spécifiques selon le type
    anneeScolaire: v.optional(v.string()),
    date: v.optional(v.string()),
    // Convention de stage
    entreprise: v.optional(v.string()),
    poste: v.optional(v.string()),
    adresseEntreprise: v.optional(v.string()),
    dateDebut: v.optional(v.string()),
    dateFin: v.optional(v.string()),
    duree: v.optional(v.string()),
    // Autres
    details: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const demandeData = {
      ...args,
      submittedAt: args.submittedAt || now,
      createdAt: now,
    };
    const demandeId = await ctx.db.insert("demandes", demandeData);
    return demandeId;
  },
});

export const updateDemande = mutation({
  args: {
    id: v.id("demandes"),
    attachmentId: v.id("_storage"),
  },
  handler: async (ctx, { id, attachmentId }) => {
    await ctx.db.patch(id, { attachmentId });
  },
});

export const deleteDemande = mutation({
  args: { id: v.id("demandes") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Mutation to populate mock data
export const populateMockDemandes = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();
    if (users.length < 7) {
      throw new Error("Not enough users to create mock demandes");
    }

    // Select 7 users (mix of students and parents)
    const selectedUsers = users.slice(0, 7);

    // Types
    const types = ["attestation", "convention_stage", "convention_etude"];

    // Generate timestamps from Monday to today
    const now = Date.now();
    const monday = now - (new Date().getDay() - 1) * 24 * 60 * 60 * 1000;
    const timestamps = [];
    for (let i = 0; i < 7; i++) {
      timestamps.push(monday + i * 24 * 60 * 60 * 1000 + Math.random() * 24 * 60 * 60 * 1000);
    }

    // For each user, create a demande
    for (let i = 0; i < 7; i++) {
      const user = selectedUsers[i];
      const type = types[i % types.length];
      const title = `${type.replace('_', ' ').toUpperCase()} - ${user.firstName} ${user.lastName}`;

      await ctx.db.insert("demandes", {
        type,
        userId: user._id,
        submittedAt: timestamps[i],
        status: "pending",
        title,
      });
    }

    return { success: true, message: "Mock demandes populated. Note: Attachments should be generated using the corresponding forms (Attestation, Convention_Etude, Generer_Convention) with user data and uploaded to Convex storage." };
  },
});
