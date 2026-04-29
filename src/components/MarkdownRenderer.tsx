"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const COMPONENTS: Components = {
  p: ({ children }) => (
    <p style={{ margin: "0 0 14px 0", lineHeight: "1.75", fontSize: "16px", color: "#1a1a1a" }}>{children}</p>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 600, color: "#1a1a1a" }}>{children}</strong>
  ),
  ol: ({ children }) => (
    <ol style={{ margin: "8px 0 14px 0", paddingLeft: 22, lineHeight: "1.8" }}>{children}</ol>
  ),
  ul: ({ children }) => (
    <ul style={{ margin: "8px 0 14px 0", paddingLeft: 22, lineHeight: "1.8", listStyleType: "disc" }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 6, fontSize: "16px", color: "#1a1a1a" }}>{children}</li>
  ),
  table: ({ children }) => (
    <div style={{ overflowX: "auto", margin: "14px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th style={{ padding: "10px 14px", borderBottom: "2px solid #e5e7eb", textAlign: "left", fontWeight: 600, color: "#374151", backgroundColor: "#f9fafb" }}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0", color: "#374151" }}>{children}</td>
  ),
  code: ({ children }) => (
    <code style={{ backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: 4, fontSize: "14px", fontFamily: "monospace", color: "#1f2937" }}>
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: "3px solid #10b981", paddingLeft: 14, margin: "14px 0", color: "#6b7280", fontStyle: "italic" }}>
      {children}
    </blockquote>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "24px 0 12px 0", color: "#1a1a1a" }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "20px 0 10px 0", color: "#1a1a1a" }}>{children}</h3>
  ),
};

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
      {children}
    </ReactMarkdown>
  );
}
