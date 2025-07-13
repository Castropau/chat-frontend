"use client";

import { createContext, useContext, useEffect, useState } from "react";
// import jwtDecode from "jwt-decode"; // <-- no curly braces here
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id: number;
  username: string;
  full_name: string;
  email?: string;
  image?: string;
}

interface AuthContextType {
  userEmail: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userEmail: null,
  setToken: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const setToken = (token: string) => {
    Cookies.set("token", token);
    localStorage.setItem("authTokens", token);
    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUserEmail(decoded.email || decoded.username || null);
    } catch (e) {
      console.error("Invalid token", e);
      setUserEmail(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("authTokens");
    Cookies.remove("token");
    setUserEmail(null);
  };

  // On initial load, check if token exists and decode
  useEffect(() => {
    const token = localStorage.getItem("authTokens") || Cookies.get("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserEmail(decoded.email || decoded.username || null);
      } catch (e) {
        console.error("Invalid token", e);
        setUserEmail(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userEmail, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
