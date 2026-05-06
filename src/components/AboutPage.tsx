"use client";

import { SAIM, SaimMark, Nav, Footer, SectionBlock } from "./SaimUI";

export default function AboutPage() {
  return (
    <div style={{ background: SAIM.paper, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Nav activePage="about" />

      {/* ── Hero ── */}
      <section style={{ padding: "80px 48px 96px", background: SAIM.paper }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 20 }}>About</div>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 64, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1, margin: 0, marginBottom: 28 }}>
              Built for <em style={{ fontStyle: "italic", color: SAIM.accent, fontWeight: 400 }}>every business.</em>
            </h1>
            <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 19, lineHeight: 1.6, color: SAIM.inkSoft, maxWidth: 520 }}>
              SAIM AI is an artificial intelligence platform built for entrepreneurs and SMEs. Our mission: make AI accessible, practical and cost-effective for every business, everywhere in the world.
            </p>
          </div>
          <div style={{
            background: SAIM.paperAlt, borderRadius: 24, aspectRatio: "1/1",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${SAIM.border}`,
          }}>
            <SaimMark size={200} fg={SAIM.accent} />
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <SectionBlock
        kicker="Our vision"
        title={<>The go-to AI partner <em style={{ fontStyle: "italic", color: SAIM.accent }}>for your business.</em></>}
        lead="Giving every SME access to world-class AI tools, adapted to real-world constraints and budgets."
        bg={SAIM.paperAlt}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { t: "Accessibility",      d: "AI within reach of every business — not just multinationals." },
            { t: "Business relevance", d: "Solutions that embed local regulations and sector-specific realities." },
            { t: "Open source first",  d: "Open models to guarantee data sovereignty and reduce costs." },
            { t: "Measurable impact",  d: "Every solution delivers a concrete, measurable productivity gain." },
          ].map((v, i) => (
            <div key={i} style={{ background: SAIM.paperHi, border: `1px solid ${SAIM.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: SAIM.accent, letterSpacing: "0.14em", marginBottom: 12 }}>0{i + 1}</div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 10 }}>{v.t}</div>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: SAIM.inkSoft }}>{v.d}</div>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* ── Founder ── */}
      <SectionBlock
        kicker="Founder"
        title="Christina Ngono"
        lead="CEO & Founder of SAIM AI."
      >
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 40, alignItems: "center" }}>
          <div style={{
            width: 200, height: 200, borderRadius: 20,
            background: SAIM.paperAlt, border: `1px solid ${SAIM.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Fraunces', Georgia, serif", fontSize: 64, color: SAIM.accent,
          }}>CN</div>
          <div>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: SAIM.inkSoft, margin: 0, maxWidth: 640 }}>
              Convinced that every SME deserves the same tools as large corporations, Christina founded SAIM AI with a clear philosophy: open-source, effective and affordable solutions, adapted to the reality of each business.
            </p>
            <div style={{ display: "flex", gap: 32, marginTop: 28 }}>
              {[
                { n: "300 000", l: "businesses targeted" },
                { n: "6",       l: "specialized agents" },
                { n: "24/7",    l: "uptime" },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, color: SAIM.accent }}>{s.n}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: SAIM.muted }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionBlock>

      {/* ── Tech stack ── */}
      <SectionBlock
        kicker="Stack"
        title={<>Open source. <em style={{ fontStyle: "italic", color: SAIM.accent }}>Sovereign.</em></>}
        lead="We favour open-source models and tools — no proprietary lock-in, full data sovereignty."
        bg={SAIM.ink}
        color={SAIM.paper}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { cat: "LLM",        items: "LLaMA 3.3 70B · Qwen3 · Mistral via Groq" },
            { cat: "Embeddings", items: "nomic-embed-text via Ollama" },
            { cat: "Vector DB",  items: "ChromaDB" },
            { cat: "Backend",    items: "Python FastAPI · Node.js" },
            { cat: "Frontend",   items: "React.js · Next.js" },
            { cat: "Infra",      items: "VPS Ubuntu · Nginx · SSL" },
          ].map(s => (
            <div key={s.cat} style={{ background: "rgba(245,241,232,0.06)", borderRadius: 14, padding: 24, border: "1px solid rgba(245,241,232,0.08)" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 10 }}>{s.cat}</div>
              <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.8 }}>{s.items}</div>
            </div>
          ))}
        </div>
      </SectionBlock>

      <Footer />
    </div>
  );
}
