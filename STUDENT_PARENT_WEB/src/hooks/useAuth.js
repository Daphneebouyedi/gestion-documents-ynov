import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    // In a real app, you'd want to validate this token with your backend
    // For now, we'll just check for its presence.
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // You would also add login/logout functions here that interact with your backend
  // For now, we'll just provide the status.

  return { isAuthenticated, isLoading };
}
