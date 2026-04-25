"use client";

type Mode = "chat" | "recorder";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  accent: string;
  onClick: () => void;
}

function ModeCard({ icon, title, description, buttonLabel, accent, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: "1 1 300px",
        maxWidth: 340,
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 32,
        cursor: "pointer",
        transition: "box-shadow 0.2s, border-color 0.2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
        (e.currentTarget as HTMLDivElement).style.borderColor = accent;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
      }}
    >
      {/* Icône */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          background: accent + "18",
          color: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>

      {/* Texte */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px 0" }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
          {description}
        </p>
      </div>

      {/* Bouton */}
      <button
        style={{
          marginTop: "auto",
          width: "100%",
          padding: "12px 0",
          borderRadius: 10,
          border: "none",
          background: accent,
          color: "white",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default function ModeSelector({ onSelect }: { onSelect: (mode: Mode) => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#10b981",
              color: "white",
              fontWeight: 700,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            SC
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>SAIM Conseil</span>
        </div>
        <p style={{ color: "#6b7280", fontSize: 16, margin: 0 }}>
          L'intelligence fiscale à portée de main
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: 760,
        }}
      >
        <ModeCard
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
          title="Assistant Fiscal"
          description="Posez vos questions sur la fiscalité camerounaise, calculez vos impôts, comprenez vos obligations."
          buttonLabel="Démarrer la conversation"
          accent="#10b981"
          onClick={() => onSelect("chat")}
        />

        <ModeCard
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          }
          title="Transcription de Réunion"
          description="Enregistrez votre réunion en direct, obtenez la transcription complète et un résumé des points fiscaux clés."
          buttonLabel="Démarrer l'enregistrement"
          accent="#3b82f6"
          onClick={() => onSelect("recorder")}
        />
      </div>
    </div>
  );
}
