"use client";

import Link from "next/link";
import { SAIM, Nav, Footer, SectionBlock } from "./SaimUI";

const AGENTS = [
  { name: "SAIM Fiscal",     tag: "Fiscalité",           icon: "📊",
    headline: "Votre conseiller fiscal expert, disponible 24h/24.",
    desc: "Alimenté par les textes fiscaux officiels mis à jour. Calculs déterministes — pas d'hallucination sur les montants.",
    features: ["Calcul exact : TVA, IS, IRPP et taxes locales", "Calendrier fiscal + alertes d'échéances", "Analyse de documents fiscaux", "Modes : création, contentieux, révision", "Commande vocale", "Export PDF des simulations"],
  },
  { name: "SAIM Marketing",  tag: "Marketing",            icon: "📣",
    headline: "Du contenu professionnel en un clic.",
    desc: "Créez vos publications réseaux sociaux, propositions commerciales, newsletters et traductions sans équipe marketing.",
    features: ["Contenu Facebook, LinkedIn, WhatsApp", "Propositions commerciales et devis", "Campagnes email et newsletter", "Traduction FR ↔ EN"],
  },
  { name: "SAIM RH",         tag: "Ressources humaines",  icon: "👥",
    headline: "Gérez vos équipes sans service RH.",
    desc: "Du contrat de travail aux fiches de paie, en conformité avec la législation du travail en vigueur.",
    features: ["Contrats de travail conformes", "Calcul charges sociales et fiches de paie", "Gestion congés et absences", "Offres d'emploi et analyse de CV"],
  },
  { name: "SAIM Commercial", tag: "Ventes",               icon: "🤝",
    headline: "Prospectez et relancez sans effort.",
    desc: "Scoring de prospects, messages de prospection personnalisés, relances automatiques et suivi pipeline.",
    features: ["Scoring et analyse prospects", "Scripts de prospection personnalisés", "Relances clients et impayés", "Suivi pipeline commercial"],
  },
  { name: "SAIM Juridique",  tag: "Juridique",            icon: "⚖️",
    headline: "Contrats et conformité réglementaire.",
    desc: "Rédaction de contrats, analyse d'appels d'offres, veille réglementaire — adapté à votre cadre juridique.",
    features: ["Contrats, CGV, statuts", "Analyse appels d'offres publics", "Courriers et mises en demeure", "Veille réglementaire sectorielle"],
  },
  { name: "SAIM Documents",  tag: "Documents",            icon: "📄",
    headline: "Vos documents, synthétisés en secondes.",
    desc: "Résumez n'importe quel document, extrayez les données clés, transcrivez vos réunions audio en texte.",
    features: ["Synthèse et résumé de tout document", "Extraction de données depuis PDF", "Comptes-rendus de réunions", "Transcription audio → texte"],
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
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 20 }}>Nos services</div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 64, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.05, margin: 0, marginBottom: 24 }}>
            Six agents. <em style={{ fontStyle: "italic", color: SAIM.accent }}>Un système.</em>
          </h1>
          <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 20, lineHeight: 1.5, color: SAIM.inkSoft, maxWidth: 580, margin: "0 auto" }}>
            Chaque agent est un expert dans son domaine, formé au contexte camerounais. Assemblez-les selon vos besoins.
          </p>
        </div>
      </section>

      {/* ── 6 agents en layout alterné ── */}
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
              <Link href="/dashboard" style={{
                display: "inline-block",
                background: SAIM.accent, color: SAIM.paper,
                padding: "10px 20px", borderRadius: 10,
                fontSize: 14, fontWeight: 500, textDecoration: "none",
              }}>Essayer {a.name} →</Link>
            </div>
            {i % 2 === 0 && <FeatureList features={a.features} />}
          </div>
        </section>
      ))}

      {/* ── Offres complémentaires ── */}
      <SectionBlock
        kicker="Aussi"
        title={<>Formation & <em style={{ fontStyle: "italic", color: SAIM.accent }}>Data Lab.</em></>}
        bg={SAIM.ink}
        color={SAIM.paper}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "rgba(245,241,232,0.06)", borderRadius: 18, padding: 36, border: "1px solid rgba(245,241,232,0.08)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 12 }}>SAIM Course</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12 }}>Maîtrisez l'IA à votre rythme.</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.7 }}>Formation en intelligence artificielle, pédagogie décontractée, parcours personnalisés. Certification à l'issue de chaque module.</p>
            <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: SAIM.accent }}>course.mysaim.cm →</div>
          </div>
          <div style={{ background: "rgba(245,241,232,0.06)", borderRadius: 18, padding: 36, border: "1px solid rgba(245,241,232,0.08)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 12 }}>SAIM Data Lab</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12 }}>Des données de qualité pour des IA performantes.</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.7 }}>Génération de données synthétiques, annotation, collecte terrain, fine-tuning de modèles open source — en langues locales africaines.</p>
            <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: SAIM.accent }}>Contactez-nous →</div>
          </div>
        </div>
      </SectionBlock>

      <Footer />
    </div>
  );
}
