"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { SAIM, SaimLogoH } from "@/components/SaimUI";
import { Conversation, Message } from "@/lib/types";

const ChatArea = dynamic(() => import("@/components/ChatArea"));

/* ─── Helpers ─── */
function generateId() { return Math.random().toString(36).slice(2, 10); }
function titleFromMessage(msg: string) { return msg.length > 42 ? msg.slice(0, 42) + "…" : msg; }

/* ─── Agents ─── */
const AGENTS = [
  { id: "fiscal",    name: "SAIM Fiscal",     icon: "📊", desc: "CGI 2025 · LF 2026",        live: true },
  { id: "marketing", name: "SAIM Marketing",  icon: "📣", desc: "Contenu · Réseaux",          live: false },
  { id: "rh",        name: "SAIM RH",         icon: "👥", desc: "Contrats · CNPS",            live: false },
  { id: "commercial",name: "SAIM Commercial", icon: "🤝", desc: "Prospects · Pipeline",       live: false },
  { id: "juridique", name: "SAIM Juridique",  icon: "⚖️", desc: "OHADA · CEMAC",              live: false },
  { id: "documents", name: "SAIM Documents",  icon: "📄", desc: "PDF · Audio · Résumé",       live: false },
];

const SOURCES = ["CGI 2025 (1 004 p.)", "LF 2026", "Circulaires DGI", "Guide Fiscalis"];

/* ─── Coming soon ─── */
function ComingSoon({ agent }: { agent: typeof AGENTS[0] }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: SAIM.paper }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: SAIM.paperAlt, border: `1px solid ${SAIM.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{agent.icon}</div>
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 400, color: SAIM.ink }}>{agent.name}</div>
      <p style={{ fontSize: 15, color: SAIM.muted, maxWidth: 380, textAlign: "center", lineHeight: 1.6 }}>
        Cet agent est en cours de développement. Seul <strong>SAIM Fiscal</strong> est actif pour le moment.
      </p>
      <div style={{ padding: "6px 16px", borderRadius: 999, background: SAIM.paperAlt, border: `1px solid ${SAIM.border}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: SAIM.faint }}>Bientôt disponible</div>
    </div>
  );
}

/* ─── Dashboard principal ─── */
export default function Dashboard() {
  const [activeAgent, setActiveAgent] = useState("fiscal");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const activeConversation = conversations.find(c => c.id === activeConvId) ?? null;
  const active = AGENTS.find(a => a.id === activeAgent)!;

  const sendMessage = useCallback(async (content: string) => {
    let convId = activeConvId;
    if (!convId) {
      convId = generateId();
      setConversations(prev => [{ id: convId!, title: titleFromMessage(content), messages: [], createdAt: new Date() }, ...prev]);
      setActiveConvId(convId);
    }
    const userMsg: Message = { id: generateId(), role: "user", content, timestamp: new Date() };
    const currentMessages = conversations.find(c => c.id === convId)?.messages ?? [];

    setConversations(prev => prev.map(c =>
      c.id === convId
        ? { ...c, title: c.messages.length === 0 ? titleFromMessage(content) : c.title, messages: [...c.messages, userMsg] }
        : c
    ));
    setLoading(true);
    setStreamingText("");

    try {
      const history = [...currentMessages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      let sources: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const metaMatch = full.match(/__META__(.+?)__META__/);
        if (metaMatch) {
          try { const meta = JSON.parse(metaMatch[1]); if (meta.type === "sources") sources = meta.data; } catch {}
          full = full.replace(/__META__.+?__META__/, "");
        }
        setStreamingText(full);
      }

      setConversations(prev => prev.map(c =>
        c.id === convId
          ? { ...c, messages: [...c.messages, { id: generateId(), role: "assistant" as const, content: full.trim(), timestamp: new Date(), sources: sources.length > 0 ? sources : undefined }] }
          : c
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setStreamingText("");
    }
  }, [activeConvId, conversations]);

  /* Sources actives depuis la dernière réponse */
  const lastSources = activeConversation?.messages.filter(m => m.role === "assistant").at(-1)?.sources ?? [];
  const displayedSources = lastSources.length > 0 ? lastSources : (activeAgent === "fiscal" ? SOURCES : []);

  /* Titres des conversations récentes */
  const recentConvs = conversations.slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: SAIM.paper, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>

      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: SAIM.paperHi, borderBottom: `1px solid ${SAIM.border}`, flexShrink: 0 }}>
        <SaimLogoH size={24} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: SAIM.muted }}>FR</span>
          <div style={{ width: 32, height: 32, borderRadius: 999, background: SAIM.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', Georgia, serif", fontSize: 14, color: SAIM.accentDark, fontWeight: 500 }}>AI</div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* ── Sidebar agents ── */}
        <div style={{ width: 260, background: SAIM.paperAlt, borderRight: `1px solid ${SAIM.border}`, display: "flex", flexDirection: "column", padding: "16px 12px", flexShrink: 0 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.muted, padding: "8px 12px", marginBottom: 8 }}>Agents disponibles</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {AGENTS.map(a => (
              <div key={a.id} onClick={() => setActiveAgent(a.id)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                background: a.id === activeAgent ? SAIM.accentSoft : "transparent",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => { if (a.id !== activeAgent) (e.currentTarget as HTMLDivElement).style.background = SAIM.paperHi; }}
                onMouseLeave={e => { if (a.id !== activeAgent) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: a.id === activeAgent ? 600 : 400, color: a.id === activeAgent ? SAIM.accentDark : SAIM.ink }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: SAIM.faint, marginTop: 1 }}>{a.desc}</div>
                </div>
                {a.id === activeAgent && <div style={{ width: 6, height: 6, borderRadius: 999, background: SAIM.accent, flexShrink: 0 }} />}
                {!a.live && a.id !== activeAgent && <div style={{ width: 6, height: 6, borderRadius: 999, background: SAIM.border, flexShrink: 0 }} />}
              </div>
            ))}
          </div>

          {/* Plan badge */}
          <div style={{ background: SAIM.paperHi, border: `1px solid ${SAIM.border}`, borderRadius: 12, padding: 16, marginTop: 12 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 6 }}>Plan Starter</div>
            <div style={{ fontSize: 12, color: SAIM.muted }}>10 questions gratuites/jour</div>
            <div style={{ height: 4, background: SAIM.border, borderRadius: 2, marginTop: 8 }}>
              <div style={{ width: "40%", height: "100%", background: SAIM.accent, borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* ── Zone principale ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {activeAgent === "fiscal" ? (
            <ChatArea
              conversation={activeConversation}
              loading={loading}
              streamingText={streamingText}
              onSend={sendMessage}
              onToggleSidebar={() => {}}
            />
          ) : (
            <ComingSoon agent={active} />
          )}
        </div>

        {/* ── Panneau droit — contexte ── */}
        <div style={{ width: 240, background: SAIM.paperAlt, borderLeft: `1px solid ${SAIM.border}`, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 24, flexShrink: 0, overflowY: "auto" }}>
          {activeAgent === "fiscal" && (
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.muted, marginBottom: 12 }}>Sources actives</div>
              {displayedSources.map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: SAIM.paperHi, border: `1px solid ${SAIM.border}`, marginBottom: 6, fontSize: 12, color: SAIM.inkSoft }}>
                  <span style={{ color: SAIM.accent, fontSize: 10 }}>●</span> {s}
                </div>
              ))}
            </div>
          )}

          {recentConvs.length > 0 && (
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.muted, marginBottom: 12 }}>Conversations récentes</div>
              {recentConvs.map(c => (
                <div key={c.id} onClick={() => setActiveConvId(c.id)} style={{
                  padding: "8px 10px", borderRadius: 8, fontSize: 12,
                  color: c.id === activeConvId ? SAIM.accentDark : SAIM.muted,
                  background: c.id === activeConvId ? SAIM.accentSoft : "transparent",
                  cursor: "pointer", marginBottom: 4,
                  whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
                }}>{c.title}</div>
              ))}
            </div>
          )}

          <div style={{ marginTop: "auto" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: SAIM.muted, marginBottom: 8 }}>Stack</div>
            <div style={{ fontSize: 11, color: SAIM.faint, lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
              LLaMA 3.3 70B<br />ChromaDB · nomic-embed<br />RAG · Groq API
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
