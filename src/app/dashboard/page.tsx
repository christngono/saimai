"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import TaskSidebar, { TASKS } from "@/components/TaskSidebar";
import ChatArea from "@/components/ChatArea";
import { Conversation, Message } from "@/lib/types";

const InvoiceGenerator     = dynamic(() => import("@/components/InvoiceGenerator"));
const FilesView            = dynamic(() => import("@/components/FilesView"));
const FormationsView       = dynamic(() => import("@/components/FormationsView"));
const MarketingView        = dynamic(() => import("@/components/MarketingView"));
const AccountingView       = dynamic(() => import("@/components/AccountingView"));
const CommercialView       = dynamic(() => import("@/components/CommercialView"));
const ProjectManagementView = dynamic(() => import("@/components/ProjectManagementView"));

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function titleFromMessage(msg: string): string {
  return msg.length > 42 ? msg.slice(0, 42) + "…" : msg;
}

interface CompanyProfile {
  companyName: string;
  logo: string | null;
  city: string;
  country: string;
  sector: string;
  email: string;
  phone: string;
  departments: string[];
}

function ComingSoon({ task }: { task: typeof TASKS[0] }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafafa",
        padding: 40,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          marginBottom: 20,
        }}
      >
        {task.icon}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1a1a1a", marginBottom: 10 }}>
        {task.label}
      </h2>
      <p style={{ fontSize: 15, color: "#888", maxWidth: 400, lineHeight: 1.7, marginBottom: 28 }}>
        Ce module est en cours de développement et sera disponible prochainement. Seule la <strong>Fiscalité</strong> est active pour le moment.
      </p>
      <span
        style={{
          padding: "6px 16px",
          borderRadius: 999,
          background: "#f0f0f0",
          color: "#aaa",
          fontSize: 12,
          fontWeight: 500,
          border: "1px solid #e5e5e5",
        }}
      >
        Bientôt disponible
      </span>
    </div>
  );
}

function CompanyBadge({ company }: { company: CompanyProfile | null }) {
  const router = useRouter();
  if (!company) {
    return (
      <button
        onClick={() => router.push("/onboarding")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 14px",
          borderRadius: 10,
          border: "1px solid #e8e8e8",
          background: "#fff",
          color: "#555",
          fontSize: 13,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
      >
        Configurer mon entreprise →
      </button>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "5px 12px",
        borderRadius: 12,
        border: "1px solid #e8e8e8",
        background: "#fff",
        cursor: "pointer",
      }}
    >
      {company.logo ? (
        <img src={company.logo} alt="Logo" style={{ height: 28, width: 28, borderRadius: 6, objectFit: "contain" }} />
      ) : (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "#C2562C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {company.companyName.charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{company.companyName}</p>
        <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>{company.city || company.sector || "Mon entreprise"}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTask, setActiveTask] = useState("fiscal");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [company, setCompany] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("saim_company");
      if (saved) setCompany(JSON.parse(saved));
    } catch {}
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConvId) ?? null;

  const createConversation = useCallback(() => {
    const id = generateId();
    const newConv: Conversation = { id, title: "Nouvelle conversation", messages: [], createdAt: new Date() };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(id);
    return id;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
  }, [activeConvId]);

  const sendMessage = useCallback(async (content: string) => {
    let convId = activeConvId;
    if (!convId) {
      convId = generateId();
      setConversations((prev) => [
        { id: convId!, title: titleFromMessage(content), messages: [], createdAt: new Date() },
        ...prev,
      ]);
      setActiveConvId(convId);
    }

    const userMsg: Message = { id: generateId(), role: "user", content, timestamp: new Date() };
    const currentMessages = conversations.find((c) => c.id === convId)?.messages ?? [];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, title: c.messages.length === 0 ? titleFromMessage(content) : c.title, messages: [...c.messages, userMsg] }
          : c
      )
    );

    setLoading(true);
    setStreamingText("");

    try {
      const history = [...currentMessages, userMsg].map((m) => ({ role: m.role, content: m.content }));
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

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, { id: generateId(), role: "assistant", content: full.trim(), timestamp: new Date(), sources: sources.length > 0 ? sources : undefined }] }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setStreamingText("");
    }
  }, [activeConvId, conversations]);

  const currentTask = TASKS.find((t) => t.id === activeTask)!;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#fafafa" }}>
      {/* Task sidebar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <TaskSidebar
          activeTask={activeTask}
          onSelectTask={(id) => { setActiveTask(id); }}
          conversations={conversations}
          activeConvId={activeConvId}
          onSelectConv={setActiveConvId}
          onNewConv={createConversation}
          onDeleteConv={deleteConversation}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 20px",
            height: 56,
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          <CompanyBadge company={company} />
        </div>

        {/* Task content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {activeTask === "fiscal" ? (
            <ChatArea
              conversation={activeConversation}
              loading={loading}
              streamingText={streamingText}
              onSend={sendMessage}
              onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
            />
          ) : activeTask === "facture" ? (
            <InvoiceGenerator company={company} />
          ) : activeTask === "projects" ? (
            <ProjectManagementView />
          ) : activeTask === "files" ? (
            <FilesView />
          ) : activeTask === "formations" ? (
            <FormationsView />
          ) : activeTask === "marketing" ? (
            <MarketingView />
          ) : activeTask === "accounting" ? (
            <AccountingView />
          ) : activeTask === "commercial" ? (
            <CommercialView />
          ) : (
            <ComingSoon task={currentTask} />
          )}
        </div>
      </div>
    </div>
  );
}
