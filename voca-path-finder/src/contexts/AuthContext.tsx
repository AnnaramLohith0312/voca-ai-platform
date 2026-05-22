// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, AuthUser } from "@/services/authService";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authService.signInWithEmail(email, password);
    setUser(result.user);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const result = await authService.signUpWithEmail(email, password, displayName);
    setUser(result.user);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const sendPasswordReset = async (email: string) => {
    await authService.sendPasswordResetEmail(email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, sendPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
