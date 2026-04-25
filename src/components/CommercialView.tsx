"use client";

import { useState } from "react";
import { Loader2, Sparkles, RefreshCw, Copy, Check, TrendingUp, AlertTriangle, MessageSquare, Target, Users } from "lucide-react";

/* ── Types ── */
interface Need { need: string; priority: "Haute" | "Moyenne" | "Faible"; detail: string; }
interface Objection { objection: string; response: string; }
interface AnalyseResult {
  name: string; sector: string; company_size: string;
  score: number; score_label: string; score_reason: string;
  purchase_potential: string;
  needs: Need[]; objections: Objection[];
  recommended_approach: string; best_contact: string;
  next_steps: string[]; decision_makers: string[]; timeline: string;
}
interface PropositionResult {
  channel: string; prospect_name: string; subject: string; hook: string;
  message: string; value_props: string[]; cta: string; follow_up: string;
  cultural_notes: string; variant_short: string;
}

/* ── Helpers ── */
const PRIORITY_COLOR: Record<string, { bg: string; color: string }> = {
  Haute: { bg: "#fef2f2", color: "#dc2626" },
  Moyenne: { bg: "#fffbeb", color: "#d97706" },
  Faible: { bg: "#f0fdf4", color: "#16a34a" },
};
const CHANNEL_STYLE: Record<string, { bg: string; color: string; emoji: string }> = {
  WhatsApp:      { bg: "#dcfce7", color: "#15803d", emoji: "💬" },
  Email:         { bg: "#dbeafe", color: "#1d4ed8", emoji: "📧" },
  Téléphone:     { bg: "#fef9c3", color: "#a16207", emoji: "📞" },
  "Face à face": { bg: "#f3e8ff", color: "#7e22ce", emoji: "🤝" },
};

function scoreColor(s: number) { return s >= 8 ? "#10b981" : s >= 5 ? "#f59e0b" : "#ef4444"; }

/* ── Composant Score ── */
function ScoreCircle({ score, label }: { score: number; label: string }) {
  const c = scoreColor(score);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ width: 88, height: 88, borderRadius: "50%", border: `5px solid ${c}`, background: `${c}12`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: c, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 10, color: "#aaa" }}>/10</span>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{label}</span>
    </div>
  );
}

/* ── Rendu Analyse ── */
function AnalyseOutput({ data, onReset }: { data: AnalyseResult; onReset: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header card */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
          <ScoreCircle score={data.score} label={data.score_label} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>{data.name || "Prospect"}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {data.sector && <Tag label={data.sector} bg="#f0f9f6" color="#10b981" />}
              {data.company_size && <Tag label={data.company_size} bg="#f5f5f5" color="#555" />}
              {data.timeline && <Tag label={`⏱ ${data.timeline}`} bg="#fffbeb" color="#d97706" />}
            </div>
            <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.6 }}><strong>Potentiel :</strong> {data.purchase_potential}</p>
            <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0", fontStyle: "italic" }}>{data.score_reason}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Besoins */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 20 }}>
          <SectionTitle icon={<Target size={14} />} label="Besoins identifiés" color="#6366f1" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {(data.needs || []).map((n, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: PRIORITY_COLOR[n.priority]?.bg || "#f9f9f9", borderLeft: `3px solid ${PRIORITY_COLOR[n.priority]?.color || "#888"}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{n.need}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_COLOR[n.priority]?.color, padding: "2px 6px", background: "#fff", borderRadius: 4 }}>{n.priority}</span>
                </div>
                {n.detail && <p style={{ fontSize: 11, color: "#888", margin: 0, lineHeight: 1.5 }}>{n.detail}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Objections */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 20 }}>
          <SectionTitle icon={<AlertTriangle size={14} />} label="Objections & réponses" color="#f97316" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {(data.objections || []).map((o, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: "#fafafa", border: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", margin: "0 0 5px" }}>❝ {o.objection}</p>
                <p style={{ fontSize: 12, color: "#10b981", margin: 0, fontStyle: "italic" }}>→ {o.response}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Approche + contact */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 20 }}>
          <SectionTitle icon={<TrendingUp size={14} />} label="Approche recommandée" color="#10b981" />
          <p style={{ fontSize: 13, color: "#444", margin: "12px 0 12px", lineHeight: 1.6 }}>{data.recommended_approach}</p>
          {data.best_contact && (
            <div style={{ padding: "8px 12px", background: "#f0fdf4", borderRadius: 8, fontSize: 12, color: "#10b981", fontWeight: 500 }}>📅 {data.best_contact}</div>
          )}
          {data.decision_makers?.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 6px" }}>DÉCIDEURS</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {data.decision_makers.map((d, i) => <Tag key={i} label={d} bg="#f5f5f5" color="#555" />)}
              </div>
            </div>
          )}
        </div>

        {/* Prochaines étapes */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 20 }}>
          <SectionTitle icon={<Users size={14} />} label="Prochaines étapes" color="#6366f1" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {(data.next_steps || []).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#6366f1", flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.5 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ResetButton onReset={onReset} />
    </div>
  );
}

/* ── Rendu Proposition ── */
function PropositionOutput({ data, onReset }: { data: PropositionResult; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);
  const ch = CHANNEL_STYLE[data.channel] || { bg: "#f5f5f5", color: "#555", emoji: "📩" };

  const copy = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Channel + sujet */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: "18px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ padding: "6px 14px", borderRadius: 10, background: ch.bg, color: ch.color, fontSize: 13, fontWeight: 700 }}>{ch.emoji} {data.channel}</span>
            {data.prospect_name && <Tag label={`Pour : ${data.prospect_name}`} bg="#f5f5f5" color="#555" />}
          </div>
        </div>
        <p style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px", lineHeight: 1.3 }}>"{data.hook}"</p>
        {data.subject && <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Objet : {data.subject}</p>}
      </div>

      {/* Message complet */}
      <div style={{ background: "#fff", borderRadius: 16, border: `2px solid ${ch.color}30`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", background: `${ch.bg}`, borderBottom: `1px solid ${ch.color}20` }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: ch.color, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Message complet</p>
          <button onClick={() => copy(data.message, setCopied)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: "none", background: ch.color, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            {copied ? <><Check size={11} /> Copié !</> : <><Copy size={11} /> Copier</>}
          </button>
        </div>
        <div style={{ padding: "18px 20px" }}>
          <pre style={{ fontSize: 14, color: "#1a1a1a", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "inherit" }}>{data.message}</pre>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Valeurs + CTA */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 20 }}>
          <SectionTitle icon={<Sparkles size={14} />} label="Arguments clés" color="#6366f1" />
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 12 }}>
            {(data.value_props || []).map((v, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#10b981", fontSize: 14, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.5 }}>{v}</p>
              </div>
            ))}
          </div>
          {data.cta && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #10b98130" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#10b981", margin: "0 0 4px" }}>APPEL À L'ACTION</p>
              <p style={{ fontSize: 13, color: "#1a1a1a", margin: 0, fontWeight: 500 }}>{data.cta}</p>
            </div>
          )}
        </div>

        {/* Suivi + notes culturelles + version courte */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.follow_up && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: "14px 16px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", margin: "0 0 6px" }}>STRATÉGIE DE RELANCE</p>
              <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.5 }}>{data.follow_up}</p>
            </div>
          )}
          {data.cultural_notes && (
            <div style={{ background: "#fff7ed", borderRadius: 14, border: "1px solid #fed7aa", padding: "14px 16px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#f97316", margin: "0 0 6px" }}>🌍 ADAPTATION CULTURELLE</p>
              <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.5 }}>{data.cultural_notes}</p>
            </div>
          )}
          {data.variant_short && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #f0f0f0", background: "#f9fafb" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", margin: 0 }}>VERSION COURTE</p>
                <button onClick={() => copy(data.variant_short, setCopiedShort)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 5, border: "none", background: "#e8e8e8", color: "#666", fontSize: 10, cursor: "pointer" }}>
                  {copiedShort ? <><Check size={9} /> Copié</> : <><Copy size={9} /> Copier</>}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#555", margin: 0, padding: "12px 14px", lineHeight: 1.6 }}>{data.variant_short}</p>
            </div>
          )}
        </div>
      </div>
      <ResetButton onReset={onReset} />
    </div>
  );
}

/* ── Shared sub-components ── */
function Tag({ label, bg, color }: { label: string; bg: string; color: string }) {
  return <span style={{ padding: "3px 9px", borderRadius: 999, background: bg, color, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>;
}
function SectionTitle({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ color }}>{icon}</span>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
    </div>
  );
}
function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={onReset} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, border: "1px solid #e8e8e8", background: "#fff", color: "#666", fontSize: 12, cursor: "pointer" }}>
        <RefreshCw size={12} /> Nouvelle analyse
      </button>
    </div>
  );
}

/* ── Prompt Box ── */
function PromptBox({ mode, onSubmit, loading }: { mode: "analyse" | "proposition"; onSubmit: (p: string) => void; loading: boolean }) {
  const [prompt, setPrompt] = useState("");

  const config = {
    analyse: {
      placeholder: "Décrivez le prospect…\n\nEx : « Analyser Techno Plus SARL, PME 20 employés à Douala, secteur IT, cherche une solution de gestion comptable »",
      chips: [["PME", "PME d'environ 20 employés"], ["Grande entreprise", "grande entreprise"], ["Startup", "startup en phase de lancement"], ["Douala", "basée à Douala"], ["Yaoundé", "basée à Yaoundé"], ["Secteur IT", "dans le secteur des technologies"]],
      btnLabel: "Analyser le prospect",
      btnColor: "#f97316",
      icon: <Target size={15} />,
    },
    proposition: {
      placeholder: "Décrivez le prospect et le canal souhaité…\n\nEx : « Message WhatsApp pour ACME SA, distributeur alimentaire Yaoundé, présentez nos services de livraison rapide »",
      chips: [["💬 WhatsApp", " via WhatsApp"], ["📧 Email", " par email"], ["📞 Téléphone", " par téléphone"], ["🤝 Face à face", " en rendez-vous physique"], ["Douala", " à Douala"], ["PME", " pour une PME"]],
      btnLabel: "Générer la proposition",
      btnColor: "#6366f1",
      icon: <MessageSquare size={15} />,
    },
  }[mode];

  const addChip = (text: string) => setPrompt(p => p ? p.trimEnd() + " " + text : text);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 22 }}>
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder={config.placeholder}
        rows={5}
        style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e8e8e8", fontSize: 14, color: "#1a1a1a", resize: "vertical", outline: "none", lineHeight: 1.7, fontFamily: "inherit", boxSizing: "border-box", background: "#fafafa" }}
      />
      {/* Context chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0" }}>
        <span style={{ fontSize: 11, color: "#bbb", alignSelf: "center" }}>Ajouter :</span>
        {config.chips.map(([label, val]) => (
          <button key={label} onClick={() => addChip(val)}
            style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid #e8e8e8", background: "#f9fafb", color: "#555", fontSize: 11, cursor: "pointer", transition: "all 0.1s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = config.btnColor; (e.currentTarget as HTMLButtonElement).style.color = config.btnColor; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e8e8e8"; (e.currentTarget as HTMLButtonElement).style.color = "#555"; }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => prompt.trim() && onSubmit(prompt.trim())} disabled={!prompt.trim() || loading}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, border: "none", background: prompt.trim() && !loading ? config.btnColor : "#e8e8e8", color: prompt.trim() && !loading ? "#fff" : "#aaa", fontSize: 14, fontWeight: 600, cursor: prompt.trim() && !loading ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
          {loading ? <><Loader2 size={15} className="animate-spin" /> Analyse en cours…</> : <>{config.icon} {config.btnLabel}</>}
        </button>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function CommercialView() {
  const [mode, setMode] = useState<"analyse" | "proposition">("analyse");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyseResult, setAnalyseResult] = useState<AnalyseResult | null>(null);
  const [propResult, setPropResult] = useState<PropositionResult | null>(null);

  const reset = () => { setAnalyseResult(null); setPropResult(null); setError(""); };

  const handleSubmit = async (prompt: string) => {
    setLoading(true); setError(""); reset();
    try {
      const res = await fetch("/api/commercial", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt }),
      });
      let data: any;
      try { data = await res.json(); } catch { setError(`Erreur serveur ${res.status}`); return; }
      if (!res.ok || data.error) { setError(data.error || `Erreur ${res.status}`); return; }
      if (mode === "analyse") setAnalyseResult(data);
      else setPropResult(data);
    } catch { setError("Backend inaccessible. Démarrez-le sur le port 8001."); }
    finally { setLoading(false); }
  };

  const hasResult = analyseResult !== null || propResult !== null;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fafafa" }}>
      <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>📦</span>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Gestion commerciale</h2>
        </div>
        <p style={{ fontSize: 13, color: "#888", margin: "4px 0 16px" }}>Analysez vos prospects et créez des propositions percutantes adaptées au marché camerounais.</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([
            { id: "analyse",     label: "Analyse prospect",       color: "#f97316" },
            { id: "proposition", label: "Proposition commerciale", color: "#6366f1" },
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
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={24} color="#f97316" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
              {mode === "analyse" ? "Analyse du prospect en cours…" : "Rédaction de la proposition…"}
            </p>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Le modèle IA analyse le contexte camerounais</p>
          </div>
        )}

        {error && <div style={{ padding: "14px 18px", background: "#fef2f2", borderRadius: 12, border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>{error}</div>}

        {analyseResult && <AnalyseOutput data={analyseResult} onReset={reset} />}
        {propResult && <PropositionOutput data={propResult} onReset={reset} />}
      </div>
    </div>
  );
}
