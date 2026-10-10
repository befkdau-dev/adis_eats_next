// app/context/AuthContext.js
"use client";

import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser ?? null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoaded: true,
        isLoginOpen,
        openLogin,
        closeLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
