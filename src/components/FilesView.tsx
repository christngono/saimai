"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, File, Trash2, Download, Search, FileText, Image, FileSpreadsheet } from "lucide-react";

interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  dataUrl: string;
}

function fileIcon(type: string) {
  if (type.startsWith("image/")) return <Image size={18} color="#6366f1" />;
  if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return <FileSpreadsheet size={18} color="#10b981" />;
  return <FileText size={18} color="#f59e0b" />;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function FilesView() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("saim_files");
      if (saved) setFiles(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (updated: StoredFile[]) => {
    setFiles(updated);
    try {
      localStorage.setItem("saim_files", JSON.stringify(updated));
    } catch {
      // localStorage quota exceeded — don't crash
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const stored: StoredFile = {
          id: Math.random().toString(36).slice(2, 10),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toLocaleDateString("fr-FR"),
          dataUrl: ev.target?.result as string,
        };
        setFiles((prev) => {
          const updated = [stored, ...prev];
          try { localStorage.setItem("saim_files", JSON.stringify(updated)); } catch {}
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  const deleteFile = (id: string) => save(files.filter((f) => f.id !== id));

  const downloadFile = (file: StoredFile) => {
    const a = document.createElement("a");
    a.href = file.dataUrl;
    a.download = file.name;
    a.click();
  };

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fafafa" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>📁</span>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Mes fichiers</h2>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10, border: "none", background: "#10b981", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Upload size={15} /> Importer
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>
          Vos documents, factures, et fichiers générés par SAIM.
        </p>
        <input ref={inputRef} type="file" multiple onChange={handleUpload} style={{ display: "none" }} />
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px 28px 28px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Search */}
        {files.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid #e8e8e8" }}>
            <Search size={15} color="#bbb" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un fichier…"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", color: "#1a1a1a" }}
            />
          </div>
        )}

        {/* Drop zone / empty state */}
        {files.length === 0 && (
          <div
            onClick={() => inputRef.current?.click()}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 48, textAlign: "center", border: "2px dashed #e8e8e8", borderRadius: 16, cursor: "pointer", transition: "border-color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#10b981")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e8e8e8")}
          >
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>📁</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Aucun fichier</p>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Cliquez ou glissez des fichiers pour les importer</p>
          </div>
        )}

        {/* File list */}
        {filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((file) => (
              <div
                key={file.id}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "#fff", borderRadius: 12, border: "1px solid #e8e8e8", transition: "box-shadow 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {fileIcon(file.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</p>
                  <p style={{ fontSize: 11, color: "#bbb", margin: "2px 0 0" }}>{formatSize(file.size)} · {file.uploadedAt}</p>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => downloadFile(file)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e8e8e8", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f0f9f6"; (e.currentTarget as HTMLButtonElement).style.color = "#10b981"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.color = "#888"; }}
                  >
                    <Download size={13} />
                  </button>
                  <button
                    onClick={() => deleteFile(file.id)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e8e8e8", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ddd", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.color = "#ddd"; }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No search results */}
        {files.length > 0 && filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "#bbb", fontSize: 13, padding: 24 }}>Aucun fichier correspondant à "{search}"</p>
        )}
      </div>
    </div>
  );
}
