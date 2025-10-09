import { query } from "./_generated/server";

export const getTotalRequests = query({
  handler: async (ctx) => {
    const attestations = await ctx.db.query("attestations").collect();
    const internshipConventions = await ctx.db.query("internshipConventions").collect();
    return attestations.length + internshipConventions.length;
  },
});