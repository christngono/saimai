"use client";

import Link from "next/link";
import { SAIM, SaimMark, Nav, Footer, SectionBlock, MiniCard } from "./SaimUI";

/* ─── Hero Variation B — éditorial sombre ─── */
function HeroB() {
  const agents = [
    { name: "SAIM Fiscal",     desc: "CGI 2025 · Calcul d'impôts exact",             active: true },
    { name: "SAIM Marketing",  desc: "Contenu réseaux · Propositions commerciales" },
    { name: "SAIM RH",         desc: "Contrats · CNPS · Fiches de paie" },
    { name: "SAIM Commercial", desc: "Prospection · Relances · Pipeline" },
    { name: "SAIM Juridique",  desc: "Contrats · CGV · OHADA" },
    { name: "SAIM Documents",  desc: "Synthèse · Extraction · Transcription" },
  ];
  return (
    <section style={{ background: SAIM.ink, color: SAIM.paper, padding: "80px 48px 96px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: SAIM.accent, marginBottom: 28 }}>
            Super Agent Intelligent Multimodal
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 80, fontWeight: 300, letterSpacing: "-0.04em", lineHeight: 0.95, margin: 0, marginBottom: 32 }}>
            Votre PME<br />mérite <em style={{ fontStyle: "italic", color: SAIM.accent, fontWeight: 400 }}>mieux.</em>
          </h1>
          <p style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 20, lineHeight: 1.55, opacity: 0.72, maxWidth: 460, marginBottom: 40 }}>
            Un comptable, un juriste, un commercial — disponibles 24h/24. Six agents IA spécialisés, prêts à répondre à chaque besoin de votre entreprise.
          </p>
          <Link href="/dashboard" style={{
            display: "inline-block", background: SAIM.accent, color: SAIM.paper,
            padding: "14px 28px", borderRadius: 12,
            fontSize: 16, fontWeight: 500,
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            textDecoration: "none",
          }}>
            Essai gratuit · 10 questions/jour
          </Link>
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

function TrustBar() {
  return (
    <div style={{ background: SAIM.paperAlt, padding: "28px 48px", display: "flex", justifyContent: "center", gap: 56, alignItems: "center", flexWrap: "wrap" as const }}>
      {["Open source first", "Données souveraines", "Conformité réglementaire", "Multidevise"].map(t => (
        <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: SAIM.muted }}>✓ {t}</span>
      ))}
    </div>
  );
}

function ServicesPreview() {
  const services = [
    { t: "SAIM Fiscal",     d: "Calcul d'impôts, TVA, IRPP, IS. Calendrier fiscal automatique. CGI 2025 indexé.", icon: "📊" },
    { t: "SAIM Marketing",  d: "Contenu réseaux sociaux, propositions commerciales, newsletters en un clic.", icon: "📣" },
    { t: "SAIM RH",         d: "Contrats de travail, fiches de paie CNPS, gestion des congés.", icon: "👥" },
    { t: "SAIM Commercial", d: "Scoring prospects, relances automatiques, suivi pipeline.", icon: "🤝" },
    { t: "SAIM Juridique",  d: "Contrats, CGV, statuts, veille OHADA et CEMAC.", icon: "⚖️" },
    { t: "SAIM Documents",  d: "Synthèse de PDF, transcription audio, comptes-rendus.", icon: "📄" },
  ];
  return (
    <SectionBlock
      kicker="Services"
      title={<>Six agents. <em style={{ fontStyle: "italic", color: SAIM.accent }}>Un abonnement.</em></>}
      lead="Chaque agent est un expert dans son domaine, formé aux réglementations et aux besoins concrets des entreprises."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {services.map(s => <MiniCard key={s.t} icon={s.icon} title={s.t} desc={s.d} />)}
      </div>
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Link href="/services" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: SAIM.accent, textDecoration: "none" }}>
          Voir tous les services →
        </Link>
      </div>
    </SectionBlock>
  );
}

function PricingSection() {
  const plans = [
    { name: "Starter",  price: "5 000",  unit: "FCFA/mois", items: ["SAIM Fiscal", "SAIM Documents", "10 questions/jour", "Support email"], pop: false },
    { name: "PME",      price: "15 000", unit: "FCFA/mois", items: ["Fiscal + RH + Commercial", "Marketing + Documents", "Questions illimitées", "Support prioritaire"], pop: true },
    { name: "Business", price: "35 000", unit: "FCFA/mois", items: ["Tous les 6 agents", "Questions illimitées", "Multi-utilisateurs", "Support dédié + formation"], pop: false },
  ];
  return (
    <SectionBlock
      kicker="Tarifs"
      title={<>Simple. <em style={{ fontStyle: "italic", color: SAIM.accent }}>Accessible.</em></>}
      lead="Le prix d'un repas par semaine pour des outils qui remplacent des expertises à 150 000+ FCFA/mois."
      bg={SAIM.paperAlt}
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
              <div style={{ position: "absolute", top: -12, left: 24, background: SAIM.accent, color: SAIM.paper, padding: "4px 14px", borderRadius: 999, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Populaire</div>
            )}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: p.pop ? SAIM.accentLight : SAIM.muted, marginBottom: 16 }}>{p.name}</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 44, fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 4 }}>{p.price}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.pop ? "rgba(245,241,232,0.5)" : SAIM.faint, marginBottom: 28 }}>{p.unit}</div>
            <div style={{ flex: 1 }}>
              {p.items.map(it => (
                <div key={it} style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 10, color: p.pop ? "rgba(245,241,232,0.8)" : SAIM.inkSoft }}>✓ {it}</div>
              ))}
            </div>
            <Link href="/dashboard" style={{
              marginTop: 24, textAlign: "center" as const, padding: "12px 0", borderRadius: 10, display: "block",
              background: p.pop ? SAIM.accent : "transparent",
              border: `1px solid ${p.pop ? SAIM.accent : SAIM.border}`,
              color: p.pop ? SAIM.paper : SAIM.ink,
              fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}>Commencer</Link>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

function FAQSection() {
  const faqs = [
    { q: "SAIM remplace-t-il un comptable ou un avocat ?", a: "Non. SAIM est une première ligne d'intelligence pour les tâches courantes. Pour les cas complexes, consultez un professionnel." },
    { q: "Mes données sont-elles sécurisées ?",            a: "Oui. Nous utilisons des modèles open source et vos données ne quittent jamais notre infrastructure souveraine." },
    { q: "Puis-je tester avant de payer ?",                a: "Bien sûr. L'offre gratuite donne accès à 10 questions par jour pendant 2 mois, sans carte bancaire." },
    { q: "Les calculs fiscaux sont-ils fiables ?",          a: "Nos calculs sont déterministes — pas d'hallucination. Ils sont basés sur le CGI 2025 et la LF 2026 indexés." },
  ];
  return (
    <SectionBlock
      kicker="FAQ"
      title={<>Questions <em style={{ fontStyle: "italic", color: SAIM.accent }}>fréquentes.</em></>}
      bg={SAIM.paperAlt}
    >
      <div>
        {faqs.map((f, i) => (
          <div key={i} style={{ padding: "24px 0", borderBottom: `1px solid ${SAIM.border}` }}>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 10 }}>{f.q}</div>
            <div style={{ fontSize: 15, lineHeight: 1.55, color: SAIM.inkSoft }}>{f.a}</div>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

function ContactSection() {
  return (
    <SectionBlock
      id="contact"
      kicker="Contact"
      title={<>Parlons de <em style={{ fontStyle: "italic", color: SAIM.accent }}>votre projet.</em></>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[{ label: "Nom complet", ph: "Aïssatou Diallo" }, { label: "Email", ph: "aissatou@entreprise.cm" }, { label: "Entreprise", ph: "Nom de votre entreprise" }].map(f => (
            <div key={f.label}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: SAIM.muted, marginBottom: 8 }}>{f.label}</div>
              <div style={{ background: SAIM.paperHi, border: `1px solid ${SAIM.border}`, borderRadius: 10, padding: "14px 16px", fontSize: 15, color: SAIM.faint }}>{f.ph}</div>
            </div>
          ))}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: SAIM.muted, marginBottom: 8 }}>Message</div>
            <div style={{ background: SAIM.paperHi, border: `1px solid ${SAIM.border}`, borderRadius: 10, padding: "14px 16px", fontSize: 15, color: SAIM.faint, minHeight: 100 }}>Comment pouvons-nous vous aider ?</div>
          </div>
          <div style={{ background: SAIM.accent, color: SAIM.paper, padding: "14px 0", borderRadius: 10, textAlign: "center" as const, fontSize: 15, fontWeight: 500, cursor: "pointer", marginTop: 8 }}>
            Envoyer le message
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
          {[
            { label: "Email",        value: "partners@mysaim.cm" },
            { label: "Plateforme",   value: "mysaim.cm" },
            { label: "Formation",    value: "course.mysaim.cm" },
            { label: "Localisation", value: "Yaoundé, Cameroun" },
          ].map(c => (
            <div key={c.label}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.muted, marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em" }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionBlock>
  );
}

export default function SaimAILanding() {
  return (
    <div style={{ background: SAIM.paper, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Nav activePage="home" dark />
      <HeroB />
      <TrustBar />
      <ServicesPreview />
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
