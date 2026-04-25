"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, Globe, ChevronRight, ArrowRight } from "lucide-react";

const TASKS_ANIM = [
  {
    icon: "🧾",
    label: "Fiscalité",
    question: "Quel est mon IGS pour un CA de 8 500 000 FCFA ?",
    answer: "Vous êtes en Classe 5 — 100 000 FCFA/an, soit 25 000 FCFA par trimestre.",
    color: "#10b981",
  },
  {
    icon: "💼",
    label: "Comptabilité",
    question: "Génère ma facture n°2025-047 avec TVA 19,25%",
    answer: "Facture générée avec en-tête ACME Sarl · Montant HT 450 000 · TVA 86 625 FCFA.",
    color: "#6366f1",
  },
  {
    icon: "👥",
    label: "Ressources humaines",
    question: "Calcule la paie de mars pour 8 employés",
    answer: "Masse salariale : 3 840 000 FCFA · CNPS : 307 200 FCFA · Net à payer : 3 532 800 FCFA.",
    color: "#f59e0b",
  },
  {
    icon: "📣",
    label: "Marketing & contenus",
    question: "Crée un post LinkedIn pour notre lancement",
    answer: "« Nous sommes fiers d'annoncer le lancement de notre nouvelle gamme… » — 3 variantes générées.",
    color: "#ec4899",
  },
];

const NAV_FR = ["À propos", "Services", "Contacts"];
const NAV_EN = ["About", "Services", "Contact"];

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [taskIdx, setTaskIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setTaskIdx((i) => (i + 1) % TASKS_ANIM.length);
        setAnimating(false);
      }, 400);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const nav = lang === "fr" ? NAV_FR : NAV_EN;
  const task = TASKS_ANIM[taskIdx];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: 64,
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <Image
          src="/saim-logo-officiel.png"
          alt="SAIM Conseil"
          width={110}
          height={36}
          style={{ objectFit: "contain" }}
          priority
        />

        {/* Nav links — desktop */}
        <nav style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
          {nav.map((item) => (
            <a
              key={item}
              href="#"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right: lang + CTA + burger */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Language toggle */}
          <button
            onClick={() => setLang((l) => (l === "fr" ? "en" : "fr"))}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
            }}
          >
            <Globe size={13} />
            {lang.toUpperCase()}
          </button>

          {/* Se connecter */}
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "#fff",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            {lang === "fr" ? "Se connecter" : "Sign in"}
          </button>

          {/* Burger mobile */}
          <button
            className="flex md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            zIndex: 99,
            background: "#111",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {nav.map((item) => (
            <a
              key={item}
              href="#"
              style={{
                display: "block",
                padding: "12px 0",
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontSize: 15,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {item}
            </a>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          paddingTop: 64,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "stretch",
        }}
        className="hero-grid"
      >
        {/* LEFT BLOC */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 64px",
            background: "linear-gradient(135deg, #0f1a2e 0%, #1a0a2e 50%, #0a1a1a 100%)",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 999,
                border: "1px solid rgba(16,185,129,0.3)",
                background: "rgba(16,185,129,0.08)",
                marginBottom: 28,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 12, color: "#10b981", fontWeight: 500, letterSpacing: "0.05em" }}>
                {lang === "fr" ? "IA pour les PME africaines" : "AI for African SMEs"}
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 24,
                color: "#fff",
              }}
            >
              {lang === "fr" ? (
                <>
                  L'intelligence artificielle<br />
                  <span style={{ fontWeight: 700, color: "#10b981" }}>au service</span><br />
                  des PME africaines
                </>
              ) : (
                <>
                  Artificial intelligence<br />
                  <span style={{ fontWeight: 700, color: "#10b981" }}>empowering</span><br />
                  African SMEs
                </>
              )}
            </h1>

            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 40, maxWidth: 420 }}>
              {lang === "fr"
                ? "Fiscalité, comptabilité, RH, marketing — gérez tous les aspects de votre entreprise avec un assistant IA expert."
                : "Tax, accounting, HR, marketing — manage every aspect of your business with an expert AI assistant."}
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/onboarding")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  borderRadius: 12,
                  border: "none",
                  background: "#10b981",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 24px rgba(16,185,129,0.35)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#059669";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#10b981";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                {lang === "fr" ? "Démarrer" : "Get started"}
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 24px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
                }}
              >
                {lang === "fr" ? "Voir la démo" : "View demo"}
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 48 }}>
              <div style={{ display: "flex" }}>
                {["#10b981", "#6366f1", "#f59e0b", "#ec4899"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: c,
                      border: "2px solid #0f1a2e",
                      marginLeft: i === 0 ? 0 : -10,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                {lang === "fr" ? "+500 entreprises nous font confiance" : "+500 companies trust us"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT BLOC — animation */}
        <div
          style={{
            background: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid pattern background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Animated task card */}
          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400 }}>
            {/* Header */}
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {lang === "fr" ? "Modules disponibles" : "Available modules"}
              </p>
            </div>

            {/* Task dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
              {TASKS_ANIM.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setTaskIdx(i)}
                  style={{
                    width: i === taskIdx ? 24 : 7,
                    height: 7,
                    borderRadius: 999,
                    background: i === taskIdx ? task.color : "rgba(255,255,255,0.15)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Animated chat card */}
            <div
              style={{
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                overflow: "hidden",
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(8px)" : "translateY(0)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: `${task.color}20`,
                    border: `1px solid ${task.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {task.icon}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0 }}>{task.label}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>SAIM Conseil</p>
                </div>
                <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: task.color }} />
              </div>

              {/* Chat messages */}
              <div style={{ padding: "18px 18px 8px" }}>
                {/* User question */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "14px 14px 2px 14px",
                      background: "rgba(255,255,255,0.08)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.85)",
                      maxWidth: "80%",
                      lineHeight: 1.5,
                    }}
                  >
                    {task.question}
                  </div>
                </div>

                {/* AI answer */}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: `${task.color}25`,
                      border: `1px solid ${task.color}50`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    {task.icon}
                  </div>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "2px 14px 14px 14px",
                      background: `${task.color}12`,
                      border: `1px solid ${task.color}20`,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.6,
                    }}
                  >
                    {task.answer}
                  </div>
                </div>

                {/* Input mock */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", flex: 1 }}>
                    {lang === "fr" ? "Posez votre question…" : "Ask your question…"}
                  </span>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: task.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowRight size={12} color="#fff" />
                  </div>
                </div>
              </div>
            </div>

            {/* Task chips below card */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20, justifyContent: "center" }}>
              {TASKS_ANIM.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setTaskIdx(i)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 999,
                    border: `1px solid ${i === taskIdx ? t.color + "60" : "rgba(255,255,255,0.08)"}`,
                    background: i === taskIdx ? `${t.color}15` : "transparent",
                    color: i === taskIdx ? t.color : "rgba(255,255,255,0.35)",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section style={{ padding: "80px 32px", background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(22px, 3vw, 36px)",
              fontWeight: 300,
              color: "#fff",
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            {lang === "fr" ? "Tout ce dont votre entreprise a besoin" : "Everything your business needs"}
          </h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 15, marginBottom: 56 }}>
            {lang === "fr" ? "Une plateforme, plusieurs experts IA à votre service" : "One platform, multiple AI experts at your service"}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {[
              { icon: "🧾", title: lang === "fr" ? "Fiscalité" : "Tax", desc: lang === "fr" ? "IGS, TVA, IRPP, IS — calculez et déclarez en toute conformité." : "IGS, VAT, IRPP, IS — calculate and file in full compliance.", color: "#10b981", live: true },
              { icon: "💼", title: lang === "fr" ? "Comptabilité" : "Accounting", desc: lang === "fr" ? "Factures, bilans, rapports financiers automatisés." : "Invoices, balance sheets, automated financial reports.", color: "#6366f1", live: false },
              { icon: "👥", title: "RH", desc: lang === "fr" ? "Paie, contrats, gestion des congés simplifiée." : "Payroll, contracts, simplified leave management.", color: "#f59e0b", live: false },
              { icon: "📣", title: "Marketing", desc: lang === "fr" ? "Contenus, campagnes, réseaux sociaux pilotés par IA." : "Content, campaigns, social media driven by AI.", color: "#ec4899", live: false },
              { icon: "📋", title: lang === "fr" ? "Gestion de projets" : "Project management", desc: lang === "fr" ? "Planifiez, suivez et livrez vos projets dans les délais." : "Plan, track and deliver your projects on time.", color: "#3b82f6", live: false },
              { icon: "📄", title: lang === "fr" ? "Rapports & synthèses" : "Reports & summaries", desc: lang === "fr" ? "Résumez documents et données en secondes." : "Summarize documents and data in seconds.", color: "#8b5cf6", live: false },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  padding: "24px",
                  borderRadius: 16,
                  border: `1px solid ${f.live ? f.color + "30" : "rgba(255,255,255,0.05)"}`,
                  background: f.live ? `${f.color}08` : "rgba(255,255,255,0.02)",
                  transition: "all 0.2s",
                  cursor: "default",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = `1px solid ${f.color}50`;
                  (e.currentTarget as HTMLDivElement).style.background = `${f.color}10`;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = `1px solid ${f.live ? f.color + "30" : "rgba(255,255,255,0.05)"}`;
                  (e.currentTarget as HTMLDivElement).style.background = f.live ? `${f.color}08` : "rgba(255,255,255,0.02)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {f.live && (
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: `${f.color}20`,
                      color: f.color,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      border: `1px solid ${f.color}30`,
                    }}
                  >
                    LIVE
                  </span>
                )}
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section
        style={{
          padding: "80px 32px",
          background: "linear-gradient(135deg, #0f1a2e, #1a0a2e)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 300, color: "#fff", marginBottom: 16, letterSpacing: "-0.02em" }}>
          {lang === "fr" ? "Prêt à transformer votre PME ?" : "Ready to transform your SME?"}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, marginBottom: 40 }}>
          {lang === "fr" ? "Commencez gratuitement en moins de 2 minutes." : "Get started for free in less than 2 minutes."}
        </p>
        <button
          onClick={() => router.push("/onboarding")}
          style={{
            padding: "16px 40px",
            borderRadius: 14,
            border: "none",
            background: "#10b981",
            color: "#fff",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#059669";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#10b981";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          {lang === "fr" ? "Démarrer maintenant" : "Start now"}
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "32px", background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
          © 2025 SAIM Conseil · {lang === "fr" ? "Tous droits réservés" : "All rights reserved"}
        </p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
