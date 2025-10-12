import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createAlert = mutation({
  args: {
    userId: v.id("users"),
    documentType: v.string(),
    deadline: v.string(),
    status: v.string(), // e.g., 'pending', 'urgent', 'info'
    actionStatus: v.string(), // e.g., 'en attente', 'relancé'
    reminderDate: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    promotion: v.string(),
    specialty: v.string(),
    profile: v.string(), // URL to profile image
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Non authentifié. Veuillez vous connecter.");
    }

    const alertId = await ctx.db.insert("alerts", {
      ...args,
      createdAt: Date.now(),
    });
    return alertId;
  },
});

export const listAlerts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("alerts").collect();
  },
});

export const getUserAlerts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.query("alerts").filter(q => q.eq(q.field("userId"), userId)).collect();
  },
});

export const deleteAlert = mutation({
  args: { id: v.id("alerts") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Non authentifié. Veuillez vous connecter.");
    }

    await ctx.db.delete(id);
  },
});
