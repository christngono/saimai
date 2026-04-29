"use client";

import Image from "next/image";
import ChatInput from "./ChatInput";

const CHIPS = [
  { icon: "🧮", label: "Calculer mon impôt" },
  { icon: "📋", label: "Obligations fiscales" },
  { icon: "💰", label: "Optimiser ma fiscalité" },
  { icon: "📄", label: "Déclarer la TVA" },
  { icon: "❓", label: "Comprendre l'IS" },
];

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function WelcomeScreen({ onSend, loading }: Props) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        minHeight: 0,
        background: "#ffffff",
      }}
    >
      {/* Logo officiel */}
      <div style={{ marginBottom: 32 }}>
        <Image
          src="/saim-logo-officiel.png"
          alt="SAIM Conseil"
          width={160}
          height={56}
          style={{ objectFit: "contain", width: "auto" }}
          priority
        />
      </div>

      {/* Titre style Gemini */}
      <h1
        style={{
          fontSize: "clamp(26px, 4vw, 42px)",
          fontWeight: 400,
          color: "#1a1a1a",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          textAlign: "center",
          marginBottom: 40,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        Comment puis-je vous aider ?
      </h1>

      {/* Zone de saisie */}
      <div style={{ width: "100%", maxWidth: 700 }}>
        <div
          style={{
            borderRadius: 24,
            border: "1px solid #e0e0e0",
            background: "#f8f8f8",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <ChatInput onSend={onSend} loading={loading} welcome />
        </div>

        {/* Chips suggestions */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 16,
            justifyContent: "center",
          }}
        >
          {CHIPS.map((chip, i) => (
            <button
              key={i}
              onClick={() => onSend(chip.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid #e0e0e0",
                background: "#ffffff",
                color: "#444",
                fontSize: 13,
                cursor: "pointer",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#ccc";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#e0e0e0";
              }}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
