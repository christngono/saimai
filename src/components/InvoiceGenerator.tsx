"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, MicOff, Camera, Download, FileText, Loader2, X } from "lucide-react";

interface Company {
  companyName: string;
  logo: string | null;
  city: string;
  country: string;
  email: string;
  phone: string;
  sector: string;
}

interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  validUntil?: string;
  client: { name: string; address: string; email: string; phone: string };
  items: InvoiceItem[];
  subtotal: number;
  tvaRate: number;
  tva: number;
  total: number;
  currency: string;
  notes: string;
  payment_terms?: string;
  payment_methods?: string[];
  conditions?: string;
}

interface Props {
  company: Company | null;
}

export default function InvoiceGenerator({ company }: Props) {
  const [docMode, setDocMode] = useState<"facture" | "devis">("facture");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported(!!SR);
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      setImageB64(result); // on envoie le data URL complet (inclut le type MIME)
    };
    reader.readAsDataURL(file);
  };

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    transcriptRef.current = "";
    const rec = new SR();
    rec.lang = "fr-FR";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e: any) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      const full = (final + interim).trim();
      transcriptRef.current = full;
      setPrompt(full);
    };
    rec.onend = () => {
      // Redémarre automatiquement si l'utilisateur n'a pas cliqué Stop
      if (recognitionRef.current === rec) {
        try { rec.start(); } catch {}
      }
    };
    rec.onerror = (e: any) => {
      if (e.error === "no-speech") return; // silencieux, on continue
      setIsRecording(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = rec;
    rec.start();
  };

  const stopVoice = () => {
    const rec = recognitionRef.current;
    recognitionRef.current = null; // empêche le redémarrage automatique
    rec?.stop();
    setIsRecording(false);
  };

  const generate = async () => {
    if (!prompt.trim() && !imageB64) return;
    setLoading(true);
    setError("");
    setInvoice(null);
    try {
      const res = await fetch("/api/invoice/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), image_base64: imageB64, mode: docMode }),
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        setError(`Erreur serveur (${res.status}) — le backend ne répond pas correctement. Vérifiez qu'il est démarré sur le port 8001.`);
        return;
      }

      if (!res.ok || data.error) {
        const detail = data.raw ? `\n\nRéponse brute : ${data.raw}` : "";
        setError((data.error || `Erreur ${res.status}`) + detail);
        return;
      }

      // Normalise la réponse pour éviter les crashes sur champs manquants
      if (!data.client || typeof data.client !== "object") data.client = { name: "", address: "", email: "", phone: "" };
      if (!Array.isArray(data.items)) data.items = [];
      data.items = data.items.map((it: any) => ({
        description: it.description ?? "",
        qty: Number(it.qty) || 0,
        unitPrice: Number(it.unitPrice) || 0,
        total: Number(it.total) || 0,
      }));
      data.subtotal = Number(data.subtotal) || 0;
      data.tvaRate = Number(data.tvaRate) || 19.25;
      data.tva = Number(data.tva) || 0;
      data.total = Number(data.total) || 0;
      data.currency = data.currency || "FCFA";
      data.invoiceNumber = data.invoiceNumber || `${docMode === "devis" ? "DEVIS" : "FACT"}-${new Date().getFullYear()}-001`;
      data.date = data.date || new Date().toLocaleDateString("fr-FR");
      data.dueDate = data.dueDate || "";

      if (data.items.length === 0) {
        setError("Le modèle n'a pas pu identifier d'articles dans votre description. Essayez d'être plus précis : ex. \"10 stylos à 500 FCFA chacun pour le client Dupont\".");
        return;
      }

      setInvoice(data);
    } catch {
      setError("Impossible de joindre le serveur. Vérifiez que le backend est démarré : uvicorn main:app --port 8001");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!invoice) return;
    const html = buildInvoiceHTML(invoice, company);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) return;
    win.addEventListener("load", () => {
      win.print();
      URL.revokeObjectURL(url);
    });
  };

  const fmt = (n: number, cur = "FCFA") =>
    n.toLocaleString("fr-FR") + " " + cur;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fafafa" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>📃</span>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Factures & Devis</h2>
        </div>
        <p style={{ fontSize: 13, color: "#888", margin: "4px 0 14px" }}>
          Décrivez votre document en texte, photo ou audio — SAIM génère un PDF avec l'en-tête de votre entreprise.
        </p>
        {/* Mode tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {([
            { id: "facture", label: "🧾 Facture",   color: "#10b981" },
            { id: "devis",   label: "📋 Devis",      color: "#6366f1" },
          ] as const).map(m => (
            <button key={m.id} onClick={() => { setDocMode(m.id); setInvoice(null); setError(""); }}
              style={{ padding: "9px 18px", borderRadius: 10, border: `2px solid ${docMode === m.id ? m.color : "#e8e8e8"}`, background: docMode === m.id ? `${m.color}10` : "#fff", color: docMode === m.id ? m.color : "#888", fontSize: 13, fontWeight: docMode === m.id ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Input card */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
            {docMode === "devis" ? "Décrivez le devis" : "Décrivez la facture"}
          </p>

          {/* Image preview */}
          {imagePreview && (
            <div style={{ position: "relative", marginBottom: 12, display: "inline-block" }}>
              <img src={imagePreview} alt="Facture" style={{ maxHeight: 160, borderRadius: 8, border: "1px solid #e8e8e8" }} />
              <button
                onClick={() => { setImagePreview(null); setImageB64(null); }}
                style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", background: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={12} color="#fff" />
              </button>
            </div>
          )}

          {/* Recording indicator */}
          {isRecording && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "8px 12px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "pulse 1s infinite" }} />
              <span style={{ fontSize: 12, color: "#dc2626" }}>Écoute en cours…</span>
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={docMode === "devis"
              ? `Exemples :\n• "Devis pour ACME SA — développement site web 500 000 FCFA, validité 30 jours, paiement Mobile Money"\n• "Devis pour Jean Dupont : formation comptabilité 2 jours à 75 000 FCFA/jour"`
              : `Exemples :\n• "Facture pour ACME SA — conseil fiscal 3h à 75 000 FCFA/h, TVA 19,25%"\n• "Client : Jean Dupont, Douala. Fourniture 50 rames de papier A4 à 3 500 FCFA l'unité"`}
            rows={5}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e8e8e8", background: "#fafafa", fontSize: 14, color: "#1a1a1a", resize: "vertical", outline: "none", lineHeight: 1.6, fontFamily: "inherit", boxSizing: "border-box" }}
          />

          {/* Action bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {/* Upload image */}
              <button
                onClick={() => fileRef.current?.click()}
                title="Importer une image de facture"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1px solid #e8e8e8", background: "#fff", color: "#666", fontSize: 12, cursor: "pointer" }}
              >
                <Paperclip size={14} /> Image
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />

              {/* Camera */}
              <button
                onClick={() => cameraRef.current?.click()}
                title="Prendre une photo"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1px solid #e8e8e8", background: "#fff", color: "#666", fontSize: 12, cursor: "pointer" }}
              >
                <Camera size={14} /> Photo
              </button>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleImage} style={{ display: "none" }} />

              {/* Voice */}
              {voiceSupported && (
                <button
                  onClick={isRecording ? stopVoice : startVoice}
                  title={isRecording ? "Arrêter" : "Dicter la facture"}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: `1px solid ${isRecording ? "#ef4444" : "#e8e8e8"}`, background: isRecording ? "#fef2f2" : "#fff", color: isRecording ? "#ef4444" : "#666", fontSize: 12, cursor: "pointer" }}
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  {isRecording ? "Stop" : "Audio"}
                </button>
              )}
            </div>

            <button
              onClick={generate}
              disabled={loading || (!prompt.trim() && !imageB64)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 10, border: "none", background: (!prompt.trim() && !imageB64) || loading ? "#e8e8e8" : "#10b981", color: (!prompt.trim() && !imageB64) || loading ? "#aaa" : "#fff", fontSize: 14, fontWeight: 600, cursor: loading || (!prompt.trim() && !imageB64) ? "not-allowed" : "pointer", transition: "all 0.15s" }}
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Génération…</> : <><Send size={14} /> Générer la facture</>}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "12px 16px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Invoice preview */}
        {invoice && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", overflow: "hidden" }}>
            {/* Preview header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f0f0f0", background: "#f9fafb" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={18} color="#10b981" />
                <span style={{ fontWeight: 600, color: "#1a1a1a", fontSize: 15 }}>{docMode === "devis" ? "Devis généré" : "Facture générée"} — {invoice.invoiceNumber}</span>
              </div>
              <button
                onClick={downloadPDF}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 10, border: "none", background: "#10b981", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }}
              >
                <Download size={14} /> Télécharger PDF
              </button>
            </div>

            {/* Invoice preview content */}
            <div style={{ padding: "24px" }}>
              {/* Company + client row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Émetteur</p>
                  {company?.logo && <img src={company.logo} alt="Logo" style={{ height: 36, objectFit: "contain", marginBottom: 6 }} />}
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{company?.companyName || "Votre Entreprise"}</p>
                  <p style={{ fontSize: 12, color: "#666", margin: "2px 0 0" }}>{company?.city}{company?.country ? `, ${company.country}` : ""}</p>
                  {company?.email && <p style={{ fontSize: 12, color: "#666", margin: "1px 0 0" }}>{company.email}</p>}
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Client</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{invoice.client.name || "—"}</p>
                  {invoice.client.address && <p style={{ fontSize: 12, color: "#666", margin: "2px 0 0" }}>{invoice.client.address}</p>}
                  {invoice.client.email && <p style={{ fontSize: 12, color: "#666", margin: "1px 0 0" }}>{invoice.client.email}</p>}
                </div>
              </div>

              {/* Meta */}
              <div style={{ display: "flex", gap: 24, marginBottom: 20, padding: "12px 16px", background: "#f9fafb", borderRadius: 10 }}>
                <div><p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>N° Facture</p><p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{invoice.invoiceNumber}</p></div>
                <div><p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>Date</p><p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{invoice.date}</p></div>
                <div><p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>Échéance</p><p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{invoice.dueDate}</p></div>
              </div>

              {/* Items table */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 16 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e8e8e8" }}>
                    {["Description", "Qté", "Prix unitaire", "Total"].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: h === "Description" ? "left" : "right", color: "#888", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td style={{ padding: "10px 10px", color: "#1a1a1a" }}>{item.description}</td>
                      <td style={{ padding: "10px 10px", textAlign: "right", color: "#555" }}>{item.qty}</td>
                      <td style={{ padding: "10px 10px", textAlign: "right", color: "#555" }}>{fmt(item.unitPrice, invoice.currency)}</td>
                      <td style={{ padding: "10px 10px", textAlign: "right", fontWeight: 600, color: "#1a1a1a" }}>{fmt(item.total, invoice.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ minWidth: 260 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#555" }}>
                    <span>Sous-total HT</span><span>{fmt(invoice.subtotal, invoice.currency)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#555" }}>
                    <span>TVA ({invoice.tvaRate}%)</span><span>{fmt(invoice.tva, invoice.currency)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", marginTop: 6, background: "#f0f9f6", borderRadius: 8, fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>
                    <span>Total TTC</span><span style={{ color: "#10b981" }}>{fmt(invoice.total, invoice.currency)}</span>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <p style={{ marginTop: 16, fontSize: 12, color: "#888", fontStyle: "italic" }}>Note : {invoice.notes}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Génère le HTML de la facture pour impression/PDF ── */
function buildInvoiceHTML(inv: InvoiceData, company: Company | null): string {
  const cur = inv.currency || "FCFA";
  const fmt = (n: number) => (Number(n) || 0).toLocaleString("fr-FR") + " " + cur;
  const logo = company?.logo ? `<img src="${company.logo}" style="height:60px;object-fit:contain;max-width:200px;" />` : "";

  const rows = inv.items.map((it) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${it.description}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${it.qty}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">${fmt(it.unitPrice)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">${fmt(it.total)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/>
<title>Facture ${inv.invoiceNumber}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;color:#1a1a1a;background:#fff;padding:40px;font-size:13px}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:24px;border-bottom:3px solid #10b981}
  .company-name{font-size:22px;font-weight:700;color:#1a1a1a;margin-top:8px}
  .company-info{font-size:11px;color:#666;line-height:1.8;margin-top:4px}
  .invoice-title{font-size:28px;font-weight:300;color:#10b981;text-align:right}
  .invoice-meta{font-size:12px;color:#888;text-align:right;margin-top:6px;line-height:1.8}
  .section{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-bottom:30px}
  .section-label{font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
  .section-name{font-size:15px;font-weight:700}
  .section-detail{font-size:12px;color:#666;margin-top:3px}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  th{padding:10px 12px;background:#f9fafb;text-align:left;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid #e8e8e8}
  th.right{text-align:right}
  .totals{display:flex;justify-content:flex-end;margin-top:10px}
  .totals-box{width:280px}
  .total-row{display:flex;justify-content:space-between;padding:7px 0;font-size:13px;color:#555;border-bottom:1px solid #f5f5f5}
  .total-final{display:flex;justify-content:space-between;padding:12px 16px;background:#f0f9f6;border-radius:8px;font-size:16px;font-weight:700;margin-top:10px}
  .total-final span:last-child{color:#10b981}
  .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e8e8e8;text-align:center;font-size:11px;color:#aaa;line-height:1.8}
  @media print{body{padding:20px}.no-print{display:none!important}}
</style></head><body>
<div class="header">
  <div>
    ${logo}
    <div class="company-name">${company?.companyName || "Votre Entreprise"}</div>
    <div class="company-info">
      ${company?.city || ""}${company?.country ? `, ${company.country}` : ""}<br/>
      ${company?.email ? `${company.email}` : ""}${company?.phone ? ` · ${company.phone}` : ""}
    </div>
  </div>
  <div>
    <div class="invoice-title">FACTURE</div>
    <div class="invoice-meta">
      N° ${inv.invoiceNumber}<br/>
      Date : ${inv.date}<br/>
      Échéance : ${inv.dueDate}
    </div>
  </div>
</div>

<div class="section">
  <div>
    <div class="section-label">Facturé à</div>
    <div class="section-name">${inv.client.name || "—"}</div>
    ${inv.client.address ? `<div class="section-detail">${inv.client.address}</div>` : ""}
    ${inv.client.email ? `<div class="section-detail">${inv.client.email}</div>` : ""}
    ${inv.client.phone ? `<div class="section-detail">${inv.client.phone}</div>` : ""}
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Description</th>
      <th class="right" style="text-align:center">Qté</th>
      <th class="right">Prix unitaire</th>
      <th class="right">Total</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>

<div class="totals">
  <div class="totals-box">
    <div class="total-row"><span>Sous-total HT</span><span>${fmt(inv.subtotal)}</span></div>
    <div class="total-row"><span>TVA (${inv.tvaRate}%)</span><span>${fmt(inv.tva)}</span></div>
    <div class="total-final"><span>TOTAL TTC</span><span>${fmt(inv.total)}</span></div>
  </div>
</div>

${inv.notes ? `<p style="margin-top:24px;font-size:12px;color:#888;font-style:italic">Note : ${inv.notes}</p>` : ""}

<div class="footer">
  <strong>${company?.companyName || ""}</strong>${company?.city ? ` · ${company.city}` : ""}${company?.country ? `, ${company.country}` : ""}<br/>
  ${company?.email || ""} ${company?.phone ? `· ${company.phone}` : ""}
</div>
</body></html>`;
}
