"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Message } from "@/lib/types";

const MarkdownRenderer = dynamic(() => import("./MarkdownRenderer"), { ssr: false });

interface Props {
  message: Message;
}

function ActionBtn({ onClick, title, children }: { onClick?: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "5px 10px", borderRadius: 8,
        border: "1px solid #D9D8D5",
        background: "#FBFAF7", color: "#73726C",
        fontSize: 12, cursor: "pointer",
        transition: "background 0.12s, color 0.12s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "#F0EEE9";
        (e.currentTarget as HTMLButtonElement).style.color = "#141413";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "#FBFAF7";
        (e.currentTarget as HTMLButtonElement).style.color = "#73726C";
      }}
    >
      {children}
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <ActionBtn onClick={handle} title="Copier">
      {copied ? (
        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copié !</>
      ) : (
        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copier</>
      )}
    </ActionBtn>
  );
}

function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); };
  }, []);

  const strip = (md: string) => md
    .replace(/#{1,6}\s+/g, "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1").replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^[-*]\s+/gm, "").replace(/^\d+\.\s+/gm, "").replace(/\n{2,}/g, ". ").trim();

  const handle = () => {
    if (!supported) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(strip(text));
    u.lang = "fr-FR"; u.rate = 1.05;
    const v = window.speechSynthesis.getVoices().find(v => v.lang.startsWith("fr"));
    if (v) u.voice = v;
    u.onstart = () => setSpeaking(true);
    u.onend = u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  if (!supported) return null;
  return (
    <ActionBtn onClick={handle} title={speaking ? "Arrêter" : "Écouter"}>
      {speaking ? (
        <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> Arrêter</>
      ) : (
        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Écouter</>
      )}
    </ActionBtn>
  );
}

function ShareButton({ text }: { text: string }) {
  const handle = async () => {
    if (navigator.share) await navigator.share({ text });
    else await navigator.clipboard.writeText(text);
  };
  return (
    <ActionBtn onClick={handle} title="Partager">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      Partager
    </ActionBtn>
  );
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const [showActions, setShowActions] = useState(false);

  /* ── Message utilisateur ── */
  if (isUser) {
    return (
      <div
        className="message-appear"
        style={{ padding: "20px 0 4px", display: "flex", flexDirection: "column", alignItems: "flex-end" }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div style={{
          background: "#EDECEB",
          borderRadius: 20,
          padding: "14px 20px",
          maxWidth: "80%",
          fontSize: 16, fontWeight: 400,
          color: "#141413", lineHeight: 1.5,
        }}>
          {message.content}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 6, opacity: showActions ? 1 : 0, transition: "opacity 0.15s" }}>
          <CopyButton text={message.content} />
        </div>
      </div>
    );
  }

  /* ── Réponse IA ── */
  return (
    <div
      className="message-appear"
      style={{ padding: "8px 0 24px" }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Contenu markdown */}
      <div style={{ color: "#141413", fontSize: 16, lineHeight: 1.75 }}>
        <MarkdownRenderer>{message.content}</MarkdownRenderer>
      </div>

      {/* Sources */}
      {message.sources && message.sources.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {message.sources.map((src, i) => (
            <span key={i} style={{
              background: "rgba(20,20,19,0.05)", color: "#73726C",
              fontSize: 11, padding: "3px 10px", borderRadius: 999,
              border: "1px solid #D9D8D5",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: "middle" }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              {src.replace("CGI-2025/cgi2025-", "CGI-2025 p.").replace(".jpg", "").replace(".pdf", "")}
            </span>
          ))}
        </div>
      )}

      {/* Actions au survol */}
      <div style={{ display: "flex", gap: 6, marginTop: 12, opacity: showActions ? 1 : 0, transition: "opacity 0.15s" }}>
        <CopyButton text={message.content} />
        <SpeakButton text={message.content} />
        <ShareButton text={message.content} />
      </div>

      {/* Timestamp + séparateur */}
      <div style={{ marginTop: 8, color: "#A8A5A0", fontSize: 11 }}>
        {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div style={{ marginTop: 16, height: 1, background: "#E8E6E1" }} />
    </div>
  );
}
