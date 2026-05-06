"use client";

import Link from "next/link";
import { SAIM, Nav, Footer, SectionBlock } from "./SaimUI";

const AGENTS = [
  { name: "SAIM Fiscal",     tag: "Tax",              icon: "📊",
    headline: "Your expert tax advisor, available 24/7.",
    desc: "Powered by official and up-to-date tax texts. Deterministic calculations — no hallucinations on amounts.",
    features: ["Exact calculation: VAT, Corp. Tax, Income Tax and local levies", "Tax calendar + deadline alerts", "Tax document analysis", "Modes: creation, dispute, review", "Voice command", "PDF export of simulations"],
  },
  { name: "SAIM Marketing",  tag: "Marketing",         icon: "📣",
    headline: "Professional content in one click.",
    desc: "Create social media posts, commercial proposals, newsletters and translations without a marketing team.",
    features: ["Content for Facebook, LinkedIn, WhatsApp", "Commercial proposals and quotes", "Email and newsletter campaigns", "Translation FR ↔ EN"],
  },
  { name: "SAIM HR",         tag: "Human Resources",   icon: "👥",
    headline: "Manage your teams without an HR department.",
    desc: "From employment contracts to payslips, fully compliant with current labour legislation.",
    features: ["Compliant employment contracts", "Social charges calculation and payslips", "Leave and absence management", "Job listings and CV analysis"],
  },
  { name: "SAIM Sales",      tag: "Sales",             icon: "🤝",
    headline: "Prospect and follow up effortlessly.",
    desc: "Prospect scoring, personalised outreach messages, automatic follow-ups and pipeline tracking.",
    features: ["Prospect scoring and analysis", "Personalised outreach scripts", "Client and overdue follow-ups", "Sales pipeline tracking"],
  },
  { name: "SAIM Legal",      tag: "Legal",             icon: "⚖️",
    headline: "Contracts and regulatory compliance.",
    desc: "Contract drafting, tender analysis, regulatory monitoring — adapted to your legal framework.",
    features: ["Contracts, T&Cs, bylaws", "Public tender analysis", "Letters and formal notices", "Sector-specific regulatory watch"],
  },
  { name: "SAIM Documents",  tag: "Documents",         icon: "📄",
    headline: "Your documents, summarised in seconds.",
    desc: "Summarise any document, extract key data, transcribe your audio meetings to text.",
    features: ["Summary of any document", "Data extraction from PDFs", "Meeting minutes", "Audio → text transcription"],
  },
];

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
  return (
    <div style={{ background: SAIM.paper, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Nav activePage="services" />

      {/* ── Hero ── */}
      <section style={{ padding: "80px 48px 48px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 20 }}>Our services</div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 64, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.05, margin: 0, marginBottom: 24 }}>
            Six agents. <em style={{ fontStyle: "italic", color: SAIM.accent }}>One system.</em>
          </h1>
          <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 20, lineHeight: 1.5, color: SAIM.inkSoft, maxWidth: 580, margin: "0 auto" }}>
            Each agent is an expert in its field, trained on the concrete realities of your sector. Combine them to fit your needs.
          </p>
        </div>
      </section>

      {/* ── 6 agents alternating layout ── */}
      {AGENTS.map((a, i) => (
        <section key={a.name} style={{
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
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em" }}>{a.name}</div>
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
              }}>Try {a.name} →</Link>
            </div>
            {i % 2 === 0 && <FeatureList features={a.features} />}
          </div>
        </section>
      ))}

      {/* ── Complementary services ── */}
      <SectionBlock
        kicker="Also"
        title={<>Training & <em style={{ fontStyle: "italic", color: SAIM.accent }}>Data Lab.</em></>}
        bg={SAIM.ink}
        color={SAIM.paper}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "rgba(245,241,232,0.06)", borderRadius: 18, padding: 36, border: "1px solid rgba(245,241,232,0.08)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 12 }}>SAIM Course</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12 }}>Master AI at your own pace.</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.7 }}>AI training with a relaxed teaching style and personalised learning paths. Certification at the end of each module.</p>
            <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: SAIM.accent }}>course.mysaim.com →</div>
          </div>
          <div style={{ background: "rgba(245,241,232,0.06)", borderRadius: 18, padding: 36, border: "1px solid rgba(245,241,232,0.08)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 12 }}>SAIM Data Lab</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12 }}>Quality data for powerful AI.</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.7 }}>Synthetic data generation, annotation, field collection, fine-tuning of open-source models — in your language and context.</p>
            <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: SAIM.accent }}>Contact us →</div>
          </div>
        </div>
      </SectionBlock>

      <Footer />
    </div>
  );
}
