import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Mutation to log an action
export const logUserAction = mutation({
  args: {
    userId: v.id("users"),
    userEmail: v.string(),
    userName: v.optional(v.string()),
    action: v.string(),
    actionType: v.string(),
    details: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actionLogId = await ctx.db.insert("actionLogs", {
      userId: args.userId,
      userEmail: args.userEmail,
      userName: args.userName,
      action: args.action,
      actionType: args.actionType,
      details: args.details,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      timestamp: Date.now(),
    });
    return actionLogId;
  },
});

// Query to get all action logs with pagination
export const getAllActionLogs = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    let query = ctx.db.query("actionLogs").order("desc");
    
    const logs = await query.take(limit);
    
    // Enrich with user data
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        const user = await ctx.db.get(log.userId);
        return {
          ...log,
          _creationTime: log._creationTime,
          userFullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : log.userName || "Unknown",
          userRole: user?.role || "Unknown",
        };
      })
    );
    
    return enrichedLogs;
  },
});

// Query to get action logs by user
export const getActionLogsByUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    const logs = await ctx.db
      .query("actionLogs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
    
    return logs;
  },
});

// Query to get action logs by action type
export const getActionLogsByType = query({
  args: {
    actionType: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    const logs = await ctx.db
      .query("actionLogs")
      .withIndex("by_action_type", (q) => q.eq("actionType", args.actionType))
      .order("desc")
      .take(limit);
    
    // Enrich with user data
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        const user = await ctx.db.get(log.userId);
        return {
          ...log,
          userFullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : log.userName || "Unknown",
          userRole: user?.role || "Unknown",
        };
      })
    );
    
    return enrichedLogs;
  },
});

// Query to get action logs within a date range
export const getActionLogsByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    
    const allLogs = await ctx.db
      .query("actionLogs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(1000); // Get more to filter
    
    const filteredLogs = allLogs
      .filter(log => log.timestamp >= args.startDate && log.timestamp <= args.endDate)
      .slice(0, limit);
    
    // Enrich with user data
    const enrichedLogs = await Promise.all(
      filteredLogs.map(async (log) => {
        const user = await ctx.db.get(log.userId);
        return {
          ...log,
          userFullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : log.userName || "Unknown",
          userRole: user?.role || "Unknown",
        };
      })
    );
    
    return enrichedLogs;
  },
});

// Query to get statistics about actions
export const getActionStatistics = query({
  handler: async (ctx) => {
    const allLogs = await ctx.db.query("actionLogs").collect();
    
    const stats = {
      totalActions: allLogs.length,
      actionsByType: {} as Record<string, number>,
      recentActions: 0,
      actionsToday: 0,
      actionsThisWeek: 0,
      actionsThisMonth: 0,
    };
    
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    
    allLogs.forEach(log => {
      // Count by type
      stats.actionsByType[log.actionType] = (stats.actionsByType[log.actionType] || 0) + 1;
      
      // Count by time period
      if (log.timestamp >= oneDayAgo) stats.actionsToday++;
      if (log.timestamp >= oneWeekAgo) stats.actionsThisWeek++;
      if (log.timestamp >= oneMonthAgo) stats.actionsThisMonth++;
    });
    
    return stats;
  },
});

// Helper action type constants
export const ACTION_TYPES = {
  LOGIN: "login",
  LOGOUT: "logout",
  PROFILE_UPDATE: "profile_update",
  PROFILE_VIEW: "profile_view",
  PASSWORD_CHANGE: "password_change",
  DOCUMENT_REQUEST: "document_request",
  DOCUMENT_UPLOAD: "document_upload",
  DOCUMENT_DOWNLOAD: "document_download",
  DOCUMENT_DELETE: "document_delete",
  DOCUMENT_VALIDATE: "document_validate",
  DOCUMENT_REJECT: "document_reject",
  USER_CREATE: "user_create",
  USER_UPDATE: "user_update",
  USER_DELETE: "user_delete",
  USER_ACTIVATE: "user_activate",
  USER_DEACTIVATE: "user_deactivate",
  CONVENTION_CREATE: "convention_create",
  CONVENTION_UPDATE: "convention_update",
  CONVENTION_DELETE: "convention_delete",
  ATTESTATION_CREATE: "attestation_create",
  ATTESTATION_UPDATE: "attestation_update",
  ATTESTATION_DELETE: "attestation_delete",
  ALERT_CREATE: "alert_create",
  ALERT_READ: "alert_read",
  ALERT_DELETE: "alert_delete",
  SETTINGS_UPDATE: "settings_update",
  TERMS_ACCEPT: "terms_accept",
  SEARCH: "search",
};
