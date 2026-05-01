"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { SaimMark } from "@/components/SaimUI";

export default function GoogleCallback() {
  const { data: session, status } = useSession();
  const { login }                 = useAuth();
  const router                    = useRouter();
  const processed                 = useRef(false);

  useEffect(() => {
    if (status === "loading") return;
    if (processed.current) return;

    if (!session?.user) {
      processed.current = true;
      router.replace("/auth");
      return;
    }

    /* Lire localStorage directement pour éviter la dépendance sur `user` */
    try {
      const raw = localStorage.getItem("saim_user");
      if (raw) {
        const existing = JSON.parse(raw);
        if (existing.setupDone) {
          processed.current = true;
          router.replace("/dashboard");
          return;
        }
      }
    } catch {}

    /* Nouveau compte Google → créer dans AuthContext puis wizard */
    processed.current = true;
    login({
      id:        session.user.email ?? Math.random().toString(36).slice(2),
      name:      session.user.name  ?? "Utilisateur",
      email:     session.user.email ?? undefined,
      avatar:    session.user.image ?? undefined,
      method:    "google",
      credits:   20,
      setupDone: false,
    });
    router.replace("/auth");
  }, [session, status, login, router]);

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
