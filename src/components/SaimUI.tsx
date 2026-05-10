"use client";

import Link from "next/link";
import { useLang, useT } from "@/lib/i18n";

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

/* ─── SaimMark — icône grille ─── */
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

/* ─── Logo horizontal (nouveau SVG) ─── */
export function SaimLogoH({ size = 28, dark = true }: { size?: number; dark?: boolean }) {
  const h = Math.round(size * 1.35);
  return (
    <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
      <img
        src="/saim-logo-new.svg"
        height={h}
        alt="SAIM AI"
        style={{ display: "block", filter: dark ? "none" : "brightness(0) invert(1)" }}
      />
    </Link>
  );
}

/* ─── LangSwitcher ─── */
export function LangSwitcher({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  const bg      = dark ? "rgba(255,255,255,0.10)" : "#F0EEE9";
  const activeBg = dark ? "rgba(255,255,255,0.18)" : "#ffffff";
  const activeColor = dark ? "#FBFAF7" : "#141413";
  const inactiveColor = dark ? "rgba(251,250,247,0.45)" : "#73726C";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 2,
      background: bg, borderRadius: 8, padding: "3px 4px",
    }}>
      {(["fr", "en"] as const).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "4px 8px", borderRadius: 6,
            border: "none", cursor: "pointer",
            background: lang === l ? activeBg : "transparent",
            color: lang === l ? activeColor : inactiveColor,
            transition: "all 0.15s",
            boxShadow: lang === l ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ─── Navigation ─── */
const NAV_IDS = [
  { href: "/",          id: "home" },
  { href: "/about",     id: "about" },
  { href: "/services",  id: "services" },
  { href: "/dashboard", id: "agent" },
];

export function Nav({ activePage = "home", dark = false }: { activePage?: string; dark?: boolean }) {
  const t  = useT();
  const bg = dark ? SAIM.ink : "rgba(245,241,232,0.95)";
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
        {NAV_IDS.map(p => (
          <Link key={p.id} href={p.href} style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 14, fontWeight: 500,
            color: p.id === activePage ? SAIM.accent : (dark ? "rgba(245,241,232,0.7)" : SAIM.muted),
            textDecoration: "none", letterSpacing: "-0.01em",
          }}>{t(`nav.${p.id}`)}</Link>
        ))}
        <LangSwitcher dark={dark} />
        <Link href="/dashboard" prefetch={false} style={{
          background: SAIM.accent, color: SAIM.paper,
          padding: "10px 20px", borderRadius: 10,
          fontSize: 14, fontWeight: 500,
          fontFamily: "'Inter Tight', system-ui, sans-serif",
          textDecoration: "none",
        }}>{t("nav.free.trial")}</Link>
      </div>
    </nav>
  );
}

/* ─── Footer ─── */
export function Footer() {
  const t = useT();
  const cols = [
    {
      key: "products",
      title: t("footer.products"),
      items: [
        { label: t("footer.platform"), href: "/dashboard" },
        { label: t("footer.fiscal"),   href: "/dashboard" },
        { label: "Services",           href: "/services" },
      ],
    },
    {
      key: "company",
      title: t("footer.company"),
      items: [
        { label: t("footer.about"),   href: "/about" },
        { label: t("nav.contact"),    href: "/contact" },
      ],
    },
    {
      key: "legal",
      title: t("footer.legal"),
      items: [
        { label: t("footer.terms"),   href: "#" },
        { label: t("footer.privacy"), href: "#" },
      ],
    },
  ];

  return (
    <footer style={{ background: SAIM.ink, color: SAIM.paper, padding: "64px 48px 40px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48, borderBottom: "1px solid rgba(245,241,232,0.08)" }}>
          <div>
            <SaimLogoH size={28} dark={false} />
            <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 17, opacity: 0.65, marginTop: 20, lineHeight: 1.45, maxWidth: 320 }}>
              {t("footer.tagline")}
            </p>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, opacity: 0.4, marginTop: 16, lineHeight: 1.6 }}>
              partners@mysaim.cm
            </div>
            <div style={{ marginTop: 16 }}>
              <LangSwitcher dark={true} />
            </div>
          </div>
          {cols.map(col => (
            <div key={col.key}>
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
