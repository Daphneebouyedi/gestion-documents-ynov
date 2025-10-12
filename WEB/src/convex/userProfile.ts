import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Update user profile including date of birth
 */
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    ville: v.optional(v.string()),
    country: v.optional(v.string()),
    promotion: v.optional(v.string()),
    specialite: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updateData } = args;
    
    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(userId, cleanData);
    
    return { success: true, message: "Profil mis à jour avec succès" };
  },
});

/**
 * Get user by ID
 */
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

/**
 * Update only date of birth
 */
export const updateDateOfBirth = mutation({
  args: {
    userId: v.id("users"),
    dateOfBirth: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      dateOfBirth: args.dateOfBirth,
    });
    
    return { success: true, message: "Date de naissance mise à jour" };
  },
});
