import { query } from "./_generated/server";
import { v } from "convex/values";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const getUserProfile = query({
  args: {
    authToken: v.string(),
  },
  handler: async (ctx, { authToken }) => {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not set");
    }

    let userId;
    try {
      const decoded = jwt.verify(authToken, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      throw new Error("Invalid or expired authentication token");
    }

    // Fetch user details from the 'users' table
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Return relevant user details (excluding sensitive info like hashed password)
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      promotion: user.promotion,
      specialite: user.specialite,
      dateNaissance: user.dateNaissance,
      phone: user.phone,
      address: user.address,
      country: user.country,
      ville: user.ville,
      // Add other non-sensitive fields you want to expose to the client
    };
  },
});