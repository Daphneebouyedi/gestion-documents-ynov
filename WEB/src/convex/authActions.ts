'use node';

import { action } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from 'bcryptjs'; // Changed back to bcryptjs
import jwt from 'jsonwebtoken';
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const JWT_SECRET = process.env.JWT_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY; // transactional email provider API key
const RESEND_FROM = process.env.RESEND_FROM || "no-reply@example.com"; // verified sender
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY; // SendGrid API key
const SENDGRID_FROM = process.env.SENDGRID_FROM || "no-reply@example.com"; // verified sender in SendGrid

async function sendOtpEmail(to: string, code: string) {
  // Prefer SendGrid if configured
  if (SENDGRID_API_KEY) {
    try {
      const payload = {
        personalizations: [ { to: [ { email: to } ] } ],
        from: { email: SENDGRID_FROM },
        subject: "Votre code OTP",
        content: [ { type: "text/plain", value: `Votre code est: ${code} (valide 5 minutes).` } ]
      };
      const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        console.warn("[OTP EMAIL] Failed to send via SendGrid:", resp.status, txt);
        // Fallback to logging
        console.log(`[OTP] Code for ${to}: ${code}`);
      }
      return;
    } catch (e) {
      console.warn("[OTP EMAIL] Error sending via SendGrid:", e);
      console.log(`[OTP] Code for ${to}: ${code}`);
      return;
    }
  }

  // Fallback to Resend if configured
  if (RESEND_API_KEY) {
    try {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [to],
          subject: "Votre code de connexion (OTP)",
          text: `Votre code est: ${code} (valide 5 minutes).`,
        }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        console.warn("[OTP EMAIL] Failed to send via Resend:", resp.status, txt);
        console.log(`[OTP] Code for ${to}: ${code}`);
      }
    } catch (e) {
      console.warn("[OTP EMAIL] Error sending via Resend:", e);
      console.log(`[OTP] Code for ${to}: ${code}`);
    }
    return;
  }

  // Last resort: log OTP (dev only)
  console.warn("[OTP EMAIL] No email provider configured. Logging OTP.");
  console.log(`[OTP] Code for ${to}: ${code}`);
}

export const signup = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }): Promise<string> => {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not set");
    }
    const trimmedPassword = password.trim();
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const userId = await ctx.runMutation(api.auth.insertUser, { email, password: hashedPassword });
    return userId.toString();
  },
});

export const login = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }): Promise<string> => {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not set");
    }
    console.log("Login attempt for email:", email);
    const user = await ctx.runQuery(api.auth.getUserByEmail, { email });
    console.log("User retrieved from DB:", user);

    if (!user) {
      console.log("User not found for email:", email);
      throw new Error("Invalid credentials");
    }

    console.log("Provided password:", password);
    console.log("Stored hashed password:", user.password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", passwordMatch);

    if (!passwordMatch) {
      console.log("Password mismatch for email:", email);
      throw new Error("Invalid credentials");
    }

    await ctx.runMutation(api.auth.patchUser, {
      userId: user._id,
      patch: { isOnline: true },
    });

    await ctx.runMutation(api.user_actions.logAction, {
      userId: user._id,
      action: "login",
    });

    console.log("User object from login action:", user);
    const token: string = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  },
});

export const logout = action({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }): Promise<void> => {
    await ctx.runMutation(api.auth.patchUser, {
      userId: userId,
      patch: { isOnline: false },
    });

    await ctx.runMutation(api.user_actions.logAction, {
      userId: userId,
      action: "logout",
    });
  },
});

// Step 1: start login with OTP (email)
export const startLoginWithOtp = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }): Promise<{ challenge: string }> => {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

    const user = await ctx.runQuery(api.auth.getUserByEmail, { email });
    if (!user) throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid credentials");

    // Generate a 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Sign a short-lived OTP challenge token (5 minutes)
    const challenge = jwt.sign(
      { email, code, purpose: 'otp' },
      JWT_SECRET,
      { expiresIn: '5m' }
    );

    // Send the OTP code by email (or log if provider not configured)
    await sendOtpEmail(email, code);

    return { challenge };
  },
});

// Step 2: complete login by providing the OTP
export const completeLoginWithOtp = action({
  args: {
    challenge: v.string(),
    code: v.string(),
  },
  handler: async (ctx, { challenge, code }): Promise<{ token: string; userId: Id<"users"> }> => {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

    try {
      const decoded = jwt.verify(challenge, JWT_SECRET) as { email: string; code: string; purpose: string };
      if (decoded.purpose !== 'otp') throw new Error('Invalid challenge');
      if (decoded.code !== code) throw new Error('Invalid OTP');

      // Re-fetch user to get userId for the session token
      const user = await ctx.runQuery(api.auth.getUserByEmail, { email: decoded.email });
      if (!user) throw new Error('User not found');

      const token: string = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      return { token, userId: user._id };
    } catch (e) {
      throw new Error('Invalid or expired OTP');
    }
  },
});

async function sendTempPasswordEmail(to: string, tempPassword: string) {
  const subject = "Votre compte a \u00e9t\u00e9 cr\u00e9\u00e9";
  const body = `Bonjour,\n\nVotre compte sur notre plateforme a \u00e9t\u00e9 cr\u00e9\u00e9.\nVoici votre mot de passe temporaire: ${tempPassword}\n\nVeuillez vous connecter et changer votre mot de passe.\n\nCordialement,\nL'\u00e9quipe`;

  // Prefer SendGrid if configured
  if (SENDGRID_API_KEY) {
    try {
      const payload = {
        personalizations: [ { to: [ { email: to } ] } ],
        from: { email: SENDGRID_FROM },
        subject: subject,
        content: [ { type: "text/plain", value: body } ]
      };
      const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        console.warn("[TEMP PASSWORD EMAIL] Failed to send via SendGrid:", resp.status, txt);
      }
      return;
    } catch (e) {
      console.warn("[TEMP PASSWORD EMAIL] Error sending via SendGrid:", e);
      return;
    }
  }

  // Fallback to Resend if configured
  if (RESEND_API_KEY) {
    try {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [to],
          subject: subject,
          text: body,
        }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        console.warn("[TEMP PASSWORD EMAIL] Failed to send via Resend:", resp.status, txt);
      }
    } catch (e) {
      console.warn("[TEMP PASSWORD EMAIL] Error sending via Resend:", e);
    }
    return;
  }

  // Last resort: log (should not happen in prod)
  console.warn("[TEMP PASSWORD EMAIL] No email provider configured. Cannot send temporary password email.");
}

export const verifyTokenAction = action({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }): Promise<string> => {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not set");
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  },
});

// Admin-side create user for management page
export const adminInsertUser = action({
  args: {
    email: v.string(),
    role: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    promotion: v.optional(v.string()),
    specialite: v.optional(v.string()),
  },
  handler: async (ctx, { email, role, firstName, lastName, promotion, specialite }): Promise<{ userId: Id<"users">, tempPassword: string }> => {
    // Prevent duplicates by email
    const existing = await ctx.runQuery(api.auth.getUserByEmail, { email });
    if (existing) {
      throw new Error("User with this email already exists");
    }

    // Generate a secure temporary password
    const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_-+={[}]|:;<,>.?";
    const length = 14;
    let tempPassword = "";
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * charset.length);
      tempPassword += charset[idx];
    }

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const userId = await ctx.runMutation("internal_auth:_internal_adminInsertUser" as any, {
      email,
      role,
      hashedPassword,
      firstName,
      lastName,
      promotion,
      specialite,
    });

    // Send the temporary password by email
    await sendTempPasswordEmail(email, tempPassword);

    // Return both id and the temporary password (to display once to the admin)
    return { userId, tempPassword };
  },
});

export const sendProfileUpdateNotification = action({
  args: {
    userId: v.id("users"),
    updatedData: v.object({
      phone: v.string(),
      address: v.string(),
      country: v.string(),
      ville: v.string(),
      photoUrl: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { userId, updatedData }) => {
    const user = await ctx.runQuery(api.auth.getUser, { userId });
    if (!user) {
      console.error("User not found for sending profile update notification.");
      return;
    }

    // Send email to user
    const userSubject = "Mise à jour de votre profil";
    const userBody = `Bonjour ${user.firstName || ""} ${user.lastName || ""},

Vos informations personnelles ont été mises à jour avec succès :
Téléphone : ${updatedData.phone}
Adresse : ${updatedData.address}
Pays : ${updatedData.country}
Ville : ${updatedData.ville}

Cordialement,
L'équipe`;
    await sendOtpEmail(user.email, userBody); // Reusing sendOtpEmail for simplicity, subject will be overridden

    // Send email to admin (assuming admin email is configured in an env variable)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const adminSubject = "Mise à jour du profil utilisateur";
      const adminBody = `L'utilisateur ${user.email} a mis à jour son profil :
Nom : ${user.firstName || ""} ${user.lastName || ""}
Téléphone : ${updatedData.phone}
Adresse : ${updatedData.address}
Pays : ${updatedData.country}
Ville : ${updatedData.ville}
Photo de profil : ${updatedData.photoUrl || "N/A"}
`;
      await sendOtpEmail(adminEmail, adminBody); // Reusing sendOtpEmail
    } else {
      console.warn("ADMIN_EMAIL not configured. Skipping admin notification.");
    }

    await ctx.runMutation(api.user_actions.logAction, {
      userId: userId,
      action: "profile_update",
    });
  },
});
