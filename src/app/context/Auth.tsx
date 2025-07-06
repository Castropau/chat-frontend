"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface AuthTokens {
  access: string;
  refresh: string;
}

interface DecodedUser extends JwtPayload {
  email?: string;
  username?: string;
}

interface AuthContextType {
  user: DecodedUser | null;
  setUser: React.Dispatch<React.SetStateAction<DecodedUser | null>>;
  authTokens: AuthTokens | null;
  setAuthTokens: React.Dispatch<React.SetStateAction<AuthTokens | null>>;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (
    email: string,
    username: string,
    password: string,
    password2: string
  ) => Promise<void>;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();

  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() =>
    typeof window !== "undefined" && localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null
  );

  const [user, setUser] = useState<DecodedUser | null>(() =>
    typeof window !== "undefined" && localStorage.getItem("authTokens")
      ? jwt_decode<DecodedUser>(JSON.parse(localStorage.getItem("authTokens")!).access)
      : null
  );

  const [loading, setLoading] = useState(true);

  const loginUser = async (email: string, password: string) => {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode<DecodedUser>(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      router.push("/");

      Swal.fire({
        title: "Login Successful",
        icon: "success",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: true,
      });
    } else {
      Swal.fire({
        title: "Username or password is incorrect",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: true,
      });
    }
  };

  const registerUser = async (
    email: string,
    username: string,
    password: string,
    password2: string
  ) => {
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password, password2 }),
    });

    if (response.status === 201) {
      router.push("/login");

      Swal.fire({
        title: "Registration Successful, Login Now",
        icon: "success",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: true,
      });
    } else {
      Swal.fire({
        title: `An Error Occurred (${response.status})`,
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: true,
      });
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    router.push("/login");

    Swal.fire({
      title: "You have been logged out",
      icon: "success",
      toast: true,
      timer: 6000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
      showCancelButton: true,
    });
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode<DecodedUser>(authTokens.access));
    }
    setLoading(false);
  }, [authTokens]);

  const contextData: AuthContextType = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    loginUser,
    registerUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
