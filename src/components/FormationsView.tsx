"use client";

import { ExternalLink, BookOpen, Clock, Tag } from "lucide-react";

interface Formation {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  color: string;
  link?: string;
}

const FORMATIONS: Formation[] = [
  {
    id: "1",
    title: "Comprendre la TVA au Cameroun",
    description: "Bases de la TVA camerounaise : taux, seuils d'assujettissement, déclarations et remboursements.",
    duration: "2h30",
    category: "Fiscalité",
    color: "#10b981",
  },
  {
    id: "2",
    title: "Déclaration IRPP — Guide pratique",
    description: "Calculez et déclarez l'impôt sur le revenu des personnes physiques pas à pas, avec exemples chiffrés.",
    duration: "3h",
    category: "Fiscalité",
    color: "#10b981",
  },
  {
    id: "3",
    title: "Comptabilité de base pour PME",
    description: "Plan comptable OHADA, écritures courantes, bilan et compte de résultat pour les dirigeants de PME.",
    duration: "4h",
    category: "Comptabilité",
    color: "#6366f1",
  },
  {
    id: "4",
    title: "Établir un bulletin de paie",
    description: "Calcul du salaire brut au net, cotisations CNPS, impôts sur salaires — modèles inclus.",
    duration: "2h",
    category: "RH",
    color: "#f59e0b",
  },
  {
    id: "5",
    title: "Créer et gérer sa facturation",
    description: "Rédiger une facture conforme, gérer les relances, et suivre sa trésorerie au quotidien.",
    duration: "1h30",
    category: "Comptabilité",
    color: "#6366f1",
  },
  {
    id: "6",
    title: "Régimes fiscaux au Cameroun",
    description: "Libératoire, simplifié ou réel — choisir le bon régime selon votre chiffre d'affaires et votre secteur.",
    duration: "2h",
    category: "Fiscalité",
    color: "#10b981",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Fiscalité": "#10b981",
  "Comptabilité": "#6366f1",
  "RH": "#f59e0b",
};

export default function FormationsView() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fafafa" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>📚</span>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Mes formations</h2>
        </div>
        <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
          Renforcez vos compétences en fiscalité, comptabilité et gestion d'entreprise au Cameroun.
        </p>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "20px 28px 28px" }}>

        {/* Coming soon banner */}
        <div style={{ padding: "14px 18px", background: "linear-gradient(135deg, #f0f9f6, #e0f2fe)", borderRadius: 12, border: "1px solid #a7f3d0", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🚀</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#065f46", margin: 0 }}>Formations interactives — bientôt disponibles</p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>Les formations en ligne avec quiz et certificats arrivent prochainement. Voici un aperçu du catalogue.</p>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {FORMATIONS.map((f) => (
            <div
              key={f.id}
              style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 20, display: "flex", flexDirection: "column", gap: 12, transition: "box-shadow 0.15s, transform 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookOpen size={18} color={f.color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: CATEGORY_COLORS[f.category] || "#888", background: `${CATEGORY_COLORS[f.category] || "#888"}15`, padding: "3px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
                  <Tag size={9} />
                  {f.category}
                </span>
              </div>

              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" }}>{f.title}</p>
                <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.6 }}>{f.description}</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTop: "1px solid #f5f5f5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#bbb" }}>
                  <Clock size={12} />
                  <span style={{ fontSize: 12 }}>{f.duration}</span>
                </div>
                <button
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: "#f5f5f5", color: "#888", fontSize: 12, fontWeight: 500, cursor: "not-allowed" }}
                >
                  <ExternalLink size={12} /> Bientôt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
