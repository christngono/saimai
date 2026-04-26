"use client";

import { useState } from "react";
import { Menu, X, ArrowRight, ChevronRight, Database, Cpu, FileText, Zap, Shield, RefreshCw, BookOpen, BarChart3, Globe, Users } from "lucide-react";

const O = "#C1522A";          // orange logo
const DARK = "#1A1A1A";       // noir logo
const GRAY = "#6B7280";
const BORDER = "#E8E4E0";
const SAND = "#F7F4F1";       // fond sable chaud (cohérent avec l'orange)

/* ──────────────── LOGO MARK ──────────────── */
function LogoMark({ size = 28, color = O }: { size?: number; color?: string }) {
  const rects: [number, number][] = [
    [20,30],[64,30],[108,30],[152,30],[196,30], // rangée 1
    [20,74],                                     // rangée 2
    [20,118],[64,118],[108,118],[196,118],        // rangée 3
    [196,162],                                   // rangée 4
    [20,206],[64,206],[108,206],[152,206],[196,206], // rangée 5
  ];
  return (
    <svg width={size} height={size * (232/232)} viewBox="0 0 232 250" fill="none">
      {rects.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="36" height="36" rx="7" fill={color} />
      ))}
    </svg>
  );
}

/* ──────────────── LOGO COMPLET ──────────────── */
function Logo({ dark = true }: { dark?: boolean }) {
  return (
    <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={30} color={O} />
      <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: 22, color: dark ? DARK : "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>
        saim<span style={{ color: O }}>AI</span>
      </span>
    </a>
  );
}

/* ──────────────── BOUTON PRINCIPAL ──────────────── */
function BtnPrimary({ children, href, onClick, external = false }: { children: React.ReactNode; href?: string; onClick?: () => void; external?: boolean }) {
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "13px 28px", borderRadius: 10,
    background: O, color: "#fff",
    fontSize: 14, fontWeight: 700, textDecoration: "none",
    border: "none", cursor: "pointer",
    transition: "opacity 0.15s, transform 0.15s",
    fontFamily: "inherit",
  };
  const props = {
    style,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; },
  };
  if (href) return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...props}>{children}</a>;
  return <button onClick={onClick} {...props}>{children}</button>;
}

/* ──────────────── BOUTON SECONDAIRE ──────────────── */
function BtnGhost({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "13px 24px", borderRadius: 10, border: `1.5px solid ${BORDER}`, color: DARK, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "border-color 0.15s, color 0.15s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = O; (e.currentTarget as HTMLAnchorElement).style.color = O; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = BORDER; (e.currentTarget as HTMLAnchorElement).style.color = DARK; }}>
      {children}
    </a>
  );
}

/* ──────────────── LABEL SECTION ──────────────── */
function SectionLabel({ children }: { children: string }) {
  return <span style={{ fontSize: 11, fontWeight: 800, color: O, letterSpacing: "0.12em", textTransform: "uppercase" }}>{children}</span>;
}

/* ──────────────── COMPOSANT PRINCIPAL ──────────────── */
export default function SaimAILanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", entreprise: "", sujet: "Conseil IA", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setSent(true);
  }

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Solutions", href: "#solutions" },
    { label: "À propos", href: "#about" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, -apple-system, sans-serif", color: DARK, background: "#fff", overflowX: "hidden" }}>

      {/* ══════════ NAVBAR ══════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 60, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px",
      }}>
        <Logo />

        <nav style={{ display: "flex", gap: 28, alignItems: "center" }} className="saim-desktop-nav">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} style={{ fontSize: 14, color: GRAY, fontWeight: 500, textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = DARK)}
              onMouseLeave={e => (e.currentTarget.style.color = GRAY)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BtnPrimary href="/fiscal">
            SAIM Fiscal <ArrowRight size={13} />
          </BtnPrimary>
          <button className="saim-burger" onClick={() => setMenuOpen(v => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", color: DARK, padding: 4, display: "none" }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div style={{ position: "fixed", top: 60, inset: "60px 0 0 0", zIndex: 99, background: "#fff", padding: "16px 24px", borderBottom: `1px solid ${BORDER}` }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "13px 0", fontSize: 16, fontWeight: 600, color: DARK, textDecoration: "none", borderBottom: `1px solid ${BORDER}` }}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      {/* ══════════ HERO ══════════ */}
      <section style={{ paddingTop: 130, paddingBottom: 110, paddingLeft: 48, paddingRight: 48, background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, border: `1px solid ${O}30`, background: `${O}0D`, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: O, flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: O, letterSpacing: "0.1em", textTransform: "uppercase" }}>IA POUR LES ENTREPRISES AFRICAINES</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em", color: DARK, margin: "0 0 24px" }}>
            L'intelligence artificielle<br />
            <span style={{ color: O }}>au service de votre<br />croissance</span>
          </h1>

          <p style={{ fontSize: 18, color: GRAY, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 44px", fontWeight: 400 }}>
            SAIM AI connecte vos données d'entreprise à l'IA pour automatiser, analyser et accélérer votre croissance.
          </p>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            <BtnPrimary href="#solutions">Découvrir nos solutions <ArrowRight size={15} /></BtnPrimary>

          </div>
        </div>

        {/* Motif de carrés décoratif (réutilise le logo) */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 72, opacity: 0.06 }}>
          {[...Array(5)].map((_, col) => (
            <div key={col} style={{ display: "flex", flexDirection: "column", gap: 8, marginRight: 8 }}>
              {[...Array(3)].map((_, row) => (
                <div key={row} style={{ width: 20, height: 20, borderRadius: 4, background: O }} />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ BANDE CONFIANCE ══════════ */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: SAND, padding: "20px 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", gap: 40, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Propulsé par</span>
          {["Meta LLaMA", "Groq", "Ollama", "ChromaDB", "Anthropic", "Google"].map(n => (
            <span key={n} style={{ fontSize: 13, fontWeight: 700, color: "#BEBEBE", letterSpacing: "-0.01em" }}>{n}</span>
          ))}
        </div>
      </div>

      {/* ══════════ QUI EST SAIM AI ══════════ */}
      <section id="about" style={{ padding: "96px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }} className="saim-2col">
          <div>
            <SectionLabel>À PROPOS</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, letterSpacing: "-0.04em", color: DARK, margin: "14px 0 20px", lineHeight: 1.1 }}>
              Une plateforme<br />spécialisée dans l'IA
            </h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.8, marginBottom: 14 }}>
              SAIM AI est une entreprise technologique spécialisée dans l'intelligence artificielle appliquée aux entreprises. Elle développe des <strong style={{ color: DARK }}>agents IA spécialisés</strong>, des <strong style={{ color: DARK }}>plateformes SaaS intelligentes</strong> et des <strong style={{ color: DARK }}>solutions RAG</strong> sur documents locaux.
            </p>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.8, marginBottom: 36 }}>
             SAIM AI rend l'IA accessible et rentable — avec une philosophie claire : open source, économique et adapté aux réalités africaines.
            </p>
            <BtnGhost href="#contact">En savoir plus <ArrowRight size={14} /></BtnGhost>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { v: "100 000+", l: "Documents indexés et entraînés" },
              { v: "50+", l: "Entreprises clientes" },
              { v: "2 500+", l: "Utilisateurs actifs" },
            ].map(s => (
              <div key={s.v} style={{ padding: "28px 22px", borderRadius: 14, border: `1px solid ${BORDER}`, background: SAND }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: O, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8 }}>{s.v}</div>
                <div style={{ fontSize: 13, color: GRAY, lineHeight: 1.5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ NOS SOLUTIONS ══════════ */}
      <section id="solutions" style={{ padding: "96px 48px", background: SAND }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ marginBottom: 52 }}>
            <SectionLabel>NOS SOLUTIONS</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: DARK, margin: "14px 0 14px", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              Des outils IA pour chaque besoin
            </h2>
            <p style={{ fontSize: 16, color: GRAY, maxWidth: 500, lineHeight: 1.7 }}>
              Un écosystème de solutions pensées pour les entreprises africaines — de la fiscalité à la formation.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              {
                icon: "", accent: O,
                title: "SAIM Fiscal", badge: null,
                desc: "Assistant IA dédié à la fiscalité camerounaise à jour — CGI 2025, LF 2026, circulaires DGI. Calculs exacts, sources citées, 24h/24.",
                cta: "Essayer gratuitement", href: "/fiscal", ext: false,
              },
              {
                icon: "", accent: 0,
                title: "SAIM Conseil", badge: null,
                desc: "Développement d'agents IA et chatbots sur mesure. Intégration d'infrastructure RAG sur vos documents internes et données métier.",
                cta: "Nous contacter", href: "#contact", ext: false,
              },
              {
                icon: "", accent: 0,
                title: "SAIM Course", badge: null,
                desc: "Maîtrisez l'IA selon votre métier: formations IA pour professionnels et équipes d'entreprises.",
                cta: "Découvrir", href: "https://course.mysaim.cm", ext: true,
              },
              {
                title: "SAIM Data Lab", badge: null,
                desc: "Production de datasets, annotation, et fine-tuning de modèles IA",
                cta: "En savoir plus", href: "#contact", ext: false,
              },
            ].map(s => (
              <div key={s.title} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${BORDER}`, padding: "28px", display: "flex", flexDirection: "column", gap: 14, transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s", position: "relative" }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = s.accent + "70"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 12px 40px ${s.accent}12`; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = BORDER; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
                {s.badge && <span style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 800, color: s.accent, background: s.accent + "15", padding: "3px 10px", borderRadius: 999, letterSpacing: "0.06em" }}>{s.badge}</span>}
                <div style={{ width: 44, height: 44, borderRadius: 10, background: s.accent + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: DARK, letterSpacing: "-0.02em", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.65 }}>{s.desc}</p>
                </div>
                <a href={s.href} target={s.ext ? "_blank" : undefined} rel={s.ext ? "noopener noreferrer" : undefined}
                  style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: s.accent, textDecoration: "none" }}>
                 <ChevronRight size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CONNECTEZ VOS DONNÉES ══════════ */}
      <section id="services" style={{ padding: "96px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ maxWidth: 600, marginBottom: 52 }}>
            <SectionLabel>CONSEIL & INTÉGRATION IA</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: DARK, margin: "14px 0 18px", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              Votre entreprise a des données.<br />
              <span style={{ color: O }}>SAIM AI les fait parler.</span>
            </h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.8, marginBottom: 28 }}>
              Nous développons des agents IA, des chatbots intelligents et intégrons une infrastructure IA complète dans votre entreprise. Vous avez des données inexploitées ? Vous voulez améliorer votre productivité ? SAIM AI construit la solution adaptée à votre contexte.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <BtnPrimary href="#contact">Consultation gratuite <ArrowRight size={14} /></BtnPrimary>
              <BtnGhost href="#about">En savoir plus</BtnGhost>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              { icon: <FileText size={20} color={O} />, bg: `${O}10`, title: "Documents & PDF", desc: "Procédures, contrats, archives — rendus interrogeables par l'IA." },
              { icon: <Database size={20} color="#3B82F6" />, bg: "#3B82F615", title: "Données métier", desc: "Ventes, RH, comptabilité — analysés et synthétisés en temps réel." },
              { icon: <Zap size={20} color="#7C3AED" />, bg: "#7C3AED12", title: "Automatisation", desc: "Supprimez les tâches répétitives grâce à des workflows IA." },
              { icon: <Cpu size={20} color="#059669" />, bg: "#05966912", title: "Agents sur mesure", desc: "Des agents entraînés sur vos données, disponibles 24h/24." },
            ].map(item => (
              <div key={item.title} style={{ padding: "22px", borderRadius: 14, border: `1px solid ${BORDER}`, background: SAND }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: DARK, marginBottom: 6, letterSpacing: "-0.02em" }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SAIM FISCAL FOCUS ══════════ */}
      <section style={{ padding: "96px 48px", background: SAND, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }} className="saim-2col">
          <div>
            <SectionLabel>PRODUIT PHARE</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: DARK, margin: "14px 0 16px", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              SAIM Fiscal
            </h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.8, marginBottom: 14 }}>
              Votre conseiller fiscal camerounais, disponible 24h/24. Alimenté par le <strong style={{ color: DARK }}>CGI 2025</strong> et la <strong style={{ color: DARK }}>Loi de Finances 2026</strong>.
            </p>
            <div style={{ borderLeft: `3px solid ${O}`, paddingLeft: 14, marginBottom: 28, background: "#fff", padding: "12px 16px", borderRadius: "0 8px 8px 0" }}>
              <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.65, margin: 0 }}>
                Seul assistant IA intégrant le CGI 2025 et la LF 2026 — mis à jour en <strong>moins de 48h</strong> après chaque publication officielle de la DGI.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
              {["Calcul IGS, TVA, IRPP, IS", "Procédures Fiscalis / Harmony 2", "Calendrier fiscal automatique", "Sources citées à chaque réponse"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: DARK, lineHeight: 1.5 }}>
                  <span style={{ marginTop: 2, width: 16, height: 16, borderRadius: "50%", background: `${O}18`, border: `1px solid ${O}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 9, color: O, fontWeight: 900, lineHeight: 1 }}>✓</span>
                  </span>
                  {f}
                </div>
              ))}
            </div>
            <BtnPrimary href="/fiscal">
              Utiliser SAIM Fiscal gratuitement <ArrowRight size={15} />
            </BtnPrimary>
          </div>

          {/* Mockup */}
          <div style={{ borderRadius: 18, border: `1px solid ${BORDER}`, background: "#fff", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.07)" }}>
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}`, background: SAND, display: "flex", alignItems: "center", gap: 6 }}>
              {["#FF5F57","#FFBD2E","#28CA42"].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />)}
              <span style={{ flex: 1, textAlign: "center", fontSize: 11, color: GRAY, fontWeight: 600 }}>fiscal.mysaim.cm</span>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
                <div style={{ padding: "10px 14px", borderRadius: "14px 14px 2px 14px", background: SAND, fontSize: 13, color: DARK, maxWidth: "80%", lineHeight: 1.5 }}>
                  Quel est mon IGS pour un CA de 12 000 000 FCFA ?
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${O}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>🧾</div>
                <div style={{ padding: "10px 14px", borderRadius: "2px 14px 14px 14px", background: `${O}10`, border: `1px solid ${O}20`, fontSize: 13, color: DARK, lineHeight: 1.65 }}>
                  Vous êtes en <strong>Classe 6</strong> — IGS : <strong>150 000 FCFA/an</strong>, soit 37 500 FCFA/trimestre.
                  <span style={{ display: "block", fontSize: 11, color: GRAY, marginTop: 5 }}>Source : Art. C40, LF 2026 — DGI Cameroun</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderRadius: 10, border: `1px solid ${BORDER}` }}>
                <span style={{ flex: 1, fontSize: 12, color: "#BEBEBE" }}>Posez votre question fiscale…</span>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: O, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowRight size={12} color="#fff" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SAIM COURSE ══════════ */}
      <section style={{ padding: "96px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }} className="saim-2col">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "🚀", t: "Découverte IA", d: "Comprendre l'IA sans coder." },
              { icon: "💡", t: "Prompting avancé", d: "Maîtrisez les modèles IA." },
              { icon: "🏢", t: "IA pour PME", d: "Automatisez votre entreprise." },
              { icon: "🔧", t: "RAG & Agents", d: "Construisez sur vos données." },
            ].map(item => (
              <div key={item.t} style={{ padding: "20px", borderRadius: 14, border: `1px solid ${BORDER}`, background: SAND }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{item.icon}</div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: DARK, marginBottom: 4, letterSpacing: "-0.02em" }}>{item.t}</h4>
                <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6 }}>{item.d}</p>
              </div>
            ))}
          </div>
          <div>
            <SectionLabel>FORMATION</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: DARK, margin: "14px 0 16px", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              SAIM Course
            </h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.8, marginBottom: 16 }}>
              Maîtrisez l'IA à votre rythme. Une plateforme de formation conçue pour le contexte africain — pédagogie pratique, contenu en français, certifications reconnues.
            </p>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.75, marginBottom: 32 }}>
              Des parcours personnalisés pour professionnels, entrepreneurs et équipes d'entreprises qui veulent acquérir des compétences IA applicables immédiatement.
            </p>
            <BtnPrimary href="https://course.mysaim.cm" external>
              Explorer les formations <ArrowRight size={15} />
            </BtnPrimary>
          </div>
        </div>
      </section>

      {/* ══════════ AVANTAGES ══════════ */}
      <section style={{ padding: "96px 48px", background: SAND }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <SectionLabel>POURQUOI SAIM AI</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: DARK, marginTop: 14, letterSpacing: "-0.04em" }}>
              Ce que personne d'autre n'offre
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 14 }}>
            {[
              { icon: <Shield size={18} color={O} />, t: "Souveraineté des données", d: "Vos données hébergées en Afrique, jamais partagées. Conformité aux lois africaines de protection des données." },
              { icon: <Globe size={18} color="#3B82F6" />, t: "Contexte local africain", d: "CGI 2025, LF 2026, OHADA, CEMAC — notre IA connaît vraiment les réglementations africaines." },
              { icon: <RefreshCw size={18} color="#059669" />, t: "Mise à jour en 48h", d: "Chaque nouvelle loi ou circulaire DGI est intégrée dans notre base documentaire en moins de 48 heures." },
              { icon: <BarChart3 size={18} color="#7C3AED" />, t: "Calculs déterministes", d: "IGS, TVA, IRPP calculés par des algorithmes exacts — pas d'hallucination sur les montants." },
              { icon: <BookOpen size={18} color="#D97706" />, t: "Sources toujours citées", d: "Chaque réponse cite l'article exact. Vous vérifiez, vous décidez en connaissance de cause." },
              { icon: <Users size={18} color="#DB2777" />, t: "Open source & transparent", d: "LLaMA, Qwen3, ChromaDB — code public et auditable. Pas de vendor lock-in." },
            ].map(item => (
              <div key={item.t} style={{ padding: "22px", borderRadius: 14, border: `1px solid ${BORDER}`, background: "#fff", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: SAND, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: DARK, marginBottom: 5, letterSpacing: "-0.02em" }}>{item.t}</h3>
                  <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.65 }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PARTENAIRES ══════════ */}
      <section style={{ padding: "48px 48px", background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: GRAY, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 28 }}>Technologies & Partenaires</p>
          <div style={{ display: "flex", gap: 36, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            {["Meta", "Google", "Anthropic", "Groq", "Ollama", "LangChain", "Hugging Face", "Facebook"].map(n => (
              <span key={n} style={{ fontSize: 14, fontWeight: 700, color: "#D1D5DB" }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CONTACT ══════════ */}
      <section id="contact" style={{ padding: "96px 48px", background: SAND }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <SectionLabel>CONTACT</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: DARK, marginTop: 14, letterSpacing: "-0.04em" }}>
              Parlons de votre projet
            </h2>
            <p style={{ fontSize: 16, color: GRAY, marginTop: 12 }}>
              Première consultation gratuite. Notre équipe vous répond sous .
            </p>
          </div>

          {sent ? (
            <div style={{ textAlign: "center", padding: "48px 32px", borderRadius: 18, background: "#fff", border: `1px solid ${BORDER}` }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${O}12`, border: `2px solid ${O}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>✓</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: DARK, marginBottom: 8 }}>Message envoyé !</h3>
              <p style={{ color: GRAY, fontSize: 15 }}>Notre équipe vous contactera dans les 24 heures.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 18, border: `1px solid ${BORDER}`, padding: "40px", display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Nom *" placeholder="Votre nom" value={form.nom} onChange={v => setForm(p => ({ ...p, nom: v }))} required />
                <Field label="Email *" placeholder="vous@entreprise.cm" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} type="email" required />
              </div>
              <Field label="Entreprise" placeholder="Nom de votre entreprise" value={form.entreprise} onChange={v => setForm(p => ({ ...p, entreprise: v }))} />
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 6 }}>Sujet</label>
                <select value={form.sujet} onChange={e => setForm(p => ({ ...p, sujet: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: `1.5px solid ${BORDER}`, fontSize: 14, color: DARK, background: "#fff", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                  {["Conseil IA", "Intégration IA", "SAIM Fiscal", "SAIM Course", "SAIM Data Lab","projet d'entreprise","partenariats","Autre"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 6 }}>Message *</label>
                <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Décrivez votre projet ou besoin…" rows={4}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: `1.5px solid ${BORDER}`, fontSize: 14, color: DARK, background: "#fff", outline: "none", resize: "vertical", fontFamily: "inherit", transition: "border-color 0.15s", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = O)}
                  onBlur={e => (e.target.style.borderColor = BORDER)} />
              </div>
              <BtnPrimary>Envoyer <ArrowRight size={15} /></BtnPrimary>
              <p style={{ textAlign: "center", fontSize: 12, color: GRAY, margin: 0 }}>contact@mysaim.cm</p>
            </form>
          )}
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: DARK, color: "#fff", padding: "56px 48px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }} className="saim-footer-grid">
            <div>
              <Logo dark={false} />
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, maxWidth: 260, marginTop: 16 }}>
                L'intelligence artificielle au service de la croissance.
              </p>
            </div>
            {[
              { title: "Produits", links: ["SAIM Fiscal", "SAIM Course", "SAIM Data Lab"] },
              { title: "Entreprise", links: ["À propos", "Blog", "Contact", "Carrières"] },
              { title: "Légal", links: ["Mentions légales", "Confidentialité", "CGU"] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</p>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none", marginBottom: 10, transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>© 2025 SAIM AI · Tous droits réservés</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>Fait au Cameroun 🇨🇲, pour l'Afrique</p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .saim-2col { grid-template-columns: 1fr !important; gap: 40px !important; }
          .saim-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
          .saim-desktop-nav { display: none !important; }
          .saim-burger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .saim-burger { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, type = "text", required = false }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 6 }}>{label}</label>
      <input required={required} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: `1.5px solid ${BORDER}`, fontSize: 14, color: DARK, background: "#fff", outline: "none", transition: "border-color 0.15s", boxSizing: "border-box", fontFamily: "inherit" }}
        onFocus={e => (e.target.style.borderColor = O)}
        onBlur={e => (e.target.style.borderColor = BORDER)} />
    </div>
  );
}
