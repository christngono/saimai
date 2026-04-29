"use client";

import { useState } from "react";
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
          color: SAIM.paper,
          textDecoration: "none",
          padding: "9px 20px", borderRadius: 10,
          background: SAIM.accent,
        }}>
          Essayer SAIM
        </Link>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const agents = [
    { name: "SAIM Fiscal",     desc: "TVA · IS · Calcul d'impôts exact",            active: true },
    { name: "SAIM Marketing",  desc: "Contenu réseaux · Propositions commerciales" },
    { name: "SAIM RH",         desc: "Contrats · Charges sociales · Fiches de paie" },
    { name: "SAIM Commercial", desc: "Prospection · Relances · Pipeline" },
    { name: "SAIM Juridique",  desc: "Contrats · CGV · Conformité" },
    { name: "SAIM Documents",  desc: "Synthèse · Extraction · Transcription" },
  ];
  return (
    <section style={{ background: SAIM.ink, color: SAIM.paper, padding: "80px 48px 96px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 28 }}>
            Super Agent Intelligent Multimodal
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 80, fontWeight: 300, letterSpacing: "-0.04em", lineHeight: 0.95, margin: 0, marginBottom: 32 }}>
            Votre PME<br />mérite <em style={{ fontStyle: "italic", color: SAIM.accent, fontWeight: 400 }}>mieux.</em>
          </h1>
          <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 20, lineHeight: 1.55, opacity: 0.72, maxWidth: 460, marginBottom: 40 }}>
            Un comptable, un juriste, un commercial — disponibles 24h/24. Six agents IA spécialisés, prêts à répondre à chaque besoin de votre entreprise.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
            <Link href="/dashboard" prefetch={false} style={{
              display: "inline-block", background: SAIM.accent, color: SAIM.paper,
              padding: "14px 28px", borderRadius: 12,
              fontSize: 16, fontWeight: 600,
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              textDecoration: "none",
            }}>
              Essayer gratuitement
            </Link>
            <a href="#tarifs" style={{
              display: "inline-block",
              border: "1px solid rgba(245,241,232,0.2)",
              color: "rgba(245,241,232,0.8)",
              padding: "14px 28px", borderRadius: 12,
              fontSize: 16, fontWeight: 500,
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              textDecoration: "none",
            }}>
              Voir les tarifs
            </a>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
            {[{ n: "300K", l: "PME ciblées" }, { n: "6", l: "agents spécialisés" }, { n: "24/7", l: "disponibilité" }].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 400, color: SAIM.accent }}>{s.n}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, opacity: 0.5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {agents.map(a => (
            <div key={a.name} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "18px 22px", borderRadius: 14,
              background: a.active ? SAIM.accent : "rgba(245,241,232,0.06)",
              border: `1px solid ${a.active ? SAIM.accent : "rgba(245,241,232,0.08)"}`,
            }}>
              <SaimMark size={32} fg={a.active ? SAIM.paper : SAIM.accent} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: SAIM.paper }}>{a.name}</div>
                <div style={{ fontSize: 12, opacity: a.active ? 0.85 : 0.5, marginTop: 2, color: SAIM.paper }}>{a.desc}</div>
              </div>
              <span style={{ fontSize: 16, opacity: 0.4, color: SAIM.paper }}>→</span>
            </div>
          ))}
        </div>
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
