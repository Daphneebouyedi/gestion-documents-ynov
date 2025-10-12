import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useCallback } from "react";

/**
 * Custom hook to log user actions
 * Usage: const logAction = useActionLogger();
 *        logAction("login", "Connexion réussie");
 */
export const useActionLogger = () => {
  const logUserAction = useMutation(api.actionLogger.logUserAction);
  
  const logAction = useCallback(async (actionType, description, details = null) => {
    try {
      const userId = localStorage.getItem("userId");
      const userEmail = localStorage.getItem("userEmail") || "";
      const userName = localStorage.getItem("userName") || "";
      
      if (!userId) {
        console.warn("No userId found, skipping action log");
        return;
      }
      
      await logUserAction({
        userId,
        userEmail,
        userName,
        action: description,
        actionType,
        details,
        ipAddress: undefined, // Can be added later if needed
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error("Failed to log action:", error);
    }
  }, [logUserAction]);
  
  return logAction;
};

/**
 * Action type constants for easy reference
 */
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
