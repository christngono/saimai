"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Globe, ChevronRight, ArrowRight } from "lucide-react";

/* ── CHARTE GRAPHIQUE SAIM ── */
const T  = "#C2562C";   // Terracotta — couleur signature
const INK = "#1F1410";  // Encre — fond sombre
const INK2 = "#3A1F14"; // Accent 2 — secondaire
const SURF = "#EDE2CE"; // Surface — beige chaud
const MUTED = "#73655A";// Texte secondaire
const LINE = "#DCCFB8"; // Bordures

const TASKS_ANIM = [
  {
    icon: "🧾",
    label: "Fiscalité",
    question: "Quel est mon IGS pour un CA de 8 500 000 FCFA ?",
    answer: "Vous êtes en Classe 5 — 100 000 FCFA/an, soit 25 000 FCFA par trimestre.",
    color: T,
  },
  {
    icon: "💼",
    label: "Comptabilité",
    question: "Génère ma facture n°2025-047 avec TVA 19,25%",
    answer: "Facture générée avec en-tête ACME Sarl · Montant HT 450 000 · TVA 86 625 FCFA.",
    color: "#A0845C",
  },
  {
    icon: "👥",
    label: "Ressources humaines",
    question: "Calcule la paie de mars pour 8 employés",
    answer: "Masse salariale : 3 840 000 FCFA · CNPS : 307 200 FCFA · Net à payer : 3 532 800 FCFA.",
    color: MUTED,
  },
  {
    icon: "📣",
    label: "Marketing",
    question: "Crée un post LinkedIn pour notre lancement",
    answer: "« Nous sommes fiers d'annoncer le lancement de notre nouvelle gamme… » — 3 variantes générées.",
    color: "#8B6B4A",
  },
];

/* ── LOGO MARK ── */
function LogoMark({ size = 26, color = T }: { size?: number; color?: string }) {
  const rects: [number, number][] = [
    [20,30],[64,30],[108,30],[152,30],[196,30],
    [20,74],
    [20,118],[64,118],[108,118],[196,118],
    [196,162],
    [20,206],[64,206],[108,206],[152,206],[196,206],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 232 250" fill="none">
      {rects.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="36" height="36" rx="7" fill={color} />
      ))}
    </svg>
  );
}

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

  const task = TASKS_ANIM[taskIdx];
  const nav = lang === "fr"
    ? ["À propos", "Services", "Tarifs", "Contact"]
    : ["About", "Services", "Pricing", "Contact"];

  return (
    <div style={{ minHeight: "100vh", background: INK, color: SURF, overflowX: "hidden", fontFamily: "'Helvetica Neue', Arial, -apple-system, sans-serif" }}>

      {/* ══ NAVBAR ══ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 62, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px",
        background: `rgba(31,20,16,0.92)`, backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${INK2}`,
      }}>
        {/* Logo + back link */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a href="/" style={{ fontSize: 11, color: MUTED, textDecoration: "none", fontWeight: 600, letterSpacing: "0.06em", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = SURF)}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
            ← saimAI
          </a>
          <div style={{ width: 1, height: 16, background: INK2 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LogoMark size={22} color={T} />
            <span style={{ fontWeight: 900, fontSize: 16, color: SURF, letterSpacing: "-0.03em" }}>
              SAIM <span style={{ color: T }}>Fiscal</span>
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: 28, alignItems: "center" }} className="fiscal-desk-nav">
          {nav.map(item => (
            <a key={item} href="#" style={{ fontSize: 13, color: MUTED, textDecoration: "none", fontWeight: 500, transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = SURF)}
              onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
              {item}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setLang(l => l === "fr" ? "en" : "fr")}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: `1px solid ${INK2}`, background: "transparent", color: MUTED, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            <Globe size={12} />{lang.toUpperCase()}
          </button>
          <button onClick={() => router.push("/dashboard")}
            style={{ padding: "8px 20px", borderRadius: 9, border: "none", background: T, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            {lang === "fr" ? "Se connecter" : "Sign in"}
          </button>
          <button className="fiscal-burger" onClick={() => setMenuOpen(v => !v)}
            style={{ background: "none", border: "none", color: SURF, cursor: "pointer", display: "none" }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 99, background: INK, borderBottom: `1px solid ${INK2}`, padding: "12px 24px" }}>
          {nav.map(item => (
            <a key={item} href="#" onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 15, color: SURF, textDecoration: "none", borderBottom: `1px solid ${INK2}` }}>
              {item}
            </a>
          ))}
        </div>
      )}

      {/* ══ HERO ══ */}
      <section style={{ minHeight: "100vh", paddingTop: 62, display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }} className="fiscal-hero">

        {/* LEFT */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 60px", background: INK, overflow: "hidden" }}>
          {/* Décoration terracotta radiale */}
          <div style={{ position: "absolute", top: -120, right: -120, width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${T}18 0%, transparent 68%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${INK2}60 0%, transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 13px", borderRadius: 999, border: `1px solid ${T}50`, background: `${T}15`, marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T, display: "inline-block" }} />
              <span style={{ fontSize: 11, color: T, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {lang === "fr" ? "CGI 2025 · LF 2026 intégrés" : "CGI 2025 · LF 2026 integrated"}
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(28px, 4vw, 54px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 24, color: SURF }}>
              {lang === "fr" ? (
                <>Votre conseiller fiscal<br /><span style={{ color: T }}>camerounais</span><br />disponible 24h/24</>
              ) : (
                <>Your Cameroonian<br /><span style={{ color: T }}>tax advisor</span><br />available 24/7</>
              )}
            </h1>

            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.75, marginBottom: 40, maxWidth: 400 }}>
              {lang === "fr"
                ? "Calculs fiscaux exacts, procédures DGI, calendrier des échéances — alimenté par les textes officiels à jour."
                : "Exact tax calculations, DGI procedures, deadline calendar — powered by up-to-date official texts."}
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => router.push("/onboarding")}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 11, border: "none", background: T, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", boxShadow: `0 4px 24px ${T}40` }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
                {lang === "fr" ? "Démarrer gratuitement" : "Start for free"} <ArrowRight size={16} />
              </button>
              <button onClick={() => router.push("/dashboard")}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 22px", borderRadius: 11, border: `1px solid ${LINE}30`, background: "transparent", color: SURF, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T; (e.currentTarget as HTMLButtonElement).style.color = T; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${LINE}30`; (e.currentTarget as HTMLButtonElement).style.color = SURF; }}>
                {lang === "fr" ? "Voir la démo" : "View demo"} <ChevronRight size={15} />
              </button>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 44 }}>
              <div style={{ display: "flex" }}>
                {[T, INK2, MUTED, "#A0845C"].map((c, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: `2px solid ${INK}`, marginLeft: i === 0 ? 0 : -9 }} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: MUTED }}>
                {lang === "fr" ? "+2 500 utilisateurs actifs" : "+2,500 active users"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — carte animée */}
        <div style={{ background: INK2, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
          {/* Grille décorative */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T}08 1px, transparent 1px), linear-gradient(90deg, ${T}08 1px, transparent 1px)`, backgroundSize: "44px 44px" }} />

          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 390 }}>
            <p style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 20, fontWeight: 700 }}>
              {lang === "fr" ? "Modules disponibles" : "Available modules"}
            </p>

            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 7, marginBottom: 24 }}>
              {TASKS_ANIM.map((t, i) => (
                <button key={i} onClick={() => setTaskIdx(i)} style={{ width: i === taskIdx ? 22 : 6, height: 6, borderRadius: 999, background: i === taskIdx ? T : `${MUTED}50`, border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
              ))}
            </div>

            {/* Carte animée */}
            <div style={{ borderRadius: 18, border: `1px solid ${T}25`, background: `${INK}CC`, backdropFilter: "blur(20px)", overflow: "hidden", opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
              {/* Card header */}
              <div style={{ padding: "13px 16px", borderBottom: `1px solid ${T}15`, display: "flex", alignItems: "center", gap: 10, background: `${INK2}80` }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${T}20`, border: `1px solid ${T}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                  {task.icon}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: SURF, margin: 0 }}>{task.label}</p>
                  <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>SAIM Fiscal</p>
                </div>
                <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: T }} />
              </div>

              {/* Messages */}
              <div style={{ padding: "16px 16px 8px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                  <div style={{ padding: "9px 13px", borderRadius: "13px 13px 2px 13px", background: `${SURF}12`, fontSize: 13, color: `${SURF}CC`, maxWidth: "80%", lineHeight: 1.5 }}>
                    {task.question}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: `${T}20`, border: `1px solid ${T}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>
                    {task.icon}
                  </div>
                  <div style={{ padding: "9px 13px", borderRadius: "2px 13px 13px 13px", background: `${T}15`, border: `1px solid ${T}25`, fontSize: 13, color: SURF, lineHeight: 1.6 }}>
                    {task.answer}
                  </div>
                </div>
                {/* Input mock */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 11, border: `1px solid ${T}20`, background: `${SURF}06`, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: MUTED, flex: 1 }}>{lang === "fr" ? "Posez votre question…" : "Ask your question…"}</span>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: T, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowRight size={11} color="#fff" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 18, justifyContent: "center" }}>
              {TASKS_ANIM.map((t, i) => (
                <button key={i} onClick={() => setTaskIdx(i)}
                  style={{ padding: "5px 12px", borderRadius: 999, border: `1px solid ${i === taskIdx ? T + "70" : MUTED + "30"}`, background: i === taskIdx ? `${T}18` : "transparent", color: i === taskIdx ? T : MUTED, fontSize: 12, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section style={{ padding: "88px 40px", background: SURF }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: "0.12em", textTransform: "uppercase" }}>MODULES</span>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, color: INK, marginTop: 10, letterSpacing: "-0.03em" }}>
              {lang === "fr" ? "Tout ce dont votre entreprise a besoin" : "Everything your business needs"}
            </h2>
            <p style={{ color: MUTED, fontSize: 15, marginTop: 10 }}>
              {lang === "fr" ? "Une plateforme, plusieurs experts IA à votre service" : "One platform, multiple AI experts at your service"}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              { icon: "🧾", title: lang === "fr" ? "Fiscalité" : "Tax", desc: lang === "fr" ? "IGS, TVA, IRPP, IS — calculs exacts selon CGI 2025 et LF 2026." : "IGS, VAT, IRPP, IS — exact calculations per CGI 2025 and LF 2026.", live: true },
              { icon: "💼", title: lang === "fr" ? "Comptabilité" : "Accounting", desc: lang === "fr" ? "Factures, bilans, rapports financiers automatisés." : "Invoices, balance sheets, automated financial reports.", live: false },
              { icon: "👥", title: "RH", desc: lang === "fr" ? "Paie CNPS, contrats, gestion des congés simplifiée." : "CNPS payroll, contracts, simplified leave management.", live: false },
              { icon: "📣", title: "Marketing", desc: lang === "fr" ? "Contenus, campagnes et réseaux sociaux pilotés par IA." : "Content, campaigns, and social media driven by AI.", live: false },
              { icon: "📋", title: lang === "fr" ? "Projets" : "Projects", desc: lang === "fr" ? "Planifiez et livrez vos projets dans les délais." : "Plan and deliver your projects on time.", live: false },
              { icon: "📄", title: lang === "fr" ? "Rapports" : "Reports", desc: lang === "fr" ? "Synthétisez vos documents et données en secondes." : "Summarize your documents and data in seconds.", live: false },
            ].map((f, i) => (
              <div key={i} style={{ padding: "22px", borderRadius: 14, border: `1px solid ${f.live ? T + "40" : LINE}`, background: f.live ? `${T}0A` : "#fff", transition: "all 0.2s", position: "relative", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = T + "60"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 8px 24px ${T}10`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = f.live ? T + "40" : LINE; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
                {f.live && <span style={{ position: "absolute", top: 12, right: 12, padding: "2px 8px", borderRadius: 999, background: `${T}15`, color: T, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em" }}>LIVE</span>}
                <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: INK, marginBottom: 6, letterSpacing: "-0.02em" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding: "88px 40px", background: INK2, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}20 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: "0.12em", textTransform: "uppercase" }}>COMMENCER</span>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, color: SURF, marginTop: 12, marginBottom: 14, letterSpacing: "-0.03em" }}>
            {lang === "fr" ? "Prêt à maîtriser votre fiscalité ?" : "Ready to master your taxes?"}
          </h2>
          <p style={{ color: MUTED, fontSize: 16, marginBottom: 36 }}>
            {lang === "fr" ? "Commencez gratuitement — 10 questions offertes par jour." : "Start for free — 10 questions per day included."}
          </p>
          <button onClick={() => router.push("/onboarding")}
            style={{ padding: "15px 40px", borderRadius: 12, border: "none", background: T, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", boxShadow: `0 8px 32px ${T}45` }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
            {lang === "fr" ? "Démarrer maintenant" : "Start now"}
          </button>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ padding: "28px 40px", background: INK, borderTop: `1px solid ${INK2}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LogoMark size={18} color={T} />
          <span style={{ fontSize: 14, fontWeight: 900, color: SURF, letterSpacing: "-0.02em" }}>SAIM <span style={{ color: T }}>Fiscal</span></span>
        </div>
        <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>© 2025 SAIM AI · {lang === "fr" ? "Tous droits réservés" : "All rights reserved"} · Yaoundé, Cameroun</p>
        <a href="/" style={{ fontSize: 12, color: MUTED, textDecoration: "none", transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = T)}
          onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
          ← saimAI
        </a>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .fiscal-hero { grid-template-columns: 1fr !important; }
          .fiscal-desk-nav { display: none !important; }
          .fiscal-burger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
