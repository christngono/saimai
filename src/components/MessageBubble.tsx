"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Message } from "@/lib/types";

const MarkdownRenderer = dynamic(() => import("./MarkdownRenderer"), { ssr: false });

interface Props {
  message: Message;
}

function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: "white",
        color: "#6b7280",
        fontSize: 12,
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
        (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "white";
        (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
      }}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copié !
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

function SpeakButton({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stripMarkdown = (md: string) =>
    md
      .replace(/#{1,6}\s+/g, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .replace(/^[-*]\s+/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      .replace(/\n{2,}/g, ". ")
      .trim();

  const handleSpeak = () => {
    if (!supported) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(stripMarkdown(text));
    utterance.lang = "fr-FR";
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith("fr"));
    if (frVoice) utterance.voice = frVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  if (!supported) return null;

  return (
    <button
      onClick={handleSpeak}
      title={isSpeaking ? "Arrêter" : "Écouter la réponse"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 8,
        border: isSpeaking ? "1px solid #10b981" : "1px solid #e5e7eb",
        background: isSpeaking ? "#ecfdf5" : "white",
        color: isSpeaking ? "#10b981" : "#6b7280",
        fontSize: 12,
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!isSpeaking) {
          (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
          (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSpeaking) {
          (e.currentTarget as HTMLButtonElement).style.background = "white";
          (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
        }
      }}
    >
      {isSpeaking ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          Arrêter
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
          Écouter
        </>
      )}
    </button>
  );
}

function ShareButton({ text }: { text: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <button
      onClick={handleShare}
      title="Partager"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: "white",
        color: "#6b7280",
        fontSize: 12,
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
        (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "white";
        (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      Partager
    </button>
  );
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const [showActions, setShowActions] = useState(false);

  if (isUser) {
    return (
      <div
        className="message-appear"
        style={{ padding: "20px 0 4px 0", display: "flex", flexDirection: "column", alignItems: "flex-end" }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Bulle utilisateur style Gemini */}
        <div
          style={{
            background: "#f0f4f9",
            borderRadius: 20,
            padding: "14px 20px",
            maxWidth: "80%",
            fontSize: 16,
            fontWeight: 400,
            color: "#1a1a1a",
            lineHeight: 1.5,
          }}
        >
          {message.content}
        </div>

        {/* Actions — copier la question */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 6,
            opacity: showActions ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        >
          <CopyButton text={message.content} label="Copier la question" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="message-appear"
      style={{ padding: "8px 0 24px 0" }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Logo SAIM */}
      <div style={{ marginBottom: 16 }}>
        <Image
          src="/saim-logo-officiel.png"
          alt="SAIM Conseil"
          width={80}
          height={28}
          style={{ objectFit: "contain", objectPosition: "left" }}
        />
      </div>

      {/* Contenu markdown pleine largeur */}
      <div style={{ color: "#1a1a1a", fontSize: 16, lineHeight: 1.75 }}>
        <MarkdownRenderer>{message.content}</MarkdownRenderer>
      </div>

      {/* Sources */}
      {message.sources && message.sources.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {message.sources.map((src, i) => (
            <span
              key={i}
              style={{
                background: "#f3f4f6",
                color: "#6b7280",
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
              }}
            >
              📄 {src.replace("CGI-2025/cgi2025-", "CGI-2025 p.").replace(".jpg", "").replace(".pdf", "")}
            </span>
          ))}
        </div>
      )}

      {/* Actions — visibles au survol */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 12,
          opacity: showActions ? 1 : 0,
          transition: "opacity 0.15s",
        }}
      >
        <CopyButton text={message.content} label="Copier" />
        <SpeakButton text={message.content} />
        <ShareButton text={message.content} />
      </div>

      {/* Timestamp + séparateur */}
      <div style={{ marginTop: 8, color: "#bbb", fontSize: 11 }}>
        {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div style={{ marginTop: 16, height: 1, background: "#f0f0f0" }} />
    </div>
  );
}
