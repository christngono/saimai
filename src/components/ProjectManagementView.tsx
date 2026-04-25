"use client";

import { useState } from "react";
import { Loader2, Sparkles, RefreshCw, AlertOctagon, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";

/* ── Types ── */
interface Task { name: string; duration: string; responsible: string; priority: string; }
interface Phase { id: number; name: string; duration: string; color: string; tasks: Task[]; milestone: string; deliverable: string; }
interface PlanningResult {
  project_name: string; description: string; total_duration: string; start_date: string;
  phases: Phase[]; team_needed: string[]; constraints: string[]; budget_range: string; success_criteria: string[];
}
interface Risk {
  id: number; category: string; category_emoji: string; risk: string;
  probability: string; prob_score: number; impact: string; impact_score: number; risk_score: number;
  mitigation: string; contingency: string; owner: string;
}
interface RisksResult {
  project_name: string; overall_risk: string; overall_score: number;
  risks: Risk[]; recommendations: string[]; quick_wins: string[];
}

/* ── Helpers ── */
const RISK_COLOR: Record<string, string> = {
  Faible: "#10b981", Modéré: "#f59e0b", Modérée: "#f59e0b", Élevé: "#f97316", Élevée: "#f97316", Critique: "#ef4444",
};
const OVERALL_COLOR: Record<string, string> = { Faible: "#10b981", Modéré: "#f59e0b", Élevé: "#f97316", Critique: "#ef4444" };
const PRIORITY_DOT: Record<string, string> = { haute: "#ef4444", moyenne: "#f59e0b", faible: "#10b981" };

function riskScore(s: number) { return s <= 3 ? "#10b981" : s <= 6 ? "#f59e0b" : "#ef4444"; }

/* ── Planning output ── */
function PlanningOutput({ data, onReset }: { data: PlanningResult; onReset: () => void }) {
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([1]));
  const toggle = (id: number) => setOpenPhases(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: "18px 22px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>{data.project_name}</p>
            <p style={{ fontSize: 13, color: "#666", margin: "0 0 10px", lineHeight: 1.5 }}>{data.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <Chip label={`⏱ ${data.total_duration}`} bg="#eef2ff" color="#6366f1" />
              <Chip label={`📅 Début : ${data.start_date}`} bg="#f0fdf4" color="#10b981" />
              {data.budget_range && <Chip label={`💰 ${data.budget_range}`} bg="#fffbeb" color="#d97706" />}
            </div>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", margin: 0 }}>Phases du projet</p>
        {(data.phases || []).map((phase, idx) => {
          const open = openPhases.has(phase.id);
          return (
            <div key={phase.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", overflow: "hidden" }}>
              <button onClick={() => toggle(phase.id)}
                style={{ width: "100%", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${phase.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: phase.color, flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{phase.name}</p>
                  <p style={{ fontSize: 11, color: "#888", margin: "2px 0 0" }}>{phase.duration} · {phase.tasks?.length || 0} tâches · Livrable : {phase.deliverable}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Chip label={phase.milestone} bg={`${phase.color}15`} color={phase.color} />
                  {open ? <ChevronDown size={15} color="#aaa" /> : <ChevronRight size={15} color="#aaa" />}
                </div>
              </button>

              {open && (
                <div style={{ padding: "0 18px 16px", borderTop: "1px solid #f5f5f5" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                    {(phase.tasks || []).map((task, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px 120px 60px", alignItems: "center", gap: 12, padding: "8px 12px", background: "#f9fafb", borderRadius: 8 }}>
                        <p style={{ fontSize: 13, color: "#1a1a1a", margin: 0 }}>{task.name}</p>
                        <p style={{ fontSize: 11, color: "#888", margin: 0 }}>⏱ {task.duration}</p>
                        <p style={{ fontSize: 11, color: "#888", margin: 0 }}>👤 {task.responsible}</p>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIORITY_DOT[task.priority?.toLowerCase()] || "#aaa" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Équipe + contraintes */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 18 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", margin: "0 0 10px" }}>Équipe requise</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(data.team_needed || []).map((r, i) => <Chip key={i} label={r} bg="#f5f5f5" color="#555" />)}
          </div>
          {data.constraints?.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#f97316", textTransform: "uppercase", margin: "14px 0 8px" }}>⚠️ Contraintes locales</p>
              {data.constraints.map((c, i) => (
                <p key={i} style={{ fontSize: 12, color: "#555", margin: "0 0 5px", lineHeight: 1.5 }}>• {c}</p>
              ))}
            </>
          )}
        </div>
        {/* Critères de succès */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 18 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", margin: "0 0 10px" }}>Critères de succès</p>
          {(data.success_criteria || []).map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.5 }}>{c}</p>
            </div>
          ))}
        </div>
      </div>
      <ResetBtn onReset={onReset} />
    </div>
  );
}

/* ── Risks output ── */
function RisksOutput({ data, onReset }: { data: RisksResult; onReset: () => void }) {
  const overallColor = OVERALL_COLOR[data.overall_risk] || "#f59e0b";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: "18px 22px", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 72, height: 72, borderRadius: 16, background: `${overallColor}15`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <AlertOctagon size={26} color={overallColor} />
          <span style={{ fontSize: 11, fontWeight: 700, color: overallColor, marginTop: 2 }}>{data.overall_risk}</span>
        </div>
        <div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>{data.project_name}</p>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{data.risks?.length || 0} risques identifiés · Score global : {data.overall_score}/10</p>
        </div>
      </div>

      {/* Risk matrix mini */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 18 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", margin: "0 0 14px" }}>Matrice des risques</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { label: "Critique", bg: "#fef2f2", border: "#fca5a5" },
            { label: "Élevé", bg: "#fff7ed", border: "#fdba74" },
            { label: "Modéré", bg: "#fffbeb", border: "#fde68a" },
            { label: "Faible", bg: "#f0fdf4", border: "#86efac" },
          ].map(level => {
            const matching = (data.risks || []).filter(r => r.impact === level.label || r.probability === level.label + "e" || (level.label === "Élevé" && r.impact === "Élevé"));
            return (
              <div key={level.label} style={{ padding: "10px 12px", background: level.bg, borderRadius: 10, border: `1px solid ${level.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: RISK_COLOR[level.label] || "#888", margin: "0 0 6px", textTransform: "uppercase" }}>{level.label}</p>
                {(data.risks || []).filter(r => r.impact === level.label).map(r => (
                  <p key={r.id} style={{ fontSize: 11, color: "#555", margin: "0 0 3px" }}>• {r.category_emoji} {r.category}</p>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", margin: 0 }}>Détail des risques</p>
        {(data.risks || []).sort((a, b) => b.risk_score - a.risk_score).map(risk => (
          <div key={risk.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${riskScore(risk.risk_score)}15`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 16 }}>{risk.category_emoji}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{risk.risk}</p>
                  <Chip label={`Score ${risk.risk_score}`} bg={`${riskScore(risk.risk_score)}15`} color={riskScore(risk.risk_score)} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <Chip label={`Prob. : ${risk.probability}`} bg={`${RISK_COLOR[risk.probability] || "#888"}15`} color={RISK_COLOR[risk.probability] || "#888"} />
                  <Chip label={`Impact : ${risk.impact}`} bg={`${RISK_COLOR[risk.impact] || "#888"}15`} color={RISK_COLOR[risk.impact] || "#888"} />
                  <Chip label={risk.category} bg="#f5f5f5" color="#555" />
                  {risk.owner && <Chip label={`👤 ${risk.owner}`} bg="#f5f5f5" color="#555" />}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ padding: "10px 12px", background: "#f0fdf4", borderRadius: 10 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#10b981", margin: "0 0 4px" }}>MITIGATION</p>
                <p style={{ fontSize: 12, color: "#444", margin: 0, lineHeight: 1.5 }}>{risk.mitigation}</p>
              </div>
              <div style={{ padding: "10px 12px", background: "#fffbeb", borderRadius: 10 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#d97706", margin: "0 0 4px" }}>PLAN B</p>
                <p style={{ fontSize: 12, color: "#444", margin: 0, lineHeight: 1.5 }}>{risk.contingency}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 18 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", margin: "0 0 10px" }}>Recommandations</p>
          {(data.recommendations || []).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "#6366f1", fontSize: 14, flexShrink: 0 }}>→</span>
              <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.5 }}>{r}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "#f0fdf4", borderRadius: 14, border: "1px solid #86efac", padding: 18 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#10b981", textTransform: "uppercase", margin: "0 0 10px" }}>⚡ Quick wins</p>
          {(data.quick_wins || []).map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: "#166534", margin: 0, lineHeight: 1.5 }}>{q}</p>
            </div>
          ))}
        </div>
      </div>
      <ResetBtn onReset={onReset} />
    </div>
  );
}

/* ── Shared ── */
function Chip({ label, bg, color }: { label: string; bg: string; color: string }) {
  return <span style={{ padding: "3px 9px", borderRadius: 999, background: bg, color, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>;
}
function ResetBtn({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={onReset} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, border: "1px solid #e8e8e8", background: "#fff", color: "#666", fontSize: 12, cursor: "pointer" }}>
        <RefreshCw size={12} /> Nouveau projet
      </button>
    </div>
  );
}

function PromptBox({ mode, onSubmit, loading }: { mode: "planning" | "risks"; onSubmit: (p: string) => void; loading: boolean }) {
  const [prompt, setPrompt] = useState("");

  const config = {
    planning: {
      placeholder: "Décrivez votre projet…\n\nEx : « Planifier le lancement d'une boutique en ligne de vente de vêtements à Douala avec une équipe de 3 personnes, budget 2M FCFA »",
      chips: [["E-commerce", "boutique en ligne"], ["Construction", "projet de construction"], ["Formation", "programme de formation"], ["Douala", " basé à Douala"], ["3 mois", " sur 3 mois"], ["Budget 1M FCFA", " budget 1 million FCFA"]],
      btnLabel: "Planifier le projet", btnColor: "#6366f1",
    },
    risks: {
      placeholder: "Décrivez votre projet pour analyser ses risques…\n\nEx : « Analyser les risques d'un projet de construction d'un entrepôt à Yaoundé, investissement 15M FCFA, durée 6 mois »",
      chips: [["Construction", "construction"], ["Tech", "projet technologique"], ["Commerce", "projet commercial"], ["Yaoundé", " à Yaoundé"], ["6 mois", " durée 6 mois"], ["Import", "importation de marchandises"]],
      btnLabel: "Analyser les risques", btnColor: "#ef4444",
    },
  }[mode];

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 22 }}>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={config.placeholder} rows={5}
        style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e8e8e8", fontSize: 14, color: "#1a1a1a", resize: "vertical", outline: "none", lineHeight: 1.7, fontFamily: "inherit", boxSizing: "border-box", background: "#fafafa" }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0" }}>
        <span style={{ fontSize: 11, color: "#bbb", alignSelf: "center" }}>Ajouter :</span>
        {config.chips.map(([label, val]) => (
          <button key={label} onClick={() => setPrompt(p => p ? p.trimEnd() + " " + val : val)}
            style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid #e8e8e8", background: "#f9fafb", color: "#555", fontSize: 11, cursor: "pointer" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = config.btnColor; (e.currentTarget as HTMLButtonElement).style.color = config.btnColor; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e8e8e8"; (e.currentTarget as HTMLButtonElement).style.color = "#555"; }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => prompt.trim() && onSubmit(prompt.trim())} disabled={!prompt.trim() || loading}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, border: "none", background: prompt.trim() && !loading ? config.btnColor : "#e8e8e8", color: prompt.trim() && !loading ? "#fff" : "#aaa", fontSize: 14, fontWeight: 600, cursor: prompt.trim() && !loading ? "pointer" : "not-allowed" }}>
          {loading ? <><Loader2 size={15} className="animate-spin" /> Génération…</> : config.btnLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function ProjectManagementView() {
  const [mode, setMode] = useState<"planning" | "risks">("planning");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [planResult, setPlanResult] = useState<PlanningResult | null>(null);
  const [riskResult, setRiskResult] = useState<RisksResult | null>(null);

  const reset = () => { setPlanResult(null); setRiskResult(null); setError(""); };

  const handleSubmit = async (prompt: string) => {
    setLoading(true); setError(""); reset();
    try {
      const res = await fetch("/api/projects", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt }),
      });
      let data: any;
      try { data = await res.json(); } catch { setError(`Erreur serveur ${res.status}`); return; }
      if (!res.ok || data.error) { setError(data.error || `Erreur ${res.status}`); return; }
      if (mode === "planning") setPlanResult(data);
      else setRiskResult(data);
    } catch { setError("Backend inaccessible. Démarrez-le sur le port 8001."); }
    finally { setLoading(false); }
  };

  const hasResult = planResult !== null || riskResult !== null;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fafafa" }}>
      <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>🗂️</span>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Gestion de projets</h2>
        </div>
        <p style={{ fontSize: 13, color: "#888", margin: "4px 0 16px" }}>Planifiez vos projets et anticipez les risques avec l'IA, adaptée au contexte camerounais.</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([
            { id: "planning", label: "📋 Planification", color: "#6366f1" },
            { id: "risks",    label: "⚠️ Gestion des risques", color: "#ef4444" },
          ] as const).map(t => (
            <button key={t.id} onClick={() => { setMode(t.id); reset(); }}
              style={{ padding: "10px 18px", borderRadius: 10, border: `2px solid ${mode === t.id ? t.color : "#e8e8e8"}`, background: mode === t.id ? `${t.color}10` : "#fff", color: mode === t.id ? t.color : "#888", fontSize: 13, fontWeight: mode === t.id ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px 28px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
        {!hasResult && <PromptBox mode={mode} onSubmit={handleSubmit} loading={loading} />}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 48 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: mode === "planning" ? "#eef2ff" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={24} color={mode === "planning" ? "#6366f1" : "#ef4444"} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
              {mode === "planning" ? "Planification du projet…" : "Analyse des risques…"}
            </p>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Prise en compte des contraintes locales camerounaises</p>
          </div>
        )}

        {error && <div style={{ padding: "14px 18px", background: "#fef2f2", borderRadius: 12, border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>{error}</div>}
        {planResult && <PlanningOutput data={planResult} onReset={reset} />}
        {riskResult && <RisksOutput data={riskResult} onReset={reset} />}
      </div>
    </div>
  );
}
