import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Load both user data and token from localStorage on app start
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");
        
        console.log("🔄 Loading auth from localStorage:", { savedUser, savedToken });
        
        if (savedUser && savedToken) {
          setUser({
            ...JSON.parse(savedUser),
            token: savedToken
          });
        }
      } catch (error) {
        console.error("❌ Error loading auth data:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    console.log("🔐 Logging in user:", userData);
    setUser(userData);
    // Store user info and token separately
    localStorage.setItem("user", JSON.stringify({
      name: userData.name,
      email: userData.email
    }));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    console.log("🚪 Logging out user");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAuthenticated = () => {
    return !!user && !!user.token;
  };

  // Return loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}