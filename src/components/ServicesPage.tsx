"use client";

import Link from "next/link";
import { SAIM, Nav, Footer, SectionBlock } from "./SaimUI";
import { useT } from "@/lib/i18n";

function FeatureList({ features }: { features: string[] }) {
  return (
    <div style={{ background: SAIM.paperHi, borderRadius: 20, border: `1px solid ${SAIM.border}`, padding: 40, display: "flex", flexDirection: "column", gap: 14 }}>
      {features.map(f => (
        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: SAIM.inkSoft }}>
          <span style={{ color: SAIM.accent, fontSize: 12, flexShrink: 0 }}>✓</span> {f}
        </div>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  const t = useT();

  const AGENTS = [
    {
      nameKey: "a.fiscal.name", tag: t("a.fiscal.tag"), icon: "📊",
      headline: t("a.fiscal.headline"), desc: t("a.fiscal.desc"),
      features: [t("a.fiscal.f1"), t("a.fiscal.f2"), t("a.fiscal.f3"), t("a.fiscal.f4"), t("a.fiscal.f5"), t("a.fiscal.f6")],
    },
    {
      nameKey: "a.mkt.name", tag: t("a.mkt.tag"), icon: "📣",
      headline: t("a.mkt.headline"), desc: t("a.mkt.desc"),
      features: [t("a.mkt.f1"), t("a.mkt.f2"), t("a.mkt.f3"), t("a.mkt.f4")],
    },
    {
      nameKey: "a.hr.name", tag: t("a.hr.tag"), icon: "👥",
      headline: t("a.hr.headline"), desc: t("a.hr.desc"),
      features: [t("a.hr.f1"), t("a.hr.f2"), t("a.hr.f3"), t("a.hr.f4")],
    },
    {
      nameKey: "a.sales.name", tag: t("a.sales.tag"), icon: "🤝",
      headline: t("a.sales.headline"), desc: t("a.sales.desc"),
      features: [t("a.sales.f1"), t("a.sales.f2"), t("a.sales.f3"), t("a.sales.f4")],
    },
    {
      nameKey: "a.legal.name", tag: t("a.legal.tag"), icon: "⚖️",
      headline: t("a.legal.headline"), desc: t("a.legal.desc"),
      features: [t("a.legal.f1"), t("a.legal.f2"), t("a.legal.f3"), t("a.legal.f4")],
    },
    {
      nameKey: "a.docs.name", tag: t("a.docs.tag"), icon: "📄",
      headline: t("a.docs.headline"), desc: t("a.docs.desc"),
      features: [t("a.docs.f1"), t("a.docs.f2"), t("a.docs.f3"), t("a.docs.f4")],
    },
  ];

  return (
    <div style={{ background: SAIM.paper, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Nav activePage="services" />

      {/* ── Hero ── */}
      <section style={{ padding: "80px 48px 48px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 20 }}>
            {t("services.kicker")}
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 64, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.05, margin: 0, marginBottom: 24 }}>
            {t("services.h1")} <em style={{ fontStyle: "italic", color: SAIM.accent }}>{t("services.h1.em")}</em>
          </h1>
          <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 20, lineHeight: 1.5, color: SAIM.inkSoft, maxWidth: 580, margin: "0 auto" }}>
            {t("services.lead")}
          </p>
        </div>
      </section>

      {/* ── 6 agents ── */}
      {AGENTS.map((a, i) => {
        const name = t(a.nameKey);
        return (
          <section key={a.nameKey} style={{
            padding: "72px 48px",
            background: i % 2 === 0 ? SAIM.paper : SAIM.paperAlt,
            borderTop: `1px solid ${SAIM.border}`,
          }}>
            <div style={{
              maxWidth: 1080, margin: "0 auto",
              display: "grid",
              gridTemplateColumns: i % 2 === 0 ? "1.2fr 1fr" : "1fr 1.2fr",
              gap: 64, alignItems: "center",
            }}>
              {i % 2 !== 0 && <FeatureList features={a.features} />}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 28 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em" }}>{name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: SAIM.accent }}>{a.tag}</div>
                  </div>
                </div>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0, marginBottom: 16 }}>{a.headline}</h2>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: SAIM.inkSoft, maxWidth: 480, marginBottom: 28 }}>{a.desc}</p>
                <Link href="/dashboard" prefetch={false} style={{
                  display: "inline-block",
                  background: SAIM.accent, color: SAIM.paper,
                  padding: "10px 20px", borderRadius: 10,
                  fontSize: 14, fontWeight: 500, textDecoration: "none",
                }}>
                  {t("services.try")} {name} →
                </Link>
              </div>
              {i % 2 === 0 && <FeatureList features={a.features} />}
            </div>
          </section>
        );
      })}

      {/* ── Formation & Data Lab ── */}
      <SectionBlock
        kicker={t("services.also.kicker")}
        title={<>{t("services.also.title")}<em style={{ fontStyle: "italic", color: SAIM.accent }}>{t("services.also.em")}</em></>}
        bg={SAIM.ink}
        color={SAIM.paper}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "rgba(245,241,232,0.06)", borderRadius: 18, padding: 36, border: "1px solid rgba(245,241,232,0.08)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 12 }}>SAIM Course</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12 }}>{t("services.course.title")}</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.7 }}>{t("services.course.desc")}</p>
            <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: SAIM.accent }}>course.mysaim.com →</div>
          </div>
          <div style={{ background: "rgba(245,241,232,0.06)", borderRadius: 18, padding: 36, border: "1px solid rgba(245,241,232,0.08)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 12 }}>SAIM Data Lab</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12 }}>{t("services.datalab.title")}</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.7 }}>{t("services.datalab.desc")}</p>
            <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: SAIM.accent }}>{t("nav.contact")} →</div>
          </div>
        </div>
      </SectionBlock>

      <Footer />
    </div>
  );
}
