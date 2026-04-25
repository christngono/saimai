"use client";

export default function ReunionRecorder({ onBack }: { onBack: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 32,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#3b82f618",
          color: "#3b82f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px 0" }}>
          Transcription de Réunion
        </h2>
        <p style={{ color: "#6b7280", fontSize: 15 }}>Fonctionnalité en cours de développement.</p>
      </div>
      <button
        onClick={onBack}
        style={{
          padding: "10px 24px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "white",
          color: "#374151",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        ← Retour à l'accueil
      </button>
    </div>
  );
}
