"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Paperclip, Monitor, Hash, Mic, MicOff, Send } from "lucide-react";

/* ─── Icônes chips SVG ─── */
function TaxSvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}
function TVASvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}
function MarketingSvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z"/>
    </svg>
  );
}
function FactureSvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16l3-3 3 3 3-3 3 3 3-3V4a2 2 0 0 0-2-2z"/>
      <line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="13" y2="13"/>
    </svg>
  );
}
function SmileSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  );
}

const CHIPS = [
  { icon: <TaxSvg />,       label: "Calculer mon impôts" },
  { icon: <TVASvg />,       label: "Déclaration TVA" },
  { icon: <MarketingSvg />, label: "Création d'une campagne marketing" },
  { icon: <FactureSvg />,   label: "Générer une facture ou devis" },
];

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 32, height: 32, borderRadius: 8,
        background: "transparent", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#9C9A96",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#F5F3EF")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </button>
  );
}

export default function WelcomeScreen({ onSend, loading }: Props) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported(!!SR);
  }, []);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const startRecording = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    transcriptRef.current = "";
    const rec = new SR();
    rec.lang = "fr-FR"; rec.continuous = false; rec.interimResults = true;
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e: any) => {
      let final = ""; let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else interim += t;
      }
      transcriptRef.current = final || transcriptRef.current;
      setInput(final || interim);
    };
    rec.onend = () => {
      setIsRecording(false);
      const f = transcriptRef.current.trim();
      if (f) { setInput(""); onSend(f); transcriptRef.current = ""; }
    };
    rec.onerror = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const stopRecording = () => recognitionRef.current?.stop();

  const canSend = input.trim().length > 0 && !loading;

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px", background: "#FBFAF7",
    }}>

      {/* Titre principal */}
      <h1 style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: "clamp(32px, 5vw, 52px)",
        fontWeight: 400, color: "#141413",
        letterSpacing: "-0.025em", lineHeight: 1.15,
        textAlign: "center" as const,
        margin: "0 0 40px",
      }}>
        Que puis-je faire pour vous ?
      </h1>

      {/* Champ prompt */}
      <div style={{ width: "100%", maxWidth: 720 }}>
        <div style={{
          background: "#ffffff",
          border: `1.5px solid ${isRecording ? "#ef4444" : "#D9D8D5"}`,
          borderRadius: 20,
          boxShadow: isRecording
            ? "0 0 0 3px rgba(239,68,68,0.08)"
            : "0 2px 16px rgba(20,20,19,0.07)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          overflow: "hidden",
        }}>
          {/* Enregistrement en cours */}
          {isRecording && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px 0", background: "#fef2f2", borderBottom: "1px solid #fecaca" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "pulse 1s infinite" }}/>
              <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>Écoute en cours… parlez maintenant</span>
            </div>
          )}

          {/* Textarea */}
          <div style={{ padding: "18px 20px 10px" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              onInput={handleInput}
              rows={3}
              placeholder={isRecording ? "Parlez, je vous écoute…" : "Attribuez une tâche ou posez une question"}
              disabled={loading}
              style={{
                width: "100%", border: "none", outline: "none",
                background: "transparent", resize: "none",
                fontSize: 15, color: "#141413",
                lineHeight: 1.6, minHeight: 72, maxHeight: 200,
                fontFamily: "'Inter Tight', system-ui, sans-serif",
              }}
            />
          </div>

          {/* Toolbar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 14px 14px",
            borderTop: "1px solid #F0EEE9",
          }}>
            {/* Gauche */}
            <div style={{ display: "flex", gap: 2 }}>
              <IconBtn><Paperclip size={16} /></IconBtn>
              <IconBtn><Hash size={16} /></IconBtn>
              <IconBtn><Monitor size={16} /></IconBtn>
            </div>

            {/* Droite */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <IconBtn><SmileSvg /></IconBtn>
              {voiceSupported && (
                <IconBtn onClick={isRecording ? stopRecording : startRecording}>
                  {isRecording ? <MicOff size={16} color="#ef4444" /> : <Mic size={16} />}
                </IconBtn>
              )}
              <button
                onClick={handleSend}
                disabled={!canSend}
                style={{
                  width: 36, height: 36, borderRadius: 999,
                  background: canSend ? "#141413" : "#D9D8D5",
                  border: "none",
                  cursor: canSend ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                  flexShrink: 0,
                }}
              >
                {loading
                  ? <Loader2 size={15} color="#FBFAF7" style={{ animation: "spin 1s linear infinite" }} />
                  : <Send size={14} color="#FBFAF7" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Chips suggestions */}
        <div style={{
          display: "flex", flexWrap: "wrap" as const, gap: 10,
          marginTop: 20, justifyContent: "center",
        }}>
          {CHIPS.map((chip, i) => (
            <button
              key={i}
              onClick={() => onSend(chip.label)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 18px", borderRadius: 999,
                border: "1px solid #D9D8D5", background: "#ffffff",
                color: "#141413", fontSize: 13.5, cursor: "pointer",
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontWeight: 500, transition: "background 0.12s, border-color 0.12s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#F5F3EF";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#C0BEB9";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#D9D8D5";
              }}
            >
              <span style={{ color: "#73726C" }}>{chip.icon}</span>
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
