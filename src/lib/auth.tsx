"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  method: "google" | "email" | "whatsapp";
  credits: number;
  role?: string;
  country?: string;
  setupDone: boolean;
  avatar?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  loaded: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const Ctx = createContext<AuthCtx>({
  user: null, loaded: false,
  login: () => {}, logout: () => {}, updateUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState<AuthUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("saim_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem("saim_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("saim_user");
  };

  const updateUser = (patch: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem("saim_user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ user, loaded, login, logout, updateUser }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() { return useContext(Ctx); }
