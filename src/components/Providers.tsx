"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/lib/auth";
import SplashScreen from "./SplashScreen";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <SplashScreen />
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
