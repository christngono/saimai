"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SAIM, SaimLogoH, SaimMark, Footer } from "./SaimUI";

/* ─── Hook responsive ─── */
function useResponsive() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return {
    isMobile: width > 0 && width < 768,
    isTablet: width >= 768 && width < 1024,
    isSmall: width > 0 && width < 1024,
  };
}

/* ─── Icônes nav dropdown ─── */
function IconAudit() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  );
}
function IconCourse() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}
function IconDataLab() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
    </svg>
  );
}
function IconSaimAI() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  );
}
function IconAgent() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M12 2a3 3 0 0 1 3 3v6H9V5a3 3 0 0 1 3-3z"/>
      <circle cx="9" cy="16" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

/* ─── Icônes animation demo ─── */
function FiscalSvg({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}
function MarketingSvg({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}
function InvoiceSvg({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16l3-3 3 3 3-3 3 3 3-3V4a2 2 0 0 0-2-2z"/>
      <line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="14" y2="13"/>
    </svg>
  );
}
function CheckCircleSvg() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
function CursorSvg() {
  return (
    <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
      <path d="M2 1L2 13L5 10L7 15L9 14L7 9.5L11 9.5Z" fill="#FBFAF7" stroke="rgba(26,22,18,0.5)" strokeWidth="0.7" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Nav ─── */
const SOLUTIONS = [
  { label: "Audit et conseil en stratégie IA", desc: "Analyse et feuille de route IA",       href: "/services",                   icon: <IconAudit /> },
  { label: "Formation SAIM Course",             desc: "Apprenez l'IA à votre rythme",         href: "https://course.mysaim.com",   icon: <IconCourse />, external: true },
  { label: "Data Lab",                          desc: "Données synthétiques & annotation",    href: "/services",                   icon: <IconDataLab /> },
  { label: "SAIM AI",                           desc: "La plateforme complète pour les PME",  href: "/services",                   icon: <IconSaimAI /> },
  { label: "Agent IA",                          desc: "Six agents experts, disponibles 24h",  href: "/dashboard",                  icon: <IconAgent /> },
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#141413" strokeWidth="1.8" strokeLinecap="round">
      {open ? (
        <><line x1="5" y1="5" x2="17" y2="17"/><line x1="17" y1="5" x2="5" y2="17"/></>
      ) : (
        <><line x1="3" y1="7" x2="19" y2="7"/><line x1="3" y1="11" x2="19" y2="11"/><line x1="3" y1="15" x2="19" y2="15"/></>
      )}
    </svg>
  );
}

function LandingNav() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSmall } = useResponsive();

  const linkStyle = {
    fontFamily: "'Inter Tight', system-ui, sans-serif",
    fontSize: 14, fontWeight: 500,
    color: "#73726C",
    textDecoration: "none",
    letterSpacing: "-0.01em",
  } as const;

  return (
    <>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isSmall ? "14px 20px" : "14px 48px",
        background: "#FBFAF7",
        borderBottom: "1px solid #DEDEDD",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <SaimLogoH size={28} dark={true} />

        {/* Desktop links */}
        {!isSmall && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              style={{ position: "relative", paddingBottom: 14, marginBottom: -14 }}
            >
              <button style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "none", border: "none", cursor: "pointer",
                ...linkStyle,
                color: open ? "#1A1612" : "#73726C",
              }}>
                Solutions
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {open && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: "50%",
                  transform: "translateX(-50%)",
                  background: "#FBFAF7",
                  border: "1px solid #DEDEDD",
                  borderRadius: 16, padding: "8px", minWidth: 320,
                  boxShadow: "0 8px 40px rgba(26,22,18,0.10), 0 2px 8px rgba(26,22,18,0.04)",
                }}>
                  <div style={{
                    position: "absolute", top: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)",
                    width: 10, height: 10, background: "#FBFAF7",
                    border: "1px solid #DEDEDD", borderRight: "none", borderBottom: "none",
                  }}/>
                  {SOLUTIONS.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      prefetch={false}
                      {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "10px 12px", borderRadius: 10,
                        textDecoration: "none", color: "#1A1612",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#F0EEE9"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: "#F0EEE9",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: SAIM.accent,
                      }}>
                        {s.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: "#1A1612", lineHeight: 1.3 }}>{s.label}</div>
                        <div style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 12, color: "#73726C", marginTop: 2, lineHeight: 1.3 }}>{s.desc}</div>
                      </div>
                      {s.external && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DEDEDD" strokeWidth="2" strokeLinecap="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a href="#tarifs" style={linkStyle}>Tarifs</a>
            <Link href="/contact" prefetch={false} style={linkStyle}>Contact</Link>
          </div>
        )}

        {/* Desktop CTA buttons */}
        {!isSmall && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/dashboard" prefetch={false} style={{
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: 14, fontWeight: 500,
              color: "#73726C", textDecoration: "none",
              padding: "9px 18px", borderRadius: 10,
              border: "1px solid #DEDEDD",
            }}>
              Connexion
            </Link>
            <Link href="/dashboard" prefetch={false} style={{
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: 14, fontWeight: 600,
              color: "#FBFAF7", textDecoration: "none",
              padding: "9px 20px", borderRadius: 10,
              background: "#1A1612",
            }}>
              Essayer SAIM
            </Link>
          </div>
        )}

        {/* Mobile hamburger */}
        {isSmall && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/dashboard" prefetch={false} style={{
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: 13, fontWeight: 600,
              color: "#FBFAF7", textDecoration: "none",
              padding: "8px 16px", borderRadius: 10,
              background: "#1A1612",
            }}>
              Essayer
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        )}
      </nav>

      {/* Mobile full-screen menu overlay */}
      {isSmall && menuOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "#FBFAF7", zIndex: 200,
          display: "flex", flexDirection: "column",
          padding: "14px 20px",
          overflowY: "auto",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <SaimLogoH size={28} dark={true} />
            <button
              onClick={() => setMenuOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              <HamburgerIcon open={true} />
            </button>
          </div>

          {/* Links */}
          <div style={{ borderTop: "1px solid #DEDEDD" }}>
            {SOLUTIONS.map(s => (
              <Link
                key={s.label}
                href={s.href}
                prefetch={false}
                {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "16px 0",
                  borderBottom: "1px solid #DEDEDD",
                  textDecoration: "none", color: "#1A1612",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: "#F0EEE9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: SAIM.accent,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 15, fontWeight: 600, color: "#1A1612" }}>{s.label}</div>
                  <div style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 12, color: "#73726C", marginTop: 2 }}>{s.desc}</div>
                </div>
              </Link>
            ))}
            <a href="#tarifs" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "16px 0", borderBottom: "1px solid #DEDEDD", fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 15, fontWeight: 500, color: "#141413", textDecoration: "none" }}>
              Tarifs
            </a>
            <Link href="/contact" prefetch={false} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "16px 0", borderBottom: "1px solid #DEDEDD", fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 15, fontWeight: 500, color: "#141413", textDecoration: "none" }}>
              Contact
            </Link>
          </div>

          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/dashboard" prefetch={false} onClick={() => setMenuOpen(false)} style={{
              textAlign: "center",
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: 15, fontWeight: 500,
              color: "#73726C", textDecoration: "none",
              padding: "13px 20px", borderRadius: 10,
              border: "1px solid #DEDEDD",
            }}>
              Connexion
            </Link>
            <Link href="/dashboard" prefetch={false} onClick={() => setMenuOpen(false)} style={{
              textAlign: "center",
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: 15, fontWeight: 600,
              color: "#FBFAF7", textDecoration: "none",
              padding: "13px 20px", borderRadius: 10,
              background: "#1A1612",
            }}>
              Essayer SAIM gratuitement
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Animation démo ─── */
const Q1 = "What is the fiscal status of my client this month?";
const Q2 = "Generate an invoice for Mike";

function PlatformDemo() {
  const [cycle, setCycle]       = useState(0);
  const [phase, setPhase]       = useState(0);
  const [introText, setIntroText] = useState("");
  const [q1Text, setQ1Text]     = useState("");
  const [q2Text, setQ2Text]     = useState("");
  const [respLines, setRespLines] = useState(0);

  useEffect(() => {
    setPhase(0); setIntroText(""); setQ1Text(""); setQ2Text(""); setRespLines(0);

    const T: ReturnType<typeof setTimeout>[] = [];
    const IVs: ReturnType<typeof setInterval>[] = [];

    const INTRO = "What do you manage today?";
    let ci = 0;
    const iv0 = setInterval(() => {
      ci++; setIntroText(INTRO.slice(0, ci));
      if (ci >= INTRO.length) clearInterval(iv0);
    }, 52);
    IVs.push(iv0);

    T.push(setTimeout(() => setPhase(1), 1500));
    T.push(setTimeout(() => setPhase(2), 2500));
    T.push(setTimeout(() => setPhase(3), 3300));
    T.push(setTimeout(() => setPhase(4), 3900));

    T.push(setTimeout(() => {
      setPhase(5);
      let ci2 = 0;
      const iv1 = setInterval(() => {
        ci2++; setQ1Text(Q1.slice(0, ci2));
        if (ci2 >= Q1.length) clearInterval(iv1);
      }, 30);
      IVs.push(iv1);
    }, 4500));

    T.push(setTimeout(() => { setPhase(6); setRespLines(1); }, 6400));
    T.push(setTimeout(() => setRespLines(2), 7100));
    T.push(setTimeout(() => setRespLines(3), 7800));

    T.push(setTimeout(() => {
      setPhase(7);
      let ci3 = 0;
      const iv2 = setInterval(() => {
        ci3++; setQ2Text(Q2.slice(0, ci3));
        if (ci3 >= Q2.length) clearInterval(iv2);
      }, 42);
      IVs.push(iv2);
    }, 8800));

    T.push(setTimeout(() => setPhase(8), 10300));
    T.push(setTimeout(() => setCycle(c => c + 1), 13500));

    return () => { T.forEach(clearTimeout); IVs.forEach(clearInterval); };
  }, [cycle]);

  const BTNS = [
    { label: "Fiscal",    icon: <FiscalSvg />,    isTarget: true },
    { label: "Marketing", icon: <MarketingSvg /> },
    { label: "Invoice",   icon: <InvoiceSvg /> },
  ];

  return (
    <div style={{
      background: "#1A1612",
      borderRadius: 20, overflow: "hidden",
      fontFamily: "'Inter Tight', system-ui, sans-serif",
      boxShadow: "0 28px 72px rgba(26,22,18,0.22), 0 4px 16px rgba(26,22,18,0.10)",
    }}>
      {/* macOS titlebar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 18px",
        borderBottom: "1px solid rgba(251,250,247,0.06)",
        background: "rgba(251,250,247,0.02)",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ef4444","#f59e0b","#22c55e"].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.6 }}/>
          ))}
        </div>
        <div style={{ flex: 1, textAlign: "center" as const }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(251,250,247,0.28)", letterSpacing: "0.1em" }}>
            SAIM AI — Agent Platform
          </span>
        </div>
        <div style={{ width: 42 }}/>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 20px 6px", minHeight: 340 }}>

        {/* Intro */}
        <div style={{ textAlign: "center" as const, marginBottom: 22 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", color: "rgba(251,250,247,0.28)", textTransform: "uppercase" as const, marginBottom: 12 }}>
            SAIM AI
          </div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#FBFAF7", minHeight: 26, letterSpacing: "-0.01em" }}>
            {introText}
            {phase === 0 && (
              <span className="cursor-blink" style={{ display: "inline-block", width: 2, height: 16, background: "#FBFAF7", marginLeft: 2, verticalAlign: "middle" }}/>
            )}
          </div>
        </div>

        {/* Category buttons + cursor */}
        {phase >= 1 && (
          <div style={{ position: "relative" as const }}>
            {phase === 2 && (
              <div className="demo-appear" style={{
                position: "absolute" as const,
                top: -14, left: "calc(50% - 86px)",
                zIndex: 10, pointerEvents: "none" as const,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <CursorSvg />
              </div>
            )}

            <div className="demo-zoom-in" style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
              {BTNS.map(btn => (
                <div key={btn.label} style={{
                  display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6,
                  padding: "10px 16px", borderRadius: 12,
                  background: "#141413",
                  border: `1px solid ${
                    btn.isTarget && phase === 2 ? "rgba(251,250,247,0.45)"
                    : btn.isTarget && phase >= 3 ? "rgba(194,86,44,0.5)"
                    : "rgba(251,250,247,0.10)"
                  }`,
                  color: "#FBFAF7",
                  transform: btn.isTarget && phase === 3 ? "scale(0.91)" : "scale(1)",
                  transition: "all 0.18s ease",
                  boxShadow: btn.isTarget && phase === 2 ? "0 0 0 3px rgba(251,250,247,0.10)" : "none",
                  ...(btn.isTarget && phase === 2 ? { animation: "pulseGlow 1s infinite ease-out" } : {}),
                }}>
                  <div style={{ color: btn.isTarget && phase >= 3 ? SAIM.accent : "rgba(251,250,247,0.75)" }}>
                    {btn.icon}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.02em" }}>{btn.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat area */}
        {phase >= 4 && (
          <div className="demo-slide-up" style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#C2562C" }}/>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(251,250,247,0.35)", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
                SAIM Fiscal
              </span>
            </div>

            {phase >= 5 && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="demo-slide-right" style={{
                  background: "rgba(251,250,247,0.09)", border: "1px solid rgba(251,250,247,0.07)",
                  borderRadius: "14px 14px 4px 14px",
                  padding: "9px 13px", maxWidth: "90%",
                  fontSize: 12.5, color: "rgba(251,250,247,0.82)", lineHeight: 1.5,
                }}>
                  {q1Text}
                  {q1Text.length < Q1.length && (
                    <span className="cursor-blink" style={{ display: "inline-block", width: 1.5, height: 13, background: "rgba(251,250,247,0.6)", marginLeft: 2, verticalAlign: "middle" }}/>
                  )}
                </div>
              </div>
            )}

            {phase >= 6 && (
              <div className="demo-appear" style={{ display: "flex", gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  background: "#C2562C",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <SaimMark size={14} fg="#fff"/>
                </div>
                <div style={{
                  background: "rgba(251,250,247,0.05)", border: "1px solid rgba(251,250,247,0.08)",
                  borderRadius: "4px 14px 14px 14px",
                  padding: "10px 13px", flex: 1,
                  fontSize: 12.5, color: "rgba(251,250,247,0.72)", lineHeight: 1.9,
                }}>
                  {respLines >= 1 && <div className="demo-slide-up">IRPP <strong style={{ color: "#FBFAF7", fontWeight: 600 }}>$350</strong></div>}
                  {respLines >= 2 && <div className="demo-slide-up">Income Tax <strong style={{ color: "#FBFAF7", fontWeight: 600 }}>$400</strong></div>}
                  {respLines >= 3 && <div className="demo-slide-up">VAT <strong style={{ color: "#FBFAF7", fontWeight: 600 }}>$350</strong></div>}
                </div>
              </div>
            )}

            {phase >= 7 && (
              <div className="demo-slide-up" style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{
                  background: "rgba(251,250,247,0.09)", border: "1px solid rgba(251,250,247,0.07)",
                  borderRadius: "14px 14px 4px 14px",
                  padding: "9px 13px", maxWidth: "90%",
                  fontSize: 12.5, color: "rgba(251,250,247,0.82)", lineHeight: 1.5,
                }}>
                  {q2Text}
                  {q2Text.length < Q2.length && (
                    <span className="cursor-blink" style={{ display: "inline-block", width: 1.5, height: 13, background: "rgba(251,250,247,0.6)", marginLeft: 2, verticalAlign: "middle" }}/>
                  )}
                </div>
              </div>
            )}

            {phase >= 8 && (
              <div className="demo-zoom-in" style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px",
                background: "rgba(34,197,94,0.07)",
                border: "1px solid rgba(34,197,94,0.22)",
                borderRadius: 12,
              }}>
                <CheckCircleSvg/>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#22c55e" }}>Invoice sent successfully</div>
                  <div style={{ fontSize: 11, color: "rgba(251,250,247,0.38)", marginTop: 2 }}>Mike · PDF generated · $1,250.00</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{
        margin: "14px 16px 16px",
        padding: "10px 14px",
        background: "rgba(251,250,247,0.03)",
        border: "1px solid rgba(251,250,247,0.07)",
        borderRadius: 12,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ flex: 1, fontSize: 12, color: "rgba(251,250,247,0.18)", fontStyle: "italic" }}>Ask anything…</span>
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          background: "#141413", border: "1px solid rgba(251,250,247,0.10)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(251,250,247,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ─── */
function Hero() {
  const { isMobile, isTablet, isSmall } = useResponsive();

  const hPad = isMobile ? "60px 24px 72px" : isTablet ? "72px 36px 88px" : "88px 48px 104px";
  const fontSize = isMobile ? 40 : isTablet ? 52 : 68;
  const subFontSize = isMobile ? 16 : 18;

  return (
    <section style={{ background: "#FBFAF7", padding: hPad }}>
      <div style={{
        maxWidth: 1080, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isSmall ? "1fr" : "1.15fr 1fr",
        gap: isSmall ? 48 : 72,
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 24 }}>
            Super Agent Intelligent Multimodal
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.0, margin: "0 0 12px", color: "#141413" }}>
            SAIM AI gère<br />votre entreprise.
          </h1>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.0, margin: "0 0 32px", color: SAIM.accent, fontStyle: "italic" }}>
            Vous, vous la<br />faites grandir.
          </h2>
          <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: subFontSize, lineHeight: 1.6, color: "#73726C", maxWidth: 440, marginBottom: 8 }}>
            Fiscalité, RH, comptabilité — <strong style={{ color: "#141413", fontWeight: 500 }}>automatisés.</strong>
          </p>
          <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: subFontSize, lineHeight: 1.6, color: "#73726C", maxWidth: 440, marginBottom: 40 }}>
            Sans recruter. Sans exploser votre budget.
          </p>
          <Link href="/dashboard" prefetch={false} style={{
            display: "inline-block",
            background: "#141413", color: "#FBFAF7",
            padding: isMobile ? "13px 24px" : "14px 28px", borderRadius: 12,
            fontSize: 15, fontWeight: 600,
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            textDecoration: "none",
          }}>
            Essayer gratuitement
          </Link>
        </div>

        {/* Demo card: visible on tablet+ */}
        {!isMobile && <PlatformDemo />}
      </div>

      {/* Demo card visible on mobile, below text */}
      {isMobile && (
        <div style={{ maxWidth: 480, margin: "0 auto", paddingTop: 0 }}>
          <PlatformDemo />
        </div>
      )}
    </section>
  );
}

/* ─── Foire aux questions ─── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { isMobile, isTablet } = useResponsive();

  const faqs = [
    {
      q: "C'est quoi SAIM AI et comment ça fonctionne ?",
      a: "SAIM AI est une plateforme d'intelligence artificielle conçue pour les entrepreneurs et les PME. Elle regroupe plusieurs agents experts (fiscal, RH, commercial, juridique…) accessibles par simple chat. Vous posez votre question, l'agent analyse et vous répond avec précision en s'appuyant sur des textes officiels et des données réelles — sans hallucination.",
    },
    {
      q: "Peut-on utiliser SAIM gratuitement ?",
      a: "Oui. L'offre gratuite donne accès à 10 questions par jour pendant 2 mois, sans carte bancaire requise. Au-delà, nos forfaits Starter (5$/mois) et Pro (24$/mois) offrent un accès illimité avec des fonctionnalités avancées.",
    },
    {
      q: "Mes données sont-elles sécurisées ?",
      a: "Oui. Nous utilisons des modèles open source hébergés sur notre propre infrastructure — vos données ne sont jamais transmises à des tiers. Souveraineté totale garantie.",
    },
  ];

  const pad = isMobile ? "64px 24px" : isTablet ? "80px 36px" : "96px 48px";

  return (
    <section id="faq" style={{ background: "#FBFAF7", padding: pad }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{
          textAlign: "center" as const,
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: isMobile ? 32 : 42, fontWeight: 400, letterSpacing: "-0.03em",
          color: "#141413", margin: "0 0 48px",
        }}>
          Foire aux <em style={{ fontStyle: "italic", color: SAIM.accent }}>questions.</em>
        </h2>

        <div style={{ borderTop: "1px solid #DEDEDD" }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderBottom: "1px solid #DEDEDD" }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "22px 0", background: "none", border: "none", cursor: "pointer",
                  textAlign: "left" as const,
                }}
              >
                <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: isMobile ? 16 : 19, fontWeight: 400, letterSpacing: "-0.02em", color: "#141413" }}>
                  {f.q}
                </span>
                <span style={{
                  fontSize: 22, color: "#141413", flexShrink: 0, marginLeft: 16,
                  transition: "transform 0.2s",
                  transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                  display: "inline-block",
                }}>+</span>
              </button>
              {openIndex === i && (
                <div style={{ paddingBottom: 20, paddingRight: isMobile ? 16 : 48 }}>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "#73726C", margin: 0 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Hook détection devise ─── */
function useCurrency() {
  const [sym, setSym] = useState("$");
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    const eurZones = [
      "Europe/Paris","Europe/Berlin","Europe/Madrid","Europe/Rome",
      "Europe/Amsterdam","Europe/Brussels","Europe/Vienna","Europe/Lisbon",
      "Europe/Dublin","Europe/Helsinki","Europe/Warsaw","Europe/Prague",
      "Europe/Budapest","Europe/Bucharest","Europe/Athens","Europe/Sofia",
      "Europe/Tallinn","Europe/Riga","Europe/Vilnius","Europe/Luxembourg","Europe/Malta",
    ];
    if (eurZones.includes(tz)) setSym("€");
    else if (tz === "Europe/London") setSym("£");
  }, []);
  return sym;
}

/* ─── Tarifs ─── */
const PLANS = [
  {
    name: "Starter", price: 5,
    items: [
      "1 000 crédits IA / mois",
      "Conseil fiscal (IRPP, IS, TVA)",
      "Création de contenus marketing",
      "Génération de devis & factures",
      "Comptabilité de base",
      "Gestion de projets",
      "Support email",
    ],
    pop: false,
  },
  {
    name: "Pro", price: 24,
    items: [
      "5 000 crédits IA / mois",
      "Tout le plan Starter",
      "Gestion RH complète (CDI, fiches de paie)",
      "Rédaction de contrats commerciaux",
      "Documents juridiques (CGV, statuts)",
      "Stratégie commerciale",
      "Support prioritaire",
    ],
    pop: true,
  },
  {
    name: "Business", price: 49,
    items: [
      "Crédits illimités",
      "6 agents IA spécialisés",
      "Multi-utilisateurs (jusqu'à 5)",
      "Tableau de bord analytique avancé",
      "Option white-label",
      "Support dédié + formation incluse",
    ],
    pop: false,
  },
];

function PricingSection() {
  const sym = useCurrency();
  const { isMobile, isTablet } = useResponsive();

  const pad = isMobile ? "64px 24px" : isTablet ? "80px 36px" : "96px 48px";
  const cols = isMobile || isTablet ? "1fr" : "repeat(3, 1fr)";

  return (
    <section id="tarifs" style={{ background: "#FBFAF7", padding: pad }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: "0.22em", textTransform: "uppercase" as const,
            color: "#141413", marginBottom: 16,
          }}>
            Découvrir nos tarifs
          </div>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: isMobile ? 32 : 42, fontWeight: 400, letterSpacing: "-0.03em",
            color: "#141413", margin: 0,
          }}>
            Simple. <em style={{ fontStyle: "italic", color: SAIM.accent }}>Accessible.</em>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: cols, gap: 16 }}>
          {PLANS.map(p => (
            <div key={p.name} style={{
              background: "#ffffff",
              border: p.pop ? "2px solid #141413" : "1px solid #FBFAF7",
              borderRadius: 18, padding: isMobile ? "24px 20px" : "32px 28px",
              display: "flex", flexDirection: "column" as const,
              position: "relative" as const,
              boxShadow: p.pop
                ? "0 8px 32px rgba(26,22,18,0.10)"
                : "0 2px 12px rgba(26,22,18,0.06)",
            }}>
              {p.pop && (
                <div style={{
                  position: "absolute" as const, top: -12, left: 24,
                  background: "#141413", color: "#FBFAF7",
                  padding: "4px 14px", borderRadius: 999,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const,
                }}>
                  Populaire
                </div>
              )}

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#73726C", marginBottom: 16 }}>
                {p.name}
              </div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 48, fontWeight: 400, letterSpacing: "-0.03em", color: "#141413", marginBottom: 2, lineHeight: 1 }}>
                {sym}{p.price}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#73726C", marginBottom: 28 }}>
                / mois
              </div>

              <div style={{ flex: 1, marginBottom: 24 }}>
                {p.items.map(it => (
                  <div key={it} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, lineHeight: 1.45, marginBottom: 10, color: "#73726C" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#141413" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {it}
                  </div>
                ))}
              </div>

              <Link href="/dashboard" prefetch={false} style={{
                textAlign: "center" as const, padding: "13px 0", borderRadius: 10, display: "block",
                background: "#141413", color: "#FBFAF7",
                fontSize: 14, fontWeight: 600, textDecoration: "none",
                fontFamily: "'Inter Tight', system-ui, sans-serif",
              }}>
                Essayer gratuitement
              </Link>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center" as const, marginTop: 28, fontSize: 13, color: "#73726C" }}>
          Offre gratuite disponible — 10 questions/jour · Sans carte bancaire
        </p>
      </div>
    </section>
  );
}

/* ─── Page principale ─── */
export default function SaimAILanding() {
  return (
    <div style={{ background: "#FBFAF7", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
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
