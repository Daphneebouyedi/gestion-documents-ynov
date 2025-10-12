import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Script pour ajouter/mettre à jour la date de naissance des utilisateurs
 * À exécuter via Convex Dashboard ou un composant admin
 */
export const updateUserDateOfBirth = mutation({
  args: {
    email: v.string(),
    dateOfBirth: v.string(), // Format: YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    // Trouver l'utilisateur par email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error(`Utilisateur avec l'email ${args.email} non trouvé`);
    }

    // Valider le format de la date (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(args.dateOfBirth)) {
      throw new Error("Format de date invalide. Utilisez YYYY-MM-DD (ex: 2003-05-15)");
    }

    // Mettre à jour la date de naissance
    await ctx.db.patch(user._id, {
      dateOfBirth: args.dateOfBirth,
    });

    return {
      success: true,
      message: `Date de naissance mise à jour pour ${user.firstName} ${user.lastName}`,
      userId: user._id,
      dateOfBirth: args.dateOfBirth,
    };
  },
});

/**
 * Script pour ajouter les dates de naissance de plusieurs utilisateurs
 */
export const updateMultipleUsersDatesOfBirth = mutation({
  args: {
    updates: v.array(
      v.object({
        email: v.string(),
        dateOfBirth: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];

    for (const update of args.updates) {
      try {
        const user = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", update.email))
          .first();

        if (!user) {
          results.push({
            email: update.email,
            success: false,
            error: "Utilisateur non trouvé",
          });
          continue;
        }

        await ctx.db.patch(user._id, {
          dateOfBirth: update.dateOfBirth,
        });

        results.push({
          email: update.email,
          success: true,
          name: `${user.firstName} ${user.lastName}`,
        });
      } catch (error) {
        results.push({
          email: update.email,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      total: args.updates.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  },
});

/**
 * Obtenir tous les utilisateurs sans date de naissance
 */
export const getUsersWithoutDateOfBirth = mutation({
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    
    const usersWithoutDOB = allUsers
      .filter((user) => !user.dateOfBirth)
      .map((user) => ({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }));

    return {
      count: usersWithoutDOB.length,
      users: usersWithoutDOB,
    };
  },
});
