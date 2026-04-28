"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Upload, Building2, Users, Calendar, MapPin, Mail, Phone, Briefcase } from "lucide-react";

/* ─── Brand colors ─── */
const T    = "#C2562C";   // Terracotta
const INK  = "#1F1410";   // Encre
const SURF = "#EDE2CE";   // Surface claire
const MUTED= "#73655A";   // Texte secondaire
const LINE = "#DCCFB8";   // Bordures

/* ─── Logo mark SVG ─── */
function LogoMark({ size = 28 }: { size?: number }) {
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

/* ─── InputField déclaré HORS du composant pour éviter le bug de focus ─── */
interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}

function InputField({ icon, label, value, onChange, placeholder, type = "text" }: InputFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: MUTED }}>{label}</label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 14px",
          borderRadius: 10,
          border: `1px solid ${LINE}`,
          background: "#fff",
        }}
      >
        <span style={{ color: MUTED, flexShrink: 0 }}>{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: "13px 0",
            background: "transparent",
            border: "none",
            outline: "none",
            color: INK,
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Données statiques ─── */
const SECTORS = [
  "Commerce & Distribution", "Agriculture & Agroalimentaire", "BTP & Immobilier",
  "Services aux entreprises", "Technologies & Informatique", "Santé & Pharmacie",
  "Éducation & Formation", "Hôtellerie & Restauration", "Transport & Logistique", "Autre",
];

const DEPARTMENTS = [
  { id: "fiscal",     icon: "🧾", label: "Fiscalité",            desc: "TVA, IS, IRPP, taxes" },
  { id: "accounting", icon: "💼", label: "Comptabilité",         desc: "Factures, bilan, trésorerie" },
  { id: "hr",         icon: "👥", label: "Ressources humaines",  desc: "Paie, congés, contrats" },
  { id: "marketing",  icon: "📣", label: "Marketing & contenus", desc: "Campagnes, réseaux sociaux" },
  { id: "projects",   icon: "📋", label: "Gestion de projets",   desc: "Tâches, planification" },
  { id: "reports",    icon: "📄", label: "Rapports & synthèses", desc: "Documents, analyses" },
  { id: "payment",    icon: "💳", label: "Paiement",             desc: "Encaissements, factures" },
  { id: "commercial", icon: "📦", label: "Commercial",           desc: "Clients, devis, ventes" },
  { id: "design",     icon: "🎨", label: "Design",               desc: "Identité visuelle, supports" },
];

interface FormData {
  companyName: string;
  sector: string;
  employees: string;
  founded: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  logo: string | null;
  departments: string[];
}

const INITIAL: FormData = {
  companyName: "", sector: "", employees: "", founded: "",
  city: "", country: "", email: "", phone: "",
  logo: null, departments: ["fiscal"],
};

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const TOTAL_STEPS = 3;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const set = (field: keyof FormData, val: string) =>
    setData((d) => ({ ...d, [field]: val }));

  const toggleDept = (id: string) =>
    setData((d) => ({
      ...d,
      departments: d.departments.includes(id)
        ? d.departments.filter((x) => x !== id)
        : [...d.departments, id],
    }));

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setLogoPreview(result);
      setData((d) => ({ ...d, logo: result }));
    };
    reader.readAsDataURL(file);
  };

  const canNext = () => {
    if (step === 0) return data.companyName.trim() && data.sector && data.employees;
    if (step === 1) return data.city.trim() && data.email.trim();
    return data.departments.length > 0;
  };

  const handleSubmit = () => {
    localStorage.setItem("saim_company", JSON.stringify(data));
    router.push("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: SURF, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <LogoMark size={32} />
          <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: 24, color: INK, letterSpacing: "-0.03em", lineHeight: 1 }}>
            saim<span style={{ color: T }}>AI</span>
          </span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            {["Entreprise", "Coordonnées", "Modules"].map((label, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: i <= step ? 600 : 400, color: i <= step ? T : MUTED, transition: "color 0.2s" }}>
                {label}
              </span>
            ))}
          </div>
          <div style={{ height: 3, borderRadius: 999, background: LINE }}>
            <div style={{ height: "100%", borderRadius: 999, background: T, width: `${progress}%`, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Card */}
        <div style={{ borderRadius: 20, border: `1px solid ${LINE}`, background: "#fff", padding: "36px 32px", boxShadow: "0 4px 24px rgba(31,20,16,0.08)" }}>

          {/* ── Étape 0 ── */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: INK, marginBottom: 6 }}>Votre entreprise</h2>
                <p style={{ fontSize: 14, color: MUTED }}>Dites-nous qui vous êtes</p>
              </div>

              <InputField icon={<Building2 size={16} />} label="Nom de l'entreprise *" value={data.companyName} onChange={(v) => set("companyName", v)} placeholder="Ex: ACME Sarl" />

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: MUTED }}>Secteur d'activité *</label>
                <select
                  value={data.sector}
                  onChange={(e) => set("sector", e.target.value)}
                  style={{ padding: "13px 14px", borderRadius: 10, border: `1px solid ${LINE}`, background: "#fff", color: data.sector ? INK : MUTED, fontSize: 14, outline: "none", cursor: "pointer" }}
                >
                  <option value="">Sélectionnez un secteur</option>
                  {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <InputField icon={<Users size={16} />} label="Nombre d'employés *" value={data.employees} onChange={(v) => set("employees", v)} placeholder="Ex: 12" type="number" />
                <InputField icon={<Calendar size={16} />} label="Année de création" value={data.founded} onChange={(v) => set("founded", v)} placeholder="Ex: 2019" type="number" />
              </div>

              {/* Logo upload */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: MUTED }}>Logo (optionnel)</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ padding: 20, borderRadius: 10, border: `1px dashed ${LINE}`, background: SURF, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = T)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = LINE)}
                >
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" style={{ height: 48, objectFit: "contain" }} />
                    : <><Upload size={18} color={MUTED} /><span style={{ fontSize: 13, color: MUTED }}>Cliquez pour charger votre logo</span></>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }} />
              </div>
            </div>
          )}

          {/* ── Étape 1 ── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: INK, marginBottom: 6 }}>Coordonnées</h2>
                <p style={{ fontSize: 14, color: MUTED }}>Comment vous contacter</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <InputField icon={<MapPin size={16} />} label="Ville *" value={data.city} onChange={(v) => set("city", v)} placeholder="Ex: Paris" />
                <InputField icon={<Briefcase size={16} />} label="Pays" value={data.country} onChange={(v) => set("country", v)} placeholder="Ex: France" />
              </div>
              <InputField icon={<Mail size={16} />} label="Email professionnel *" value={data.email} onChange={(v) => set("email", v)} placeholder="contact@monentreprise.com" type="email" />
              <InputField icon={<Phone size={16} />} label="Téléphone" value={data.phone} onChange={(v) => set("phone", v)} placeholder="+33 6 XX XX XX XX" type="tel" />
            </div>
          )}

          {/* ── Étape 2 ── */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: INK, marginBottom: 6 }}>Modules à activer</h2>
                <p style={{ fontSize: 14, color: MUTED }}>Sélectionnez les domaines à gérer</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {DEPARTMENTS.map((dept) => {
                  const active = data.departments.includes(dept.id);
                  return (
                    <button
                      key={dept.id}
                      onClick={() => dept.id !== "fiscal" && toggleDept(dept.id)}
                      style={{ padding: "14px 16px", borderRadius: 12, border: `1px solid ${active ? T : LINE}`, background: active ? `${T}12` : "#fff", cursor: dept.id === "fiscal" ? "default" : "pointer", display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left", transition: "all 0.15s", position: "relative" }}
                    >
                      {active && (
                        <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%", background: T, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={11} color="#fff" />
                        </div>
                      )}
                      <span style={{ fontSize: 20, lineHeight: 1 }}>{dept.icon}</span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: INK, margin: 0, marginBottom: 2 }}>
                          {dept.label}
                          {dept.id === "fiscal" && <span style={{ marginLeft: 6, fontSize: 10, color: T, border: `1px solid ${T}40`, borderRadius: 4, padding: "1px 5px" }}>inclus</span>}
                        </p>
                        <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{dept.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
            {step > 0 ? (
              <button onClick={() => setStep((s) => s - 1)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 10, border: `1px solid ${LINE}`, background: "transparent", color: MUTED, fontSize: 14, cursor: "pointer" }}>
                <ArrowLeft size={15} /> Retour
              </button>
            ) : <div />}

            {step < TOTAL_STEPS - 1 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, border: "none", background: canNext() ? T : LINE, color: canNext() ? "#fff" : MUTED, fontSize: 14, fontWeight: 600, cursor: canNext() ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
                Continuer <ArrowRight size={15} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canNext()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 10, border: "none", background: canNext() ? T : LINE, color: canNext() ? "#fff" : MUTED, fontSize: 14, fontWeight: 600, cursor: canNext() ? "pointer" : "not-allowed", transition: "all 0.15s", boxShadow: canNext() ? `0 4px 20px ${T}40` : "none" }}>
                <Check size={15} /> Accéder au tableau de bord
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: MUTED }}>
          Vous avez déjà un compte ?{" "}
          <button onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", color: T, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}
