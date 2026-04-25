"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, Calculator, BookOpen, LayoutDashboard, Printer } from "lucide-react";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
interface Transaction {
  id: string;
  date: string;
  type: "revenu" | "depense";
  category: string;
  description: string;
  amount: number;
}
interface JournalEntry {
  id: string;
  date: string;
  libelle: string;
  debit: string;
  credit: string;
  amount: number;
}

/* ══════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════ */
const REV_CATEGORIES = ["Ventes de produits", "Prestations de services", "Loyers perçus", "Subventions", "Autres revenus"];
const DEP_CATEGORIES = ["Achats marchandises", "Charges de personnel", "Loyer & charges", "Transport", "Fournitures bureau", "Communication", "Publicité", "Impôts & taxes", "Honoraires", "Autres charges"];
const OHADA_ACCOUNTS = [
  "101 - Capital social", "401 - Fournisseurs", "411 - Clients", "512 - Banque", "571 - Caisse",
  "601 - Achats marchandises", "611 - Transport", "621 - Personnel", "641 - Loyer",
  "701 - Ventes marchandises", "706 - Services vendus", "741 - Subventions",
];
const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function fmtMoney(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}
function fmtPct(n: number) {
  return n.toFixed(2) + " %";
}
function today() {
  return new Date().toISOString().split("T")[0];
}

/* ══════════════════════════════════════════════
   TAB 1 — TABLEAU DE BORD
══════════════════════════════════════════════ */
function Dashboard({ transactions, onAdd, onDelete }: {
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, "id">) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState({ date: today(), type: "revenu" as "revenu" | "depense", category: "", description: "", amount: "" });
  const [showForm, setShowForm] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const totalRev = transactions.filter(t => t.type === "revenu").reduce((s, t) => s + t.amount, 0);
  const totalDep = transactions.filter(t => t.type === "depense").reduce((s, t) => s + t.amount, 0);
  const solde = totalRev - totalDep;

  // 6 derniers mois
  const now = new Date();
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { month: d.getMonth(), year: d.getFullYear(), label: MONTHS_FR[d.getMonth()] };
  });
  const monthData = last6.map(m => {
    const rev = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === m.month && d.getFullYear() === m.year && t.type === "revenu"; }).reduce((s, t) => s + t.amount, 0);
    const dep = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === m.month && d.getFullYear() === m.year && t.type === "depense"; }).reduce((s, t) => s + t.amount, 0);
    return { ...m, rev, dep };
  });
  const maxVal = Math.max(...monthData.map(m => Math.max(m.rev, m.dep)), 1);

  // Top dépenses par catégorie
  const depByCat: Record<string, number> = {};
  transactions.filter(t => t.type === "depense").forEach(t => { depByCat[t.category] = (depByCat[t.category] || 0) + t.amount; });
  const topDep = Object.entries(depByCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxDep = topDep[0]?.[1] || 1;

  const handleAdd = () => {
    if (!form.category || !form.amount || !form.date) return;
    onAdd({ date: form.date, type: form.type, category: form.category, description: form.description, amount: parseFloat(form.amount) });
    setForm({ date: today(), type: "revenu", category: "", description: "", amount: "" });
    setShowForm(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { label: "Total Revenus", value: fmtMoney(totalRev), icon: <TrendingUp size={20} />, color: "#10b981", bg: "#f0fdf4" },
          { label: "Total Dépenses", value: fmtMoney(totalDep), icon: <TrendingDown size={20} />, color: "#ef4444", bg: "#fef2f2" },
          { label: "Solde Trésorerie", value: fmtMoney(solde), icon: <Wallet size={20} />, color: solde >= 0 ? "#10b981" : "#ef4444", bg: solde >= 0 ? "#f0fdf4" : "#fef2f2" },
        ].map(k => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>{k.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", color: k.color }}>{k.icon}</div>
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, color: k.color, margin: 0 }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Bar Chart */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: "0 0 16px" }}>Revenus vs Dépenses — 6 derniers mois</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
            {monthData.map(m => (
              <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", display: "flex", gap: 3, alignItems: "flex-end", height: 120 }}>
                  <div style={{ flex: 1, background: "#10b981", borderRadius: "4px 4px 0 0", height: `${(m.rev / maxVal) * 100}%`, minHeight: 2, transition: "height 0.4s ease" }} title={fmtMoney(m.rev)} />
                  <div style={{ flex: 1, background: "#ef4444", borderRadius: "4px 4px 0 0", height: `${(m.dep / maxVal) * 100}%`, minHeight: 2, transition: "height 0.4s ease" }} title={fmtMoney(m.dep)} />
                </div>
                <span style={{ fontSize: 10, color: "#aaa" }}>{m.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: "#10b981" }} /><span style={{ fontSize: 11, color: "#888" }}>Revenus</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: "#ef4444" }} /><span style={{ fontSize: 11, color: "#888" }}>Dépenses</span></div>
          </div>
        </div>

        {/* Top dépenses */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: "0 0 14px" }}>Top dépenses</p>
          {topDep.length === 0 ? <p style={{ fontSize: 12, color: "#ccc", textAlign: "center", marginTop: 32 }}>Aucune dépense</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topDep.map(([cat, amt]) => (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "65%" }}>{cat}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#ef4444" }}>{fmtMoney(amt)}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 999, background: "#f5f5f5" }}>
                    <div style={{ height: "100%", borderRadius: 999, background: "#ef4444", width: `${(amt / maxDep) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add transaction */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showForm ? 16 : 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Saisie rapide</p>
          <button onClick={() => setShowForm(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <Plus size={13} /> Nouvelle opération
          </button>
        </div>
        {showForm && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
            <div>
              <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Date</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Type</label>
              <select value={form.type} onChange={e => set("type", e.target.value)} style={inputStyle}>
                <option value="revenu">Revenu</option>
                <option value="depense">Dépense</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Catégorie</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
                <option value="">Choisir…</option>
                {(form.type === "revenu" ? REV_CATEGORIES : DEP_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Montant (FCFA)</label>
              <input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0" style={inputStyle} />
            </div>
            <button onClick={handleAdd} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", height: 38 }}>
              Ajouter
            </button>
          </div>
        )}
      </div>

      {/* Recent transactions */}
      {transactions.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Dernières opérations</p>
          </div>
          <div>
            {transactions.slice(0, 12).map(t => (
              <div key={t.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 140px 130px 32px", alignItems: "center", gap: 12, padding: "11px 20px", borderBottom: "1px solid #f9f9f9" }}>
                <span style={{ fontSize: 11, color: "#aaa" }}>{t.date}</span>
                <div>
                  <p style={{ fontSize: 13, color: "#1a1a1a", margin: 0, fontWeight: 500 }}>{t.description || t.category}</p>
                  <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>{t.category}</p>
                </div>
                <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 6, background: t.type === "revenu" ? "#f0fdf4" : "#fef2f2", color: t.type === "revenu" ? "#10b981" : "#ef4444", fontWeight: 600, textAlign: "center" }}>
                  {t.type === "revenu" ? "Revenu" : "Dépense"}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: t.type === "revenu" ? "#10b981" : "#ef4444", textAlign: "right" }}>
                  {t.type === "revenu" ? "+" : "-"}{fmtMoney(t.amount)}
                </span>
                <button onClick={() => onDelete(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e0e0e0", padding: 0, display: "flex" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#e0e0e0")}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAB 2 — CALCULATEUR FISCAL
══════════════════════════════════════════════ */
function FiscalCalc() {
  const [tab, setTab] = useState<"tva" | "irpp" | "is" | "patente">("tva");

  // TVA
  const [htAmount, setHtAmount] = useState("");
  const tva = parseFloat(htAmount || "0") * 0.1925;
  const ttc = parseFloat(htAmount || "0") + tva;

  // IRPP
  const [salaireBrut, setSalaireBrut] = useState("");
  const sb = parseFloat(salaireBrut || "0");
  const irppBrackets = [
    { limit: 2_000_000, rate: 0.10 },
    { limit: 3_000_000, rate: 0.15 },
    { limit: 5_000_000, rate: 0.25 },
    { limit: Infinity, rate: 0.35 },
  ];
  let irppTotal = 0; let remaining = sb; const irppDetails: { label: string; base: number; rate: number; tax: number }[] = [];
  let prev = 0;
  for (const b of irppBrackets) {
    if (remaining <= 0) break;
    const base = Math.min(remaining, b.limit - prev);
    const tax = base * b.rate;
    irppDetails.push({ label: prev === 0 ? `0 – ${(b.limit/1e6).toFixed(0)}M` : `${(prev/1e6).toFixed(0)}M – ${b.limit === Infinity ? "∞" : (b.limit/1e6).toFixed(0)+"M"}`, base, rate: b.rate * 100, tax });
    irppTotal += tax; remaining -= base; prev = b.limit;
  }
  const salaireNet = sb - irppTotal;

  // IS
  const [benefice, setBenefice] = useState("");
  const [ca, setCa] = useState("");
  const bn = parseFloat(benefice || "0");
  const caVal = parseFloat(ca || "0");
  const isTax = bn * 0.33;
  const isMin = caVal * 0.01;
  const isDue = Math.max(isTax, isMin);

  // Patente (barème simplifié Cameroun)
  const [caPatente, setCaPatente] = useState("");
  const cap = parseFloat(caPatente || "0");
  const patenteRate = cap < 10_000_000 ? 0 : cap < 50_000_000 ? 0.005 : cap < 100_000_000 ? 0.01 : 0.02;
  const patenteLabel = cap < 10_000_000 ? "Régime libératoire (exonéré)" : cap < 50_000_000 ? "0,5% — Régime simplifié" : cap < 100_000_000 ? "1% — Régime réel" : "2% — Grand contribuable";
  const patenteDue = cap * patenteRate;

  const tabStyle = (active: boolean, color: string) => ({
    padding: "8px 16px", borderRadius: 8, border: "none", background: active ? `${color}15` : "transparent",
    color: active ? color : "#888", fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.15s",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 20 }}>
        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#f9fafb", borderRadius: 10, padding: 4 }}>
          {([
            { id: "tva", label: "TVA 19,25%" },
            { id: "irpp", label: "IRPP" },
            { id: "is", label: "IS (Impôt Sociétés)" },
            { id: "patente", label: "Patente" },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(tab === t.id, "#6366f1")}>{t.label}</button>
          ))}
        </div>

        {/* TVA */}
        {tab === "tva" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Article 125 CGI Cameroun — TVA 16,5% + CAC 2,75% = <strong>19,25%</strong></p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Montant HT (FCFA)</label>
                <input type="number" value={htAmount} onChange={e => setHtAmount(e.target.value)} placeholder="Ex : 500 000" style={inputStyle} />
              </div>
            </div>
            {parseFloat(htAmount) > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <ResultBox label="TVA (19,25%)" value={fmtMoney(Math.round(tva))} color="#6366f1" />
                <ResultBox label="Montant HT" value={fmtMoney(parseFloat(htAmount))} color="#888" />
                <ResultBox label="Total TTC" value={fmtMoney(Math.round(ttc))} color="#10b981" big />
              </div>
            )}
          </div>
        )}

        {/* IRPP */}
        {tab === "irpp" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Barème progressif — Loi de finances Cameroun</p>
            <div>
              <label style={labelStyle}>Salaire brut annuel (FCFA)</label>
              <input type="number" value={salaireBrut} onChange={e => setSalaireBrut(e.target.value)} placeholder="Ex : 4 800 000" style={{ ...inputStyle, maxWidth: 300 }} />
            </div>
            {sb > 0 && (
              <>
                <div style={{ background: "#f9fafb", borderRadius: 12, overflow: "hidden", border: "1px solid #e8e8e8" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#f0f0f0" }}>
                        {["Tranche", "Base imposable", "Taux", "Impôt"].map(h => (
                          <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, color: "#888", fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {irppDetails.filter(r => r.base > 0).map((r, i) => (
                        <tr key={i} style={{ borderTop: "1px solid #f0f0f0" }}>
                          <td style={{ padding: "8px 12px", color: "#555" }}>{r.label}</td>
                          <td style={{ padding: "8px 12px", color: "#555" }}>{fmtMoney(Math.round(r.base))}</td>
                          <td style={{ padding: "8px 12px" }}><span style={{ background: "#eef2ff", color: "#6366f1", padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 600 }}>{r.rate}%</span></td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#1a1a1a" }}>{fmtMoney(Math.round(r.tax))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <ResultBox label="IRPP Total" value={fmtMoney(Math.round(irppTotal))} color="#f97316" />
                  <ResultBox label="Salaire brut" value={fmtMoney(sb)} color="#888" />
                  <ResultBox label="Salaire net" value={fmtMoney(Math.round(salaireNet))} color="#10b981" big />
                </div>
              </>
            )}
          </div>
        )}

        {/* IS */}
        {tab === "is" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>IS = 33% du bénéfice net avec minimum de 1% du chiffre d'affaires</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Bénéfice net (FCFA)</label>
                <input type="number" value={benefice} onChange={e => setBenefice(e.target.value)} placeholder="Ex : 10 000 000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Chiffre d'affaires (FCFA)</label>
                <input type="number" value={ca} onChange={e => setCa(e.target.value)} placeholder="Ex : 80 000 000" style={inputStyle} />
              </div>
            </div>
            {bn > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <ResultBox label="IS calculé (33%)" value={fmtMoney(Math.round(isTax))} color="#6366f1" />
                  <ResultBox label="Minimum IS (1% CA)" value={fmtMoney(Math.round(isMin))} color="#f59e0b" />
                  <ResultBox label="IS dû (le plus élevé)" value={fmtMoney(Math.round(isDue))} color="#ef4444" big />
                </div>
                <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>
                  {isDue === isMin ? "⚠️ Le minimum de perception (1% CA) s'applique car il est supérieur à l'IS calculé." : "✅ L'IS calculé sur le bénéfice s'applique."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Patente */}
        {tab === "patente" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Droit de patente — basé sur le chiffre d'affaires annuel</p>
            <div>
              <label style={labelStyle}>Chiffre d'affaires annuel (FCFA)</label>
              <input type="number" value={caPatente} onChange={e => setCaPatente(e.target.value)} placeholder="Ex : 30 000 000" style={{ ...inputStyle, maxWidth: 300 }} />
            </div>
            {cap > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: "12px 16px", background: "#eef2ff", borderRadius: 10, border: "1px solid #c7d2fe" }}>
                  <p style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, margin: "0 0 4px" }}>Régime applicable</p>
                  <p style={{ fontSize: 14, color: "#1a1a1a", margin: 0 }}>{patenteLabel}</p>
                </div>
                {cap >= 10_000_000 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <ResultBox label="CA déclaré" value={fmtMoney(cap)} color="#888" />
                    <ResultBox label="Patente due" value={fmtMoney(Math.round(patenteDue))} color="#f97316" big />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultBox({ label, value, color, big }: { label: string; value: string; color: string; big?: boolean }) {
  return (
    <div style={{ padding: "14px 16px", background: big ? `${color}10` : "#f9fafb", borderRadius: 12, border: `1px solid ${big ? color + "30" : "#e8e8e8"}` }}>
      <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 6px" }}>{label}</p>
      <p style={{ fontSize: big ? 16 : 14, fontWeight: 700, color, margin: 0 }}>{value}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAB 3 — JOURNAL COMPTABLE
══════════════════════════════════════════════ */
function Journal({ entries, onAdd, onDelete }: {
  entries: JournalEntry[];
  onAdd: (e: Omit<JournalEntry, "id">) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState({ date: today(), libelle: "", debit: "", credit: "", amount: "" });
  const [showForm, setShowForm] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const printRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    if (!form.libelle || !form.debit || !form.credit || !form.amount) return;
    onAdd({ date: form.date, libelle: form.libelle, debit: form.debit, credit: form.credit, amount: parseFloat(form.amount) });
    setForm({ date: today(), libelle: "", debit: "", credit: "", amount: "" });
    setShowForm(false);
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Journal comptable</title>
    <style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;padding:30px;font-size:12px}
    table{width:100%;border-collapse:collapse}th{background:#f5f5f5;padding:8px 10px;text-align:left;border-bottom:2px solid #e0e0e0;font-size:11px}
    td{padding:8px 10px;border-bottom:1px solid #f0f0f0}h2{margin-bottom:16px}</style>
    </head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 400);
  };

  const totalDebit = entries.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #e8e8e8", background: "#fff", color: "#555", fontSize: 12, cursor: "pointer" }}>
            <Printer size={13} /> Imprimer
          </button>
          <button onClick={() => setShowForm(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <Plus size={13} /> Nouvelle écriture
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #3b82f620", padding: 20, boxShadow: "0 4px 16px rgba(59,130,246,0.07)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: "0 0 14px" }}>Nouvelle écriture comptable</p>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 1fr 130px", gap: 12, alignItems: "flex-end" }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Libellé</label>
              <input value={form.libelle} onChange={e => set("libelle", e.target.value)} placeholder="Description de l'opération" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Compte Débit</label>
              <select value={form.debit} onChange={e => set("debit", e.target.value)} style={inputStyle}>
                <option value="">Choisir…</option>
                {OHADA_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Compte Crédit</label>
              <select value={form.credit} onChange={e => set("credit", e.target.value)} style={inputStyle}>
                <option value="">Choisir…</option>
                {OHADA_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Montant (FCFA)</label>
              <input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, gap: 8 }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e8e8e8", background: "#fff", color: "#555", fontSize: 12, cursor: "pointer" }}>Annuler</button>
            <button onClick={handleAdd} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Enregistrer</button>
          </div>
        </div>
      )}

      {/* Journal table */}
      <div ref={printRef} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", overflow: "hidden" }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", margin: 0, padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
          Journal général — {entries.length} écriture{entries.length !== 1 ? "s" : ""}
        </h2>
        {entries.length === 0 ? (
          <p style={{ textAlign: "center", color: "#ccc", padding: "40px 20px", fontSize: 13 }}>Aucune écriture. Commencez par ajouter une opération.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Date", "Libellé", "Compte Débit", "Compte Crédit", "Montant", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#888", fontWeight: 600, borderBottom: "1px solid #e8e8e8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "10px 14px", color: "#888", fontSize: 11 }}>{e.date}</td>
                  <td style={{ padding: "10px 14px", color: "#1a1a1a", fontWeight: 500 }}>{e.libelle}</td>
                  <td style={{ padding: "10px 14px" }}><span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "2px 7px", borderRadius: 5, fontSize: 11 }}>{e.debit.split(" - ")[0]}</span> <span style={{ fontSize: 11, color: "#888" }}>{e.debit.split(" - ")[1]}</span></td>
                  <td style={{ padding: "10px 14px" }}><span style={{ background: "#f0fdf4", color: "#15803d", padding: "2px 7px", borderRadius: 5, fontSize: 11 }}>{e.credit.split(" - ")[0]}</span> <span style={{ fontSize: 11, color: "#888" }}>{e.credit.split(" - ")[1]}</span></td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "#1a1a1a" }}>{fmtMoney(e.amount)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <button onClick={() => onDelete(e.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e0e0e0" }}
                      onMouseEnter={ev => (ev.currentTarget.style.color = "#ef4444")}
                      onMouseLeave={ev => (ev.currentTarget.style.color = "#e0e0e0")}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr style={{ background: "#f9fafb", borderTop: "2px solid #e8e8e8" }}>
                <td colSpan={4} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>TOTAL</td>
                <td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 800, color: "#3b82f6" }}>{fmtMoney(totalDebit)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STYLES PARTAGÉS
══════════════════════════════════════════════ */
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 11px", borderRadius: 8, border: "1px solid #e8e8e8",
  fontSize: 13, outline: "none", boxSizing: "border-box", background: "#fff",
};
const labelStyle: React.CSSProperties = { fontSize: 11, color: "#888", display: "block", marginBottom: 4 };

/* ══════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════ */
export default function AccountingView() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "fiscal" | "journal">("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    try {
      const t = localStorage.getItem("saim_transactions");
      if (t) setTransactions(JSON.parse(t));
      const j = localStorage.getItem("saim_journal");
      if (j) setJournalEntries(JSON.parse(j));
    } catch {}
  }, []);

  const saveTransactions = (data: Transaction[]) => {
    setTransactions(data);
    try { localStorage.setItem("saim_transactions", JSON.stringify(data)); } catch {}
  };
  const saveJournal = (data: JournalEntry[]) => {
    setJournalEntries(data);
    try { localStorage.setItem("saim_journal", JSON.stringify(data)); } catch {}
  };

  const addTransaction = (t: Omit<Transaction, "id">) =>
    saveTransactions([{ ...t, id: Math.random().toString(36).slice(2, 10) }, ...transactions]);
  const deleteTransaction = (id: string) => saveTransactions(transactions.filter(t => t.id !== id));

  const addJournalEntry = (e: Omit<JournalEntry, "id">) =>
    saveJournal([{ ...e, id: Math.random().toString(36).slice(2, 10) }, ...journalEntries]);
  const deleteJournalEntry = (id: string) => saveJournal(journalEntries.filter(e => e.id !== id));

  const TABS = [
    { id: "dashboard", icon: <LayoutDashboard size={15} />, label: "Tableau de bord", color: "#10b981" },
    { id: "fiscal",    icon: <Calculator size={15} />,      label: "Calculateur fiscal", color: "#6366f1" },
    { id: "journal",   icon: <BookOpen size={15} />,        label: "Journal comptable",  color: "#3b82f6" },
  ] as const;

  const activeColor = TABS.find(t => t.id === activeTab)?.color || "#10b981";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fafafa" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>💼</span>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Comptabilité</h2>
        </div>
        <p style={{ fontSize: 13, color: "#888", margin: "4px 0 16px" }}>Suivi financier, calcul des taxes et journal OHADA.</p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: `2px solid ${activeTab === t.id ? t.color : "#e8e8e8"}`, background: activeTab === t.id ? `${t.color}10` : "#fff", color: activeTab === t.id ? t.color : "#888", fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "20px 28px 28px" }}>
        {activeTab === "dashboard" && <Dashboard transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} />}
        {activeTab === "fiscal"    && <FiscalCalc />}
        {activeTab === "journal"   && <Journal entries={journalEntries} onAdd={addJournalEntry} onDelete={deleteJournalEntry} />}
      </div>
    </div>
  );
}
