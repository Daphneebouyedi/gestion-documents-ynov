import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to generate an upload URL for files
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Mutation to add a new document
export const addDocument = mutation({
  args: {
    name: v.string(),
    file: v.id("_storage"), // This will be the file storage ID from the client
    student: v.string(),
    year: v.string(),
    docType: v.string(),
    status: v.string(),
    statusType: v.string(),
    condition: v.string(),
    extension: v.string(),
    promotion: v.optional(v.string()),
    specialite: v.optional(v.string()),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Non authentifié. Veuillez vous connecter pour ajouter un document.");
    }
    // Get the URL for the uploaded file
    const url = await ctx.storage.getUrl(args.file);

    if (!url) {
      throw new Error("Failed to get URL for uploaded file");
    }

    const documentId = await ctx.db.insert("documents", {
      name: args.name,
      storageId: args.file, // Store the storage ID
      url: url,
      date: new Date().toLocaleDateString("fr-FR"), // Current date
      student: args.student,
      year: args.year,
      docType: args.docType,
      status: args.status,
      statusType: args.statusType,
      condition: args.condition,
      extension: args.extension,
      promotion: args.promotion,
      specialite: args.specialite,
      reason: args.reason,
    });

    return documentId;
  },
});

// Query to get all documents or filter by a specific student when provided
export const getDocuments = query({
  args: {
    studentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const baseQuery = ctx.db.query("documents");
    const documents = args.studentId
      ? await baseQuery.filter((q) => q.eq(q.field("student"), args.studentId)).collect()
      : await baseQuery.collect();
    // For each document, ensure the URL is still valid or re-generate if needed
    // Convex storage URLs are temporary, so it's best to fetch them when needed
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const url = await ctx.storage.getUrl(doc.storageId);
        return { ...doc, url };
      })
    );
    return documentsWithUrls;
  },
});

// Query to get a single document by ID
export const getDocumentById = query({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    if (!document) {
      return null;
    }
    const url = await ctx.storage.getUrl(document.storageId);
    return { ...document, url };
  },
});

// Mutation to delete a document
export const deleteDocument = mutation({
  args: {
    id: v.id("documents"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Delete the file from Convex storage
    await ctx.storage.delete(args.storageId);
    // Delete the document metadata from the 'documents' table
    await ctx.db.delete(args.id);
  },
});

// Mutation to update a document's metadata
export const updateDocument = mutation({
  args: {
    id: v.id("documents"),
    name: v.string(),
    student: v.string(),
    year: v.string(),
    docType: v.string(),
    status: v.string(),
    statusType: v.string(),
    condition: v.string(),
    extension: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const getTotalDocuments = query({
  handler: async (ctx) => {
    const documents = await ctx.db.query("documents").collect();
    return documents.length;
  },
});

export const getTotalTransferredDocuments = query({
  handler: async (ctx) => {
    const documents = await ctx.db.query("documents").filter((q) => q.eq(q.field("status"), "Validé")).collect();
    return documents.length;
  },
});

export const getUserTransferredDocuments = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const documents = await ctx.db.query("documents").filter((q) => q.eq(q.field("student"), userId)).collect();
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const url = await ctx.storage.getUrl(doc.storageId);
        return { ...doc, url };
      })
    );
    return documentsWithUrls;
  },
});

export const getUserBulletins = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const documents = await ctx.db.query("documents").filter((q) => q.eq(q.field("student"), userId) && q.eq(q.field("docType"), "Bulletin")).collect();
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const url = await ctx.storage.getUrl(doc.storageId);
        return { ...doc, url };
      })
    );
    return documentsWithUrls;
  },
});
