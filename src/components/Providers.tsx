"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/lib/auth";
import { LanguageProvider } from "@/lib/i18n";
import SplashScreen from "./SplashScreen";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <AuthProvider>
          <SplashScreen />
          {children}
        </AuthProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
