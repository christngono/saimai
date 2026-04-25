"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Conversation } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";

interface Props {
  conversation: Conversation | null;
  loading: boolean;
  streamingText: string;
  onSend: (message: string) => void;
  onToggleSidebar: () => void;
}

export default function ChatArea({ conversation, loading, streamingText, onSend }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, streamingText]);

  const hasMessages = conversation && conversation.messages.length > 0;

  return (
    <div className="flex flex-col h-full" style={{ background: "#ffffff" }}>
      {/* Header minimal style Gemini */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: "1px solid #f0f0f0",
          background: "#ffffff",
          minHeight: 56,
          flexShrink: 0,
        }}
      >
        <Image
          src="/saim-logo-officiel.png"
          alt="SAIM Conseil"
          width={110}
          height={36}
          style={{ objectFit: "contain", objectPosition: "left" }}
          priority
        />
        <span style={{ fontSize: 12, color: "#aaa" }}>Fiscalité camerounaise</span>
      </header>

      {/* Contenu principal */}
      {!hasMessages ? (
        <WelcomeScreen onSend={onSend} loading={loading} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 16px" }}>
              {conversation.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Streaming — pleine largeur, pas de bulle */}
              {loading && streamingText && (
                <div className="message-appear" style={{ padding: "8px 0 24px 0" }}>
                  <div style={{ marginBottom: 16 }}>
                    <Image
                      src="/saim-logo-officiel.png"
                      alt="SAIM Conseil"
                      width={80}
                      height={28}
                      style={{ objectFit: "contain", objectPosition: "left" }}
                    />
                  </div>
                  <div style={{ color: "#1a1a1a", fontSize: 16, lineHeight: 1.75 }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {streamingText}
                    </ReactMarkdown>
                    <span
                      style={{
                        display: "inline-block",
                        width: 2,
                        height: 18,
                        marginLeft: 2,
                        verticalAlign: "middle",
                        background: "#10b981",
                        borderRadius: 2,
                        animation: "pulse 1s infinite",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Indicateur de chargement */}
              {loading && !streamingText && (
                <div style={{ padding: "16px 0", display: "flex", gap: 6, alignItems: "center" }}>
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <ChatInput onSend={onSend} loading={loading} />
        </>
      )}
    </div>
  );
}
