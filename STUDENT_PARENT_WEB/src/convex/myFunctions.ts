import { mutation } from "./_generated/server";
import { v } from "convex/values"; // Import v from convex/values

export const logInteraction = mutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Non authentifié. Veuillez vous connecter pour enregistrer l'interaction.");
    }
    // Basic sanitization to prevent XSS
    const sanitizedMessage = args.message.replace(/<script.*?>.*?<\/script>/gis, ''); // Remove script tags
    console.log("Interaction logged:", sanitizedMessage);
    return { success: true, message: "Interaction logged successfully!" };
  },
});