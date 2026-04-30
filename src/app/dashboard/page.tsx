"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SaimLogoH } from "@/components/SaimUI";
import { Conversation, Message } from "@/lib/types";
import { useAuth } from "@/lib/auth";

const ChatArea = dynamic(() => import("@/components/ChatArea"));

/* ─── Hook responsive ─── */
function useResponsive() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return {
    isMobile: width > 0 && width < 768,
    isTablet: width >= 768 && width < 1024,
    isSmall:  width > 0 && width < 1024,
  };
}

/* ─── Helpers ─── */
function generateId() { return Math.random().toString(36).slice(2, 10); }
function titleFromMessage(msg: string) { return msg.length > 44 ? msg.slice(0, 44) + "…" : msg; }

function estimateCredits(userText: string, aiText: string): number {
  const chars = userText.length + aiText.length;
  const tokens = Math.ceil(chars / 4);
  return Math.max(1, Math.ceil(tokens / 800));
}

/* ─── Agents ─── */
const AGENTS = [
  { id: "fiscal",     name: "SAIM Fiscal",     color: "#C2562C", live: true },
  { id: "marketing",  name: "SAIM Marketing",  color: "#6366f1", live: false },
  { id: "rh",         name: "SAIM RH",         color: "#0891b2", live: false },
  { id: "commercial", name: "SAIM Commercial", color: "#059669", live: false },
  { id: "juridique",  name: "SAIM Juridique",  color: "#7c3aed", live: false },
  { id: "documents",  name: "SAIM Documents",  color: "#d97706", live: false },
];

/* ─── Icônes sidebar ─── */
function EditSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function AgentSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M12 2a3 3 0 0 1 3 3v6H9V5a3 3 0 0 1 3-3z"/>
      <circle cx="9" cy="16" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function SearchSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function BookSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}
function FilterSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="9" y2="12"/><line x1="18" y1="18" x2="6" y2="18"/>
    </svg>
  );
}
function LightningSvg({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );
}
function MenuSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
    </svg>
  );
}
function CloseSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>
    </svg>
  );
}

const NAV = [
  { label: "Agent IA",     icon: <AgentSvg /> },
  { label: "Rechercher",   icon: <SearchSvg /> },
  { label: "Bibliothèque", icon: <BookSvg /> },
];

/* ─── Coming soon ─── */
function ComingSoon({ name, color }: { name: string; color: string }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "#FBFAF7", padding: "24px" }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
        </svg>
      </div>
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 400, color: "#141413", textAlign: "center" as const }}>{name}</div>
      <p style={{ fontSize: 14, color: "#73726C", maxWidth: 360, textAlign: "center" as const, lineHeight: 1.6 }}>
        Cet agent est en cours de développement. Seul <strong>SAIM Fiscal</strong> est disponible.
      </p>
      <span style={{ padding: "5px 14px", borderRadius: 999, background: "#FBFAF7", border: "1px solid #D9D8D5", fontSize: 11, color: "#73726C", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
        Bientôt disponible
      </span>
    </div>
  );
}

/* ─── Badge crédits ─── */
function CreditBadge({ credits }: { credits: number }) {
  const color  = credits <= 3 ? "#dc2626" : credits <= 8 ? "#ea580c" : "#73726C";
  const bg     = credits <= 3 ? "#fef2f2" : credits <= 8 ? "#fff7ed" : "rgba(20,20,19,0.05)";
  const border = credits <= 3 ? "#fecaca" : credits <= 8 ? "#fed7aa" : "#D9D8D5";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "5px 12px", borderRadius: 999,
      background: bg, border: `1px solid ${border}`,
      fontSize: 12.5, color, fontWeight: 500,
      fontFamily: "'Inter Tight', system-ui, sans-serif",
      whiteSpace: "nowrap" as const,
    }}>
      <LightningSvg />
      {credits} crédit{credits !== 1 ? "s" : ""}
    </div>
  );
}

/* ─── Contenu sidebar ─── */
function SidebarContent({
  activeAgent, setActiveAgent,
  conversations, activeConvId,
  setActiveConvId, onClose,
  userName, onLogout,
}: {
  activeAgent: string;
  setActiveAgent: (id: string) => void;
  conversations: Conversation[];
  activeConvId: string | null;
  setActiveConvId: (id: string | null) => void;
  onClose?: () => void;
  userName?: string;
  onLogout?: () => void;
}) {
  const pick = (fn: () => void) => { fn(); onClose?.(); };

  return (
    <>
      {/* Logo */}
      <div style={{ padding: "18px 20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <SaimLogoH size={24} dark={true} />
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#73726C", padding: 4 }}>
            <CloseSvg />
          </button>
        )}
      </div>

      {/* Nouvelle tâche */}
      <div style={{ padding: "0 12px 8px" }}>
        <button
          onClick={() => pick(() => setActiveConvId(null))}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "9px 14px", borderRadius: 10, cursor: "pointer",
            background: "transparent", border: "none", textAlign: "left" as const,
            fontSize: 14, fontWeight: 500, color: "#141413",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(20,20,19,0.05)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ color: "#73726C" }}><EditSvg /></span>
          Nouvelle tâche
        </button>
      </div>

      {/* Nav */}
      <div style={{ padding: "0 12px 4px", display: "flex", flexDirection: "column", gap: 1 }}>
        {NAV.map(item => (
          <button key={item.label} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "9px 14px", borderRadius: 10, cursor: "pointer",
            background: "transparent", border: "none", textAlign: "left" as const,
            fontSize: 14, color: "#141413",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(20,20,19,0.05)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ color: "#73726C" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ height: 1, background: "#D9D8D5", margin: "8px 16px" }} />

      {/* Agents */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px", marginBottom: 2 }}>
          <span style={{ fontSize: 12, color: "#73726C", fontWeight: 500 }}>Agents</span>
          <button style={{ background: "none", border: "none", color: "#73726C", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 0 }}>+</button>
        </div>

        {AGENTS.map(a => (
          <button key={a.id} onClick={() => pick(() => { setActiveAgent(a.id); setActiveConvId(null); })} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "7px 14px", borderRadius: 10, cursor: "pointer",
            background: a.id === activeAgent ? "rgba(20,20,19,0.07)" : "transparent",
            border: "none", textAlign: "left" as const,
          }}
            onMouseEnter={e => { if (a.id !== activeAgent) (e.currentTarget as HTMLButtonElement).style.background = "rgba(20,20,19,0.04)"; }}
            onMouseLeave={e => { if (a.id !== activeAgent) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, background: a.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
              </svg>
            </div>
            <span style={{ flex: 1, fontSize: 13, color: "#141413", fontWeight: a.id === activeAgent ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
              {a.name}
            </span>
            {!a.live && (
              <span style={{ fontSize: 10, color: "#73726C", background: "#EBEBEA", padding: "2px 7px", borderRadius: 999, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                bientôt
              </span>
            )}
          </button>
        ))}

        {/* Conversations récentes */}
        {conversations.length > 0 && (
          <>
            <div style={{ height: 1, background: "#D9D8D5", margin: "10px 4px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px", marginBottom: 2 }}>
              <span style={{ fontSize: 12, color: "#73726C", fontWeight: 500 }}>Toutes les tâches</span>
              <span style={{ color: "#73726C" }}><FilterSvg /></span>
            </div>
            {conversations.slice(0, 8).map(c => (
              <button key={c.id} onClick={() => pick(() => { setActiveConvId(c.id); setActiveAgent("fiscal"); })} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "7px 14px", borderRadius: 10, cursor: "pointer",
                background: c.id === activeConvId ? "rgba(20,20,19,0.07)" : "transparent",
                border: "none", textAlign: "left" as const,
              }}
                onMouseEnter={e => { if (c.id !== activeConvId) (e.currentTarget as HTMLButtonElement).style.background = "rgba(20,20,19,0.04)"; }}
                onMouseLeave={e => { if (c.id !== activeConvId) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <div style={{ width: 20, height: 20, borderRadius: 5, background: "#C2562C", flexShrink: 0, opacity: 0.85 }} />
                <span style={{ fontSize: 13, color: "#141413", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, flex: 1 }}>
                  {c.title}
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* User + Logout */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid #D9D8D5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 999, background: "#141413", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBFAF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#141413", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
            {userName || "Mon compte"}
          </span>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Se déconnecter"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#73726C", padding: 4, display: "flex", alignItems: "center", borderRadius: 6, flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(20,20,19,0.07)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Dashboard ─── */
export default function Dashboard() {
  const router                            = useRouter();
  const { user, loaded, logout, updateUser } = useAuth();

  const [activeAgent, setActiveAgent]     = useState("fiscal");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId]   = useState<string | null>(null);
  const [loading, setLoading]             = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [credits, setCredits]             = useState(20);
  const [sidebarOpen, setSidebarOpen]     = useState(false);

  const { isSmall } = useResponsive();

  /* Garde d'auth + init crédits */
  useEffect(() => {
    if (!loaded) return;
    if (!user) { router.replace("/auth"); return; }
    if (!user.setupDone) { router.replace("/auth"); return; }
    setCredits(user.credits);
  }, [loaded, user, router]);

  const activeConversation = conversations.find(c => c.id === activeConvId) ?? null;
  const active = AGENTS.find(a => a.id === activeAgent)!;

  const sendMessage = useCallback(async (content: string) => {
    if (credits <= 0) return;

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

      const reader  = res.body.getReader();
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

      const cost = estimateCredits(content, full.trim());
      setCredits(prev => Math.max(0, prev - cost));

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
  }, [activeConvId, conversations, credits]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#FBFAF7", fontFamily: "'Inter Tight', system-ui, sans-serif", overflow: "hidden" }}>

      {/* ── Sidebar desktop ── */}
      {!isSmall && (
        <aside style={{
          width: 256, flexShrink: 0,
          background: "#FBFAF7",
          borderRight: "1px solid #D9D8D5",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          <SidebarContent
            activeAgent={activeAgent} setActiveAgent={setActiveAgent}
            conversations={conversations} activeConvId={activeConvId}
            setActiveConvId={setActiveConvId}
          />
        </aside>
      )}

      {/* ── Sidebar mobile overlay ── */}
      {isSmall && sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed", inset: 0, background: "rgba(20,20,19,0.35)",
              zIndex: 199, backdropFilter: "blur(2px)",
            }}
          />
          {/* Drawer */}
          <aside style={{
            position: "fixed", top: 0, left: 0,
            width: 280, height: "100%",
            background: "#FBFAF7",
            borderRight: "1px solid #D9D8D5",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            zIndex: 200,
            boxShadow: "4px 0 24px rgba(20,20,19,0.12)",
          }}>
            <SidebarContent
              activeAgent={activeAgent} setActiveAgent={setActiveAgent}
              conversations={conversations} activeConvId={activeConvId}
              setActiveConvId={setActiveConvId}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </>
      )}

      {/* ── Main ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#FBFAF7" }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center",
          padding: isSmall ? "10px 16px" : "10px 24px",
          flexShrink: 0,
          borderBottom: "1px solid #D9D8D5",
          position: "relative" as const,
          gap: 10,
        }}>
          {/* Mobile: hamburger + logo */}
          {isSmall ? (
            <>
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#141413", padding: 4, display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                <MenuSvg />
              </button>
              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <SaimLogoH size={22} dark={true} />
              </div>
            </>
          ) : (
            /* Desktop: plan badges centred */
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 4, background: "rgba(20,20,19,0.05)", borderRadius: 999, padding: 4 }}>
                <span style={{ padding: "4px 14px", borderRadius: 999, fontSize: 13, color: "#73726C" }}>Plan gratuit</span>
                <Link href="/#tarifs" style={{
                  padding: "4px 14px", borderRadius: 999, fontSize: 13,
                  background: "#141413", color: "#FBFAF7",
                  textDecoration: "none", fontWeight: 500,
                }}>
                  Mise à niveau
                </Link>
              </div>
            </div>
          )}

          {/* Crédits + avatar (toujours à droite) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <CreditBadge credits={credits} />
            <div title="Mon compte" style={{
              width: 32, height: 32, borderRadius: 999, background: "#141413",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FBFAF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Alerte zéro crédit */}
        {credits === 0 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            padding: "10px 16px", background: "#fef2f2", borderBottom: "1px solid #fecaca",
            fontSize: 13, color: "#dc2626", flexWrap: "wrap" as const,
          }}>
            <LightningSvg />
            <span>Vous n'avez plus de crédits. <a href="/#tarifs" style={{ color: "#dc2626", fontWeight: 600, textDecoration: "underline" }}>Passer au plan Pro</a> pour continuer.</span>
          </div>
        )}

        {/* Contenu */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {activeAgent !== "fiscal" ? (
            <ComingSoon name={active.name} color={active.color} />
          ) : (
            <ChatArea
              conversation={activeConversation}
              loading={loading}
              streamingText={streamingText}
              onSend={sendMessage}
              onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
