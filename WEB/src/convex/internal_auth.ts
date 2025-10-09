import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Internal mutation to insert a user (called by the action)
export const _internal_adminInsertUser = internalMutation({
  args: {
    email: v.string(),
    role: v.string(),
    hashedPassword: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    promotion: v.optional(v.string()),
    specialite: v.optional(v.string()),
  },
  handler: async (ctx, { email, role, hashedPassword, firstName, lastName, promotion, specialite }) => {
    const userId = await ctx.db.insert("users", {
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      promotion,
      specialite,
      firstLogin: true,
    });
    return userId;
  },
});
