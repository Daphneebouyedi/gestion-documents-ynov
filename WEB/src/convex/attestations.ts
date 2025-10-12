import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAttestationById = query({
  args: { id: v.id("attestations") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const listAttestations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("attestations").collect();
  },
});
