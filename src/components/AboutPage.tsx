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
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 20 }}>À propos</div>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 64, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1, margin: 0, marginBottom: 28 }}>
              Conçu pour <em style={{ fontStyle: "italic", color: SAIM.accent, fontWeight: 400 }}>chaque entreprise.</em>
            </h1>
            <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 19, lineHeight: 1.6, color: SAIM.inkSoft, maxWidth: 520 }}>
              SAIM AI est une plateforme d'intelligence artificielle conçue pour les entrepreneurs et les PME. Notre mission : rendre l'IA accessible, pratique et rentable pour toutes les entreprises, partout dans le monde.
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
        kicker="Notre vision"
        title={<>Le partenaire IA de référence <em style={{ fontStyle: "italic", color: SAIM.accent }}>de votre entreprise.</em></>}
        lead="Donner accès à des outils IA de niveau mondial, adaptés aux réalités concrètes et aux budgets des PME."
        bg={SAIM.paperAlt}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { t: "Accessibilité",      d: "L'IA à la portée de toutes les entreprises, pas seulement des multinationales." },
            { t: "Pertinence métier",  d: "Solutions intégrant les réglementations et les réalités de chaque secteur." },
            { t: "Open source first",  d: "Modèles ouverts pour garantir souveraineté et réduire les coûts." },
            { t: "Impact mesurable",   d: "Chaque solution génère un gain de productivité concret et mesurable." },
          ].map((v, i) => (
            <div key={i} style={{ background: SAIM.paperHi, border: `1px solid ${SAIM.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: SAIM.accent, letterSpacing: "0.14em", marginBottom: 12 }}>0{i + 1}</div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 10 }}>{v.t}</div>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: SAIM.inkSoft }}>{v.d}</div>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* ── Fondatrice ── */}
      <SectionBlock
        kicker="Fondatrice"
        title="Christina Ngono"
        lead="CEO & Fondatrice de SAIM AI."
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
              Convaincue que toutes les PME méritent les mêmes outils que les grandes entreprises, Christina a fondé SAIM AI avec une philosophie claire : des solutions open source, efficaces et économiques, adaptées à la réalité de chaque entreprise.
            </p>
            <div style={{ display: "flex", gap: 32, marginTop: 28 }}>
              {[
                { n: "300 000", l: "entreprises ciblées" },
                { n: "6",       l: "agents spécialisés" },
                { n: "24/7",    l: "disponibilité" },
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

      {/* ── Stack technique ── */}
      <SectionBlock
        kicker="Stack"
        title={<>Open source. <em style={{ fontStyle: "italic", color: SAIM.accent }}>Souverain.</em></>}
        lead="Nous privilégions les modèles et outils open source — aucune dépendance propriétaire, souveraineté totale des données."
        bg={SAIM.ink}
        color={SAIM.paper}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { cat: "LLM",       items: "LLaMA 3.3 70B · Qwen3 · Mistral via Groq" },
            { cat: "Embeddings",items: "nomic-embed-text via Ollama" },
            { cat: "Vector DB", items: "ChromaDB" },
            { cat: "Backend",   items: "Python FastAPI · Node.js" },
            { cat: "Frontend",  items: "React.js · Next.js" },
            { cat: "Infra",     items: "VPS Ubuntu · Nginx · SSL" },
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
