import { query, mutation, action, internalMutation } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import bcrypt from "bcryptjs";

export const insertUser = mutation({
  args: {
    email: v.string(),
    password: v.string(), // This will now be the hashed password
  },
  handler: async (ctx, { email, password }) => {
    console.log("insertUser received password:", password);
    const userId = await ctx.db.insert("users", { email, password });
    return userId;
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .unique();
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    promotion: v.optional(v.string()),
    specialite: v.optional(v.string()),
  },
  handler: async (ctx, { userId, firstName, lastName, email, role, promotion, specialite }) => {
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const updates: { [key: string]: any } = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;
    if (promotion !== undefined) updates.promotion = promotion;
    if (specialite !== undefined) updates.specialite = specialite;

    await ctx.db.patch(userId, updates);
    return ctx.db.get(userId);
  },
});

export const getUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// List all users (for management page)
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});



// Admin-side delete user
export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    await ctx.db.delete(userId);
    return true;
  },
});

export const patchUser = mutation({
  args: {
    userId: v.id("users"),
    patch: v.any(),
  },
  handler: async (ctx, { userId, patch }) => {
    await ctx.db.patch(userId, patch);
  },
});

export const acceptTerms = mutation({
  args: {
    version: v.string(),
    // WARNING: This is an insecure workaround. The user ID should be taken from the authentication context.
    userId: v.id("users"),
  },
  handler: async (ctx, { version, userId }) => {
    // The original, secure code was commented out for this workaround:
    // const userIdentity = await ctx.auth.getUserIdentity();
    // if (!userIdentity) {
    //   throw new Error("Not authenticated");
    // }
    // const userId = userIdentity.subject; // Assuming subject is the userId

    await ctx.db.patch(userId, { termsAcceptedVersion: version });
  },
});

export const getTotalUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.length;
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    phone: v.string(),
    address: v.string(),
    country: v.string(),
    ville: v.string(),
    photoUrl: v.optional(v.string()),
    profileComplete: v.boolean(),
  },
  handler: async (ctx, args) => {
    console.log("updateUserProfile: userId=", args.userId, "data=", args);
    const { userId, ...rest } = args;
    await ctx.db.patch(userId, rest);
    console.log("updateUserProfile: User patched.");
  },
});
