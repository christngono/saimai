"use client";

import { Plus, Trash2, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

const T = "#C2562C";

function LogoMark({ size = 24 }: { size?: number }) {
  const rects: [number, number][] = [
    [20,30],[64,30],[108,30],[152,30],[196,30],
    [20,74],
    [20,118],[64,118],[108,118],[196,118],
    [196,162],
    [20,206],[64,206],[108,206],[152,206],[196,206],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 232 250" fill="none">
      {rects.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="36" height="36" rx="7" fill={T} />
      ))}
    </svg>
  );
}
import { Conversation } from "@/lib/types";

export interface Task {
  id: string;
  icon: string;
  label: string;
}

export const TASKS: Task[] = [
  { id: "fiscal",     icon: "🧾", label: "Fiscalité" },
  { id: "facture",    icon: "📃", label: "Factures & Devis" },
  { id: "accounting", icon: "💼", label: "Comptabilité" },
  { id: "hr",         icon: "👥", label: "Ressources humaines" },
  { id: "marketing",  icon: "📣", label: "Marketing & contenus" },
  { id: "projects",   icon: "🗂️", label: "Gestion de projets" },
  { id: "formations", icon: "📚", label: "Mes formations" },
  { id: "files",      icon: "📁", label: "Mes fichiers" },
  { id: "reports",    icon: "📄", label: "Rapports & synthèses" },
  { id: "payment",    icon: "💳", label: "Paiement" },
  { id: "commercial", icon: "📦", label: "Commercial" },
];

interface Props {
  activeTask: string;
  onSelectTask: (id: string) => void;
  conversations: Conversation[];
  activeConvId: string | null;
  onSelectConv: (id: string) => void;
  onNewConv: () => void;
  onDeleteConv: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export default function TaskSidebar({
  activeTask, onSelectTask,
  conversations, activeConvId, onSelectConv, onNewConv, onDeleteConv,
  collapsed, onToggle,
}: Props) {
  return (
    <aside
      style={{
        width: collapsed ? 60 : 240,
        minWidth: collapsed ? 60 : 240,
        height: "100%",
        background: "#fff",
        borderRight: "1px solid #e8e8e8",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.25s ease, min-width 0.25s ease",
        overflow: "hidden",
      }}
    >
      {/* Logo + toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "12px 14px",
          minHeight: 56,
          borderBottom: "1px solid #f0f0f0",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LogoMark size={22} />
            <span style={{ fontWeight: 900, fontSize: 16, color: "#1F1410", letterSpacing: "-0.03em" }}>
              saim<span style={{ color: T }}>AI</span>
            </span>
          </div>
        )}
        {collapsed && <LogoMark size={24} />}
        {!collapsed ? (
          <button onClick={onToggle} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#999", padding: 4 }}>
            <ChevronLeft size={16} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            style={{ position: "absolute", right: -11, top: 20, width: 22, height: 22, borderRadius: "50%", border: "1px solid #e8e8e8", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", zIndex: 10 }}
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* Task list */}
      <div style={{ padding: "8px", flexShrink: 0, overflowY: "auto" }}>
        {!collapsed && (
          <p style={{ fontSize: 10, fontWeight: 600, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 8px 6px", margin: 0 }}>
            Modules
          </p>
        )}
        {TASKS.map((task) => {
          const active = activeTask === task.id;
          return (
            <button
              key={task.id}
              onClick={() => onSelectTask(task.id)}
              title={collapsed ? task.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: collapsed ? 0 : 10,
                justifyContent: collapsed ? "center" : "flex-start",
                width: "100%",
                padding: collapsed ? "10px 0" : "9px 10px",
                borderRadius: 10,
                border: "none",
                background: active ? "#f0f9f6" : "transparent",
                cursor: "pointer",
                marginBottom: 2,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <span style={{ fontSize: 15, lineHeight: 1 }}>{task.icon}</span>
              {!collapsed && (
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#C2562C" : "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {task.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: "#f0f0f0", margin: "4px 12px", flexShrink: 0 }} />

      {/* Conversation history (fiscal only) */}
      {activeTask === "fiscal" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!collapsed && (
            <div style={{ padding: "8px 12px 4px", flexShrink: 0 }}>
              <button
                onClick={onNewConv}
                style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "8px 10px", borderRadius: 10, border: "1px dashed #e0e0e0", background: "transparent", color: "#666", fontSize: 12, cursor: "pointer", marginBottom: 6, transition: "all 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f5"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <Plus size={13} /> Nouvelle conversation
              </button>
              {conversations.length > 0 && (
                <p style={{ fontSize: 10, fontWeight: 600, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 2px 4px", margin: 0 }}>
                  Historique
                </p>
              )}
            </div>
          )}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 8px" }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectConv(conv.id)}
                style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 8, justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "10px 0" : "8px 10px", borderRadius: 8, cursor: "pointer", background: activeConvId === conv.id ? "#f0f9f6" : "transparent", marginBottom: 1, position: "relative", transition: "background 0.1s" }}
                onMouseEnter={(e) => { if (activeConvId !== conv.id) (e.currentTarget as HTMLDivElement).style.background = "#f5f5f5"; }}
                onMouseLeave={(e) => { if (activeConvId !== conv.id) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <MessageSquare size={13} style={{ color: "#bbb", flexShrink: 0 }} />
                {!collapsed && (
                  <>
                    <span style={{ flex: 1, fontSize: 12, color: activeConvId === conv.id ? "#C2562C" : "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {conv.title}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteConv(conv.id); }}
                      className="conv-del"
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ccc", padding: 2, opacity: 0, transition: "opacity 0.15s" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`div:hover > .conv-del { opacity: 1 !important; }`}</style>
    </aside>
  );
}
