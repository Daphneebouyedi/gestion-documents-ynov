import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logAction = mutation({
  args: {
    userId: v.id("users"),
    action: v.string(),
  },
  handler: async (ctx, { userId, action }) => {
    console.log("logAction: userId=", userId, "action=", action);
    await ctx.db.insert("user_actions", {
      userId,
      action,
      timestamp: Date.now(),
    });
    console.log("logAction: Action logged.");
  },
});

export const getActions = query({
  handler: async (ctx) => {
    const actions = await ctx.db.query("user_actions").order("desc").take(10);
    const actionsWithUsers = await Promise.all(
      actions.map(async (action) => {
        const user = await ctx.db.get(action.userId);
        return {
          ...action,
          user: user ? user.email : "Unknown user",
        };
      })
    );
    return actionsWithUsers;
  },
});
