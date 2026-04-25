"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Send, Loader2, Paperclip, Monitor, Hash, Mic, MicOff } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
  welcome?: boolean;
}

export default function ChatInput({ onSend, loading, welcome }: Props) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported(!!SR);
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const startRecording = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    transcriptRef.current = "";
    const recognition = new SR();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }
      const transcript = final || interim;
      transcriptRef.current = final || transcriptRef.current;
      setInput(transcript);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      const final = transcriptRef.current.trim();
      if (final) {
        setInput("");
        onSend(final);
        transcriptRef.current = "";
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const micButton = voiceSupported && (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={loading}
      title={isRecording ? "Arrêter l'écoute" : "Parler à SAIM"}
      className="flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        width: welcome ? 32 : 28,
        height: welcome ? 32 : 28,
        background: isRecording ? "#ef4444" : "var(--sidebar-hover)",
        color: isRecording ? "white" : "var(--text-muted)",
        animation: isRecording ? "pulse 1.2s infinite" : "none",
        flexShrink: 0,
      }}
    >
      {isRecording ? <MicOff size={welcome ? 14 : 13} /> : <Mic size={welcome ? 14 : 13} />}
    </button>
  );

  if (welcome) {
    return (
      <div className="px-4 pt-4 pb-3">
        {isRecording && (
          <div
            className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl"
            style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "pulse 1s infinite" }} />
            <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>Écoute en cours… parlez maintenant</span>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          rows={3}
          placeholder={isRecording ? "Parlez, je vous écoute…" : "Attribuez une tâche ou posez une question"}
          disabled={loading}
          className="w-full resize-none outline-none text-sm bg-transparent leading-relaxed"
          style={{
            color: "var(--text-primary)",
            minHeight: 72,
            maxHeight: 200,
            lineHeight: "1.6",
          }}
        />
        <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-1">
            <IconBtn><Paperclip size={15} /></IconBtn>
            <IconBtn><Hash size={15} /></IconBtn>
            <IconBtn><Monitor size={15} /></IconBtn>
          </div>
          <div className="flex items-center gap-2">
            {micButton}
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex items-center justify-center rounded-full w-8 h-8 transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "var(--accent)" }}
            >
              {loading ? (
                <Loader2 size={14} className="text-white animate-spin" />
              ) : (
                <Send size={13} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal mode — sticky bottom bar
  return (
    <div
      className="px-4 py-3"
      style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <div
        className="flex flex-col rounded-2xl px-4 pt-3 pb-2 max-w-3xl mx-auto"
        style={{
          border: isRecording ? "1.5px solid #ef4444" : "1.5px solid var(--input-border)",
          background: "var(--surface)",
          boxShadow: isRecording ? "0 0 0 3px rgba(239,68,68,0.1)" : "0 2px 12px rgba(0,0,0,0.06)",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        {isRecording && (
          <div className="flex items-center gap-2 mb-2">
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "pulse 1s infinite" }} />
            <span style={{ fontSize: 12, color: "#dc2626" }}>Écoute en cours…</span>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          rows={1}
          placeholder={isRecording ? "Parlez, je vous écoute…" : "Posez votre question fiscale…"}
          disabled={loading}
          className="w-full resize-none outline-none text-sm bg-transparent leading-relaxed"
          style={{ color: "var(--text-primary)", maxHeight: 160, lineHeight: "1.6" }}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <IconBtn><Paperclip size={14} /></IconBtn>
            <IconBtn><Hash size={14} /></IconBtn>
            <IconBtn><Monitor size={14} /></IconBtn>
          </div>
          <div className="flex items-center gap-2">
            {micButton}
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex items-center justify-center rounded-full w-7 h-7 transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "var(--accent)" }}
            >
              {loading ? (
                <Loader2 size={13} className="text-white animate-spin" />
              ) : (
                <Send size={12} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
      <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)", fontSize: 11 }}>
        {isRecording ? "Cliquez sur le micro pour arrêter" : "Shift+Entrée pour un saut de ligne · Micro pour parler"}
      </p>
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors cursor-pointer"
      style={{ color: "var(--text-muted)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sidebar-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </button>
  );
}
