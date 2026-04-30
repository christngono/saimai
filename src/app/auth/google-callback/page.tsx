"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { SaimMark } from "@/components/SaimUI";

export default function GoogleCallback() {
  const { data: session, status } = useSession();
  const { user, login }           = useAuth();
  const router                    = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.replace("/auth");
      return;
    }

    /* Utilisateur déjà connu → dashboard direct */
    if (user?.setupDone) {
      router.replace("/dashboard");
      return;
    }

    /* Nouveau compte Google → créer dans notre AuthContext */
    const newUser = {
      id:       session.user.email ?? Math.random().toString(36).slice(2),
      name:     session.user.name  ?? "Utilisateur",
      email:    session.user.email ?? undefined,
      avatar:   session.user.image ?? undefined,
      method:   "google" as const,
      credits:  20,
      setupDone: false,
    };
    login(newUser);

    /* /auth détecte setupDone=false → affiche le wizard */
    router.replace("/auth");
  }, [session, status, user, login, router]);

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
      background: "#FBFAF7", fontFamily: "'Inter Tight', system-ui, sans-serif",
    }}>
      <div style={{ animation: "spin 1.2s linear infinite" }}>
        <SaimMark size={36} />
      </div>
      <p style={{ fontSize: 14, color: "#73726C", margin: 0 }}>Connexion Google en cours…</p>
    </div>
  );
}
