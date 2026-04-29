"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SAIM, SaimLogoH, SaimMark, Footer, SectionBlock } from "./SaimUI";

/* ─── Icônes SVG du dropdown ─── */
function IconAudit() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}
function IconCourse() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
function IconDataLab() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
    </svg>
  );
}
function IconSaimAI() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}
function IconAgent() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M12 2a3 3 0 0 1 3 3v6H9V5a3 3 0 0 1 3-3z" />
      <circle cx="9" cy="16" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─── Nav spécifique landing ─── */
const SOLUTIONS = [
  { label: "Audit et conseil en stratégie IA", desc: "Analyse et feuille de route IA",       href: "/services",                icon: <IconAudit /> },
  { label: "Formation SAIM Course",             desc: "Apprenez l'IA à votre rythme",         href: "https://course.mysaim.cm", icon: <IconCourse />,  external: true },
  { label: "Data Lab",                          desc: "Données synthétiques & annotation",    href: "/services",                icon: <IconDataLab /> },
  { label: "SAIM AI",                           desc: "La plateforme complète pour les PME",  href: "/services",                icon: <IconSaimAI /> },
  { label: "Agent IA",                          desc: "Six agents experts, disponibles 24h",  href: "/dashboard",               icon: <IconAgent /> },
];

function LandingNav() {
  const [open, setOpen] = useState(false);

  const linkStyle = {
    fontFamily: "'Inter Tight', system-ui, sans-serif",
    fontSize: 14, fontWeight: 500,
    color: "rgba(245,241,232,0.65)",
    textDecoration: "none",
    letterSpacing: "-0.01em",
  } as const;

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 48px",
      background: "rgba(26,22,18,0.96)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(245,241,232,0.08)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <SaimLogoH size={28} dark={false} />

      {/* Liens centraux */}
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>

        {/* Solutions — dropdown au survol */}
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          style={{ position: "relative", paddingBottom: 14, marginBottom: -14 }}
        >
          <button style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            ...linkStyle,
            color: open ? SAIM.paper : "rgba(245,241,232,0.65)",
          }}>
            Solutions
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: "50%",
              transform: "translateX(-50%)",
              background: "#ffffff",
              border: "1px solid #e8e8e8",
              borderRadius: 16,
              padding: "8px",
              minWidth: 320,
              boxShadow: "0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
            }}>
              {/* Petite flèche */}
              <div style={{
                position: "absolute", top: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)",
                width: 10, height: 10,
                background: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRight: "none", borderBottom: "none",
              }} />

              {SOLUTIONS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  prefetch={false}
                  {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "10px 12px", borderRadius: 10,
                    textDecoration: "none", color: "#1a1a1a",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#f5f5f5"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                >
                  {/* Icône dans un carré arrondi */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: "#f3f4f6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: SAIM.accent,
                  }}>
                    {s.icon}
                  </div>

                  {/* Titre + sous-titre */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.3 }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 12, color: "#888", marginTop: 2, lineHeight: 1.3 }}>
                      {s.desc}
                    </div>
                  </div>

                  {s.external && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        <a href="#tarifs" style={linkStyle}>Tarifs</a>
        <a href="#contact" style={linkStyle}>Contact</a>
      </div>

      {/* Boutons */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Link href="/dashboard" prefetch={false} style={{
          ...linkStyle,
          color: "rgba(245,241,232,0.8)",
          padding: "9px 18px", borderRadius: 10,
          border: "1px solid rgba(245,241,232,0.18)",
        }}>
          Connexion
        </Link>
        <Link href="/dashboard" prefetch={false} style={{
          fontFamily: "'Inter Tight', system-ui, sans-serif",
          fontSize: 14, fontWeight: 600,
          color: "#1A1612",
          textDecoration: "none",
          padding: "9px 20px", borderRadius: 10,
          background: "#FBFAF7",
        }}>
          Essayer SAIM
        </Link>
      </div>
    </nav>
  );
}

/* ─── Animation démo plateforme ─── */
const DEMOS = [
  {
    agent: "SAIM Fiscal",
    color: "#C2562C",
    userMsg: "Quel est mon IS sur un bénéfice de 45 000 € ?",
    aiLines: "IS calculé : 15 000 € (taux 33%)\nMinimum de perception : 450 € (1% CA)\n→ Formulaire 2065 prêt à télécharger",
  },
  {
    agent: "SAIM RH",
    color: "#6366f1",
    userMsg: "Génère un contrat CDI pour mon nouveau commercial.",
    aiLines: "Contrat CDI généré ✓\nPoste : Commercial · 2 800 € brut/mois\n→ Prêt à signer — format Word & PDF",
  },
  {
    agent: "SAIM Juridique",
    color: "#0891b2",
    userMsg: "Rédige des CGV pour mon activité de consulting.",
    aiLines: "CGV rédigées — 9 clauses essentielles ✓\nRGPD, responsabilité, litiges inclus\n→ Télécharger · Personnaliser",
  },
];

function PlatformDemo() {
  const [idx, setIdx]         = useState(0);
  const [phase, setPhase]     = useState(0); // 0 init · 1 user · 2 typing · 3 ai
  const [aiText, setAiText]   = useState("");

  useEffect(() => {
    setPhase(0);
    setAiText("");

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 400));
    timers.push(setTimeout(() => setPhase(2), 1500));
    timers.push(setTimeout(() => setPhase(3), 2700));

    let charIdx = 0;
    const full = DEMOS[idx].aiLines;
    timers.push(setTimeout(() => {
      const iv = setInterval(() => {
        charIdx++;
        setAiText(full.slice(0, charIdx));
        if (charIdx >= full.length) clearInterval(iv);
      }, 20);
    }, 2700));

    timers.push(setTimeout(() => setIdx(i => (i + 1) % DEMOS.length), 7200));
    return () => timers.forEach(clearTimeout);
  }, [idx]);

  const demo = DEMOS[idx];

  return (
    <div style={{
      background: "#1A1612",
      border: "1px solid rgba(26,22,18,0.12)",
      borderRadius: 20, overflow: "hidden",
      fontFamily: "'Inter Tight', system-ui, sans-serif",
      boxShadow: "0 24px 64px rgba(26,22,18,0.18), 0 4px 16px rgba(26,22,18,0.08)",
    }}>
      {/* Barre titre façon macOS */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 18px",
        borderBottom: "1px solid rgba(245,241,232,0.07)",
        background: "rgba(245,241,232,0.03)",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ef4444","#f59e0b","#22c55e"].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.6 }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: "center" as const }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(245,241,232,0.35)", letterSpacing: "0.1em" }}>
            {demo.agent}
          </span>
        </div>
        <div style={{ width: 42 }} />
      </div>

      {/* Zone chat */}
      <div style={{ padding: "20px 18px", minHeight: 220, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Message utilisateur */}
        {phase >= 1 && (
          <div className="demo-appear" style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{
              background: "rgba(245,241,232,0.11)",
              border: "1px solid rgba(245,241,232,0.07)",
              borderRadius: "16px 16px 4px 16px",
              padding: "10px 14px", maxWidth: "88%",
              fontSize: 13, color: "rgba(245,241,232,0.82)", lineHeight: 1.5,
            }}>
              {demo.userMsg}
            </div>
          </div>
        )}

        {/* Points de saisie */}
        {phase === 2 && (
          <div className="demo-appear" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9, flexShrink: 0,
              background: demo.color,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <SaimMark size={16} fg="#fff" />
            </div>
            <div style={{ display: "flex", gap: 5, padding: "8px 12px", background: "rgba(245,241,232,0.06)", borderRadius: 10 }}>
              <div className="dot-bounce" style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(245,241,232,0.5)" }} />
              <div className="dot-bounce" style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(245,241,232,0.5)" }} />
              <div className="dot-bounce" style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(245,241,232,0.5)" }} />
            </div>
          </div>
        )}

        {/* Réponse IA */}
        {phase >= 3 && (
          <div className="demo-appear" style={{ display: "flex", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9, flexShrink: 0,
              background: demo.color,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <SaimMark size={16} fg="#fff" />
            </div>
            <div style={{
              background: "rgba(245,241,232,0.06)",
              border: "1px solid rgba(245,241,232,0.07)",
              borderRadius: "4px 16px 16px 16px",
              padding: "10px 14px", flex: 1,
              fontSize: 13, color: "rgba(245,241,232,0.82)",
              lineHeight: 1.65, whiteSpace: "pre-line" as const,
            }}>
              {aiText}
              {aiText.length < demo.aiLines.length && (
                <span className="cursor-blink" style={{
                  display: "inline-block", width: 2, height: 13,
                  background: demo.color, marginLeft: 2, verticalAlign: "middle",
                }} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Barre d'input décorative */}
      <div style={{
        margin: "0 14px 14px",
        padding: "10px 14px",
        background: "rgba(245,241,232,0.04)",
        border: "1px solid rgba(245,241,232,0.08)",
        borderRadius: 12,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ flex: 1, fontSize: 12, color: "rgba(245,241,232,0.2)", fontStyle: "italic" }}>
          Posez votre question…
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: demo.color,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
      </div>

      {/* Indicateurs de démo (points de navigation) */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingBottom: 14 }}>
        {DEMOS.map((_, i) => (
          <div key={i} style={{
            width: i === idx ? 18 : 6, height: 6, borderRadius: 3,
            background: i === idx ? demo.color : "rgba(245,241,232,0.15)",
            transition: "all 0.4s ease",
            cursor: "pointer",
          }} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section style={{ background: "#FBFAF7", padding: "88px 48px 104px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 72, alignItems: "center" }}>

        {/* Texte gauche */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 24 }}>
            Super Agent Intelligent Multimodal
          </div>

          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 68, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.0, margin: "0 0 12px", color: "#1A1612" }}>
            SAIM AI gère<br />votre entreprise.
          </h1>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 68, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.0, margin: "0 0 32px", color: SAIM.accent, fontStyle: "italic" }}>
            Vous, vous la<br />faites grandir.
          </h2>

          <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 18, lineHeight: 1.6, color: "#73726C", maxWidth: 440, marginBottom: 8 }}>
            Fiscalité, RH, comptabilité — <strong style={{ color: "#1A1612", fontWeight: 500 }}>automatisés.</strong>
          </p>
          <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 18, lineHeight: 1.6, color: "#73726C", maxWidth: 440, marginBottom: 40 }}>
            Sans recruter. Sans exploser votre budget.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
            <Link href="/dashboard" prefetch={false} style={{
              display: "inline-block", background: SAIM.accent, color: "#FBFAF7",
              padding: "14px 28px", borderRadius: 12,
              fontSize: 15, fontWeight: 600,
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              textDecoration: "none",
            }}>
              Essayer gratuitement
            </Link>
            <a href="#tarifs" style={{
              display: "inline-block",
              background: "#FBFAF7",
              border: "1px solid #DEDEDD",
              color: "#73726C",
              padding: "14px 28px", borderRadius: 12,
              fontSize: 15, fontWeight: 500,
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              textDecoration: "none",
            }}>
              Voir les tarifs
            </a>
          </div>
        </div>

        {/* Démo animée droite */}
        <PlatformDemo />
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "C'est quoi SAIM AI et comment ça fonctionne ?",
      a: "SAIM AI est une plateforme d'intelligence artificielle conçue pour les entrepreneurs et les PME. Elle regroupe plusieurs agents experts (fiscal, RH, commercial, juridique…) accessibles par simple chat. Vous posez votre question, l'agent analyse et vous répond avec précision en s'appuyant sur des textes officiels et des données réelles — sans hallucination.",
    },
    {
      q: "Peut-on utiliser SAIM gratuitement ?",
      a: "Oui. L'offre gratuite donne accès à 10 questions par jour pendant 2 mois, sans carte bancaire requise. Au-delà, nos forfaits Starter (9€/mois) et Pro (24€/mois) offrent un accès illimité avec des fonctionnalités avancées.",
    },
    {
      q: "SAIM remplace-t-il un comptable ou un avocat ?",
      a: "Non. SAIM est une première ligne d'intelligence pour les tâches courantes et les questions fréquentes. Pour les situations complexes ou contentieuses, nous recommandons de consulter un professionnel agréé.",
    },
    {
      q: "Mes données sont-elles sécurisées ?",
      a: "Oui. Nous utilisons des modèles open source hébergés sur notre propre infrastructure — vos données ne sont jamais transmises à des tiers. Souveraineté totale garantie.",
    },
  ];

  return (
    <SectionBlock
      id="faq"
      kicker="FAQ"
      title={<>Questions <em style={{ fontStyle: "italic", color: SAIM.accent }}>fréquentes.</em></>}
      bg={SAIM.paperAlt}
    >
      <div>
        {faqs.map((f, i) => (
          <div
            key={i}
            style={{ borderBottom: `1px solid ${SAIM.border}` }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "24px 0", background: "none", border: "none", cursor: "pointer",
                textAlign: "left" as const,
              }}
            >
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 400, letterSpacing: "-0.02em", color: SAIM.ink }}>
                {f.q}
              </span>
              <span style={{ fontSize: 22, color: SAIM.accent, flexShrink: 0, marginLeft: 24, transition: "transform 0.2s", transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
            </button>
            {openIndex === i && (
              <div style={{ paddingBottom: 24, paddingRight: 48 }}>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: SAIM.inkSoft, margin: 0 }}>{f.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

/* ─── Tarifs ─── */
function PricingSection() {
  const plans = [
    {
      name: "Starter", price: "9", unit: "€/mois",
      items: ["SAIM Fiscal", "SAIM Documents", "10 questions/jour", "Support email"],
      pop: false,
    },
    {
      name: "Pro", price: "24", unit: "€/mois",
      items: ["Fiscal + RH + Commercial", "Marketing + Documents", "Questions illimitées", "Support prioritaire"],
      pop: true,
    },
    {
      name: "Business", price: "49", unit: "€/mois",
      items: ["Tous les 6 agents", "Questions illimitées", "Multi-utilisateurs", "Support dédié + formation"],
      pop: false,
    },
  ];
  return (
    <SectionBlock
      id="tarifs"
      kicker="Découvrir nos tarifs"
      title={<>Simple. <em style={{ fontStyle: "italic", color: SAIM.accent }}>Accessible.</em></>}
      lead="Des outils qui remplacent des expertises à 500€+/mois, pour une fraction du prix."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {plans.map(p => (
          <div key={p.name} style={{
            background: p.pop ? SAIM.ink : SAIM.paperHi,
            color: p.pop ? SAIM.paper : SAIM.ink,
            border: `1px solid ${p.pop ? SAIM.ink : SAIM.border}`,
            borderRadius: 18, padding: 32,
            display: "flex", flexDirection: "column",
            position: "relative",
          }}>
            {p.pop && (
              <div style={{ position: "absolute", top: -12, left: 24, background: SAIM.accent, color: SAIM.paper, padding: "4px 14px", borderRadius: 999, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
                Populaire
              </div>
            )}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: p.pop ? SAIM.accentLight : SAIM.muted, marginBottom: 16 }}>{p.name}</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 44, fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 4 }}>{p.price}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.pop ? "rgba(245,241,232,0.5)" : SAIM.faint, marginBottom: 28 }}>{p.unit}</div>
            <div style={{ flex: 1 }}>
              {p.items.map(it => (
                <div key={it} style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 10, color: p.pop ? "rgba(245,241,232,0.8)" : SAIM.inkSoft }}>✓ {it}</div>
              ))}
            </div>
            <Link href="/dashboard" prefetch={false} style={{
              marginTop: 24, textAlign: "center" as const, padding: "12px 0", borderRadius: 10, display: "block",
              background: p.pop ? SAIM.accent : "transparent",
              border: `1px solid ${p.pop ? SAIM.accent : SAIM.border}`,
              color: p.pop ? SAIM.paper : SAIM.ink,
              fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}>
              Commencer
            </Link>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center" as const, marginTop: 24, fontSize: 13, color: SAIM.faint }}>
        Offre gratuite disponible — 10 questions/jour · Sans carte bancaire
      </p>
    </SectionBlock>
  );
}

/* ─── Page principale ─── */
export default function SaimAILanding() {
  return (
    <div style={{ background: SAIM.paper, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <LandingNav />
      <Hero />
      <FAQSection />
      <PricingSection />
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}
