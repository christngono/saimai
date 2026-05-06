"use client";

import Link from "next/link";

/* ─── Design tokens ─── */
export const SAIM = {
  paper:       "#F5F1E8",
  paperAlt:    "#EBE5D5",
  paperHi:     "#FBF8F1",
  ink:         "#1A1612",
  inkSoft:     "#3D3530",
  muted:       "#6B5F55",
  faint:       "#A89F94",
  border:      "#D8CFBE",
  accent:      "#C2562C",
  accentDark:  "#9B3F1C",
  accentLight: "#E68B5C",
  accentSoft:  "#F4D9C8",
};

/* ─── SaimMark — 3 pièces L, 16 cellules ─── */
export function SaimMark({ size = 32, fg = SAIM.accent }: { size?: number; fg?: string }) {
  const gap = 5, rx = 6, N = 5;
  const cs = (200 - gap * (N + 1)) / N;
  const cell = (x: number, y: number) => ({
    x: gap + x * (cs + gap), y: gap + y * (cs + gap),
    width: cs, height: cs, rx,
  });
  const top:    [number, number][] = [[1,0],[2,0],[3,0],[4,0]];
  const middle: [number, number][] = [[0,0],[0,1],[0,2],[1,2],[2,2]];
  const bottom: [number, number][] = [[4,2],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4]];
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {[...top, ...middle, ...bottom].map(([x, y], i) => (
        <rect key={i} {...cell(x, y)} fill={fg} />
      ))}
    </svg>
  );
}

/* ─── Logo horizontal ─── */
export function SaimLogoH({ size = 28, dark = true }: { size?: number; dark?: boolean }) {
  const h = Math.round(size * 1.25);
  return (
    <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
      <img
        src="/simplelogo.svg"
        height={h}
        alt="SAIM AI"
        style={{ display: "block", filter: dark ? "none" : "brightness(0) invert(1)" }}
      />
    </Link>
  );
}

/* ─── Navigation ─── */
const NAV_LINKS = [
  { href: "/",          label: "Home",     id: "home" },
  { href: "/about",     label: "About",    id: "about" },
  { href: "/services",  label: "Services", id: "services" },
  { href: "/dashboard", label: "AI Agent", id: "agent" },
];

export function Nav({ activePage = "home", dark = false }: { activePage?: string; dark?: boolean }) {
  const bg  = dark ? SAIM.ink : "rgba(245,241,232,0.95)";
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 48px", background: bg,
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${dark ? "rgba(245,241,232,0.08)" : SAIM.border}`,
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <SaimLogoH size={28} dark={!dark} />
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {NAV_LINKS.map(p => (
          <Link key={p.id} href={p.href} style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 14, fontWeight: 500,
            color: p.id === activePage ? SAIM.accent : (dark ? "rgba(245,241,232,0.7)" : SAIM.muted),
            textDecoration: "none", letterSpacing: "-0.01em",
          }}>{p.label}</Link>
        ))}
        <Link href="/dashboard" prefetch={false} style={{
          background: SAIM.accent, color: SAIM.paper,
          padding: "10px 20px", borderRadius: 10,
          fontSize: 14, fontWeight: 500,
          fontFamily: "'Inter Tight', system-ui, sans-serif",
          textDecoration: "none",
        }}>Free trial</Link>
      </div>
    </nav>
  );
}

/* ─── Footer ─── */
const FOOTER_COLS = [
  { title: "Products", items: [{ label: "SAIM Platform", href: "/dashboard" }, { label: "SAIM Fiscal", href: "/dashboard" }, { label: "Services", href: "/services" }] },
  { title: "Company",  items: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }] },
  { title: "Legal",    items: [{ label: "Terms", href: "#" }, { label: "Privacy", href: "#" }] },
];

export function Footer() {
  return (
    <footer style={{ background: SAIM.ink, color: SAIM.paper, padding: "64px 48px 40px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48, borderBottom: "1px solid rgba(245,241,232,0.08)" }}>
          <div>
            <SaimLogoH size={28} dark={false} />
            <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 17, opacity: 0.65, marginTop: 20, lineHeight: 1.45, maxWidth: 320 }}>
              Artificial intelligence powering your growth.
            </p>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, opacity: 0.4, marginTop: 16, lineHeight: 1.6 }}>
              partners@mysaim.cm
            </div>
          </div>
          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>{col.title}</div>
              {col.items.map(item => (
                <Link key={item.label} href={item.href} style={{ display: "block", fontSize: 14, opacity: 0.7, marginBottom: 10, color: SAIM.paper, textDecoration: "none" }}>{item.label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.35 }}>
          <span>© 2026 SAIM AI</span>
          <span>mysaim.cm</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Section générique ─── */
interface SectionBlockProps {
  kicker?: string;
  title?: React.ReactNode;
  lead?: string;
  children?: React.ReactNode;
  bg?: string;
  color?: string;
  padding?: string;
  id?: string;
}

export function SectionBlock({ kicker, title, lead, children, bg = SAIM.paper, color = SAIM.ink, padding = "96px 48px", id }: SectionBlockProps) {
  return (
    <section id={id} style={{ background: bg, color, padding }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {kicker && (
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: SAIM.accent, marginBottom: 16 }}>{kicker}</div>
        )}
        {title && (
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 48, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: 0, marginBottom: lead ? 20 : 48, maxWidth: 780 }}>{title}</h2>
        )}
        {lead && (
          <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 19, lineHeight: 1.5, color: bg === SAIM.ink ? "rgba(245,241,232,0.72)" : SAIM.inkSoft, margin: 0, marginBottom: 56, maxWidth: 640 }}>{lead}</p>
        )}
        {children}
      </div>
    </section>
  );
}

/* ─── MiniCard ─── */
export function MiniCard({ icon, title, desc, accent = false }: { icon: React.ReactNode; title: string; desc: string; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? SAIM.accentSoft : SAIM.paperHi,
      border: `1px solid ${accent ? SAIM.accentLight : SAIM.border}`,
      borderRadius: 16, padding: 28,
    }}>
      <div style={{ width: 44, height: 44, background: accent ? SAIM.accent : SAIM.paperAlt, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 20 }}>
        {icon}
      </div>
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.5, color: SAIM.inkSoft }}>{desc}</div>
    </div>
  );
}
