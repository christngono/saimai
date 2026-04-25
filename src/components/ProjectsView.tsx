"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, FolderOpen, Calendar, FileText } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("saim_projects");
      if (saved) setProjects(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem("saim_projects", JSON.stringify(updated));
  };

  const createProject = () => {
    if (!name.trim()) return;
    const project: Project = {
      id: Math.random().toString(36).slice(2, 10),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toLocaleDateString("fr-FR"),
    };
    save([project, ...projects]);
    setName("");
    setDescription("");
    setShowForm(false);
  };

  const deleteProject = (id: string) => {
    save(projects.filter((p) => p.id !== id));
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fafafa" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>🗂️</span>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Mes projets</h2>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10, border: "none", background: "#10b981", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Plus size={15} /> Nouveau projet
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>
          Organisez vos missions et suivez leur avancement.
        </p>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Create form */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #10b98140", padding: 20, boxShadow: "0 4px 20px rgba(16,185,129,0.08)" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 14 }}>Nouveau projet</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 5 }}>Nom du projet *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Audit fiscal Q2 2025"
                  onKeyDown={(e) => e.key === "Enter" && createProject()}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e8e8e8", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 5 }}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez les objectifs du projet…"
                  rows={3}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e8e8e8", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setShowForm(false)} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #e8e8e8", background: "#fff", color: "#666", fontSize: 13, cursor: "pointer" }}>
                  Annuler
                </button>
                <button onClick={createProject} disabled={!name.trim()} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: name.trim() ? "#10b981" : "#e8e8e8", color: name.trim() ? "#fff" : "#aaa", fontSize: 13, fontWeight: 600, cursor: name.trim() ? "pointer" : "not-allowed" }}>
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {projects.length === 0 && !showForm && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 12, padding: 40, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🗂️</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Aucun projet pour l'instant</p>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Créez votre premier projet pour organiser vos missions.</p>
          </div>
        )}

        {/* Project cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {projects.map((project) => (
            <div
              key={project.id}
              style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 18, position: "relative", transition: "box-shadow 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0f9f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FolderOpen size={18} color="#10b981" />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{project.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <Calendar size={10} color="#bbb" />
                      <span style={{ fontSize: 11, color: "#bbb" }}>{project.createdAt}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ddd", padding: 4, borderRadius: 6, transition: "color 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ef4444")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ddd")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {project.description ? (
                <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.6 }}>{project.description}</p>
              ) : (
                <p style={{ fontSize: 12, color: "#ccc", margin: 0, fontStyle: "italic" }}>Pas de description</p>
              )}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f5f5f5", display: "flex", alignItems: "center", gap: 4 }}>
                <FileText size={11} color="#ccc" />
                <span style={{ fontSize: 11, color: "#ccc" }}>0 fichier</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
