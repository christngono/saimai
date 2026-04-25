"use client";

import Image from "next/image";
import { Plus, Search, BookOpen, Cpu, LayoutGrid, Trash2, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Conversation } from "@/lib/types";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  collapsed: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onToggle: () => void;
}

export default function Sidebar({
  conversations,
  activeId,
  collapsed,
  onSelect,
  onNew,
  onDelete,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full relative select-none"
      style={{
        width: collapsed ? "60px" : "260px",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        flexShrink: 0,
        transition: "width 0.25s ease",
      }}
    >
      {/* Top: logo + toggle */}
      <div className="flex items-center justify-between px-4 py-4" style={{ minHeight: 56 }}>
        {!collapsed && (
          <Image
            src="/saim-logo-officiel.png"
            alt="SAIM Conseil"
            width={100}
            height={32}
            style={{ objectFit: "contain", objectPosition: "left" }}
          />
        )}
        {collapsed && (
          <Image
            src="/saim-logo-officiel.png"
            alt="SC"
            width={28}
            height={28}
            style={{ objectFit: "contain", margin: "0 auto" }}
          />
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sidebar-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ChevronLeft size={16} />
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-5 flex items-center justify-center w-6 h-6 rounded-full border cursor-pointer z-10"
            style={{ background: "var(--sidebar-bg)", borderColor: "var(--sidebar-border)", color: "var(--text-muted)" }}
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* New task button */}
      <div className="px-3 pb-2">
        <button
          onClick={onNew}
          className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer"
          style={{
            background: "var(--sidebar-hover)",
            color: "var(--sidebar-text)",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sidebar-active)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--sidebar-hover)")}
        >
          <Plus size={16} />
          {!collapsed && <span>Nouvelle conversation</span>}
        </button>
      </div>

      {/* Nav items */}
      <nav className="px-3 pb-3 space-y-0.5">
        <NavItem icon={<Cpu size={16} />} label="Agent" tag="Nouveau" collapsed={collapsed} />
        <NavItem icon={<Search size={16} />} label="Rechercher" collapsed={collapsed} />
        <NavItem icon={<BookOpen size={16} />} label="Bibliothèque" collapsed={collapsed} />
      </nav>

      <div style={{ height: 1, background: "var(--sidebar-border)", margin: "0 12px 12px" }} />

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3">
        {!collapsed && conversations.length > 0 && (
          <div
            className="flex items-center justify-between px-2 pb-1.5"
          >
            <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
              Toutes les tâches
            </span>
            <LayoutGrid size={13} style={{ color: "var(--text-muted)" }} />
          </div>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="group flex items-center gap-2 rounded-xl px-3 py-2 mb-0.5 cursor-pointer transition-all duration-150"
            style={{
              background: activeId === conv.id ? "var(--sidebar-active)" : "transparent",
              color: "var(--sidebar-text)",
            }}
            onClick={() => onSelect(conv.id)}
            onMouseEnter={(e) => {
              if (activeId !== conv.id)
                (e.currentTarget as HTMLDivElement).style.background = "var(--sidebar-hover)";
            }}
            onMouseLeave={(e) => {
              if (activeId !== conv.id)
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            <MessageSquare size={14} className="flex-shrink-0" style={{ color: "var(--text-muted)" }} />
            {!collapsed && (
              <>
                <span className="flex-1 text-sm truncate">{conv.title}</span>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                  style={{ color: "var(--text-muted)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bottom icons */}
      {!collapsed && (
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderTop: "1px solid var(--sidebar-border)" }}
        >
          <Image
            src="/saim-logo-officiel.png"
            alt="SAIM Conseil"
            width={90}
            height={28}
            style={{ objectFit: "contain", objectPosition: "left" }}
          />
        </div>
      )}
    </aside>
  );
}

function NavItem({
  icon,
  label,
  tag,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  tag?: string;
  collapsed: boolean;
}) {
  return (
    <button
      className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-sm transition-all duration-150 cursor-pointer"
      style={{
        color: "var(--sidebar-text)",
        justifyContent: collapsed ? "center" : "flex-start",
        background: "transparent",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sidebar-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ color: "var(--text-secondary)" }}>{icon}</span>
      {!collapsed && (
        <>
          <span>{label}</span>
          {tag && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: "var(--tag-new-bg)", color: "var(--tag-new-text)" }}
            >
              {tag}
            </span>
          )}
        </>
      )}
    </button>
  );
}
