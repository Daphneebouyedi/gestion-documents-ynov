window.login = async function(email, password) {
  console.log("JS Interop: Calling Convex login action for", email);
  if (!window.convexClient) {
    console.error("Convex client not initialized.");
    throw new Error("Convex client not initialized.");
  }
  try {
    // Assuming your Convex action is named 'auth:login'
    const token = await window.convexClient.action("authActions:login", { email, password });
    return token;
  } catch (e) {
    console.error("Convex login interop error:", e);
    throw e;
  }
};

window.sendOtpEmail = async function(to, code) {
  console.log("JS Interop: Calling Convex sendOtpEmailAction for", to);
  if (!window.convexClient) {
    console.error("Convex client not initialized.");
    throw new Error("Convex client not initialized.");
  }
  try {
    // Assuming your Convex action is named 'authActions:sendOtpEmailAction'
    await window.convexClient.action("authActions:sendOtpEmailAction", { to, code });
  } catch (e) {
    console.error("Convex sendOtpEmail interop error:", e);
    throw e;
  }
};

window.createAttestation = async function(authToken, formData) {
  console.log("JS Interop: Calling Convex createAttestation action");
  if (!window.convexClient) {
    console.error("Convex client not initialized.");
    throw new Error("Convex client not initialized.");
  }
  try {
    // Assuming your Convex action is named 'attestation:createAttestation'
    const result = await window.convexClient.action("attestation:createAttestation", { authToken, formData });
    return result;
    } catch (e) {
      console.error("Convex createAttestation interop error:", e);
      throw e;
    }
  };
  
  window.getUser = async function(authToken) {
  
    console.log("JS Interop: Calling Convex getUser query");
  
    if (!window.convexClient) {
  
      console.error("Convex client not initialized.");
  
      throw new Error("Convex client not initialized.");
  
    }
  
    try {
  
      // Decode JWT token to extract userId
  
      const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
  
      const userId = decodedToken.userId;
  
  
  
      // Assuming your Convex query is named 'auth:getUser'
  
      const userProfile = await window.convexClient.query("auth:getUser", { userId });
  
      return userProfile;
  
    } catch (e) {
  
      console.error("Convex getUser interop error:", e);
  
      throw e;
  
    }
  
  };
  
  
      window.createConventionRequest = async function(authToken, formData) {
      console.log("JS Interop: Calling Convex createConventionRequest action");
      if (!window.convexClient) {
        console.error("Convex client not initialized.");
        throw new Error("Convex client not initialized.");
      }
      try {
        // Assuming your Convex action is named 'user_actions:createConventionRequest'
        const result = await window.convexClient.action("user_actions:createConventionRequest", { authToken, formData });
        return result;
        } catch (e) {
          console.error("Convex createConventionRequest interop error:", e);
          throw e;
        }
      };
      
      window.updateUserProfile = async function(userId, updatedData) {
        console.log("JS Interop: Calling Convex sendProfileUpdateNotification action");
        if (!window.convexClient) {
          console.error("Convex client not initialized.");
          throw new Error("Convex client not initialized.");
        }
        try {
          // Assuming your Convex action is named 'authActions:sendProfileUpdateNotification'
          await window.convexClient.action("authActions:sendProfileUpdateNotification", { userId, updatedData });
        } catch (e) {
          console.error("Convex updateUserProfile interop error:", e);
          throw e;
        }
      };
      