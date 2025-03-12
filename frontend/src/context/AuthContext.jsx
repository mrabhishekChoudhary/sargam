import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Optional: Check token expiry
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            setUser(null);
          } else {
            setUser(decoded);
          }
        } catch (err) {
          console.error("Invalid token on mount:", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false); // Auth state is resolved
    };

    initializeAuth();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;