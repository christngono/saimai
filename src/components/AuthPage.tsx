"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SaimMark, SAIM } from "./SaimUI";
import { useAuth, AuthUser } from "@/lib/auth";

/* ─── Icônes ─── */
function GoogleSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
function WhatsAppSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}
function MailSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function EyeSvg({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

/* ─── Rôles wizard ─── */
const ROLES = [
  { id: "entrepreneur", label: "Entrepreneur", sub: "Commerçant", emoji: "🏪" },
  { id: "salarie",      label: "Salarié",       sub: "Fonctionnaire", emoji: "💼" },
  { id: "comptable",    label: "Expert-comptable", sub: "CGA", emoji: "📊" },
  { id: "autre",        label: "Autre",          sub: "",    emoji: "✨" },
];

/* ─── Pays ─── */
const COUNTRIES = [
  "Cameroun", "Côte d'Ivoire", "Sénégal", "République Centrafricaine",
  "Congo (Brazzaville)", "RDC (Congo Kinshasa)", "Gabon", "Tchad",
  "Bénin", "Burkina Faso", "Niger", "Mali", "Togo", "Guinée Conakry",
  "Guinée Équatoriale", "Madagascar", "Djibouti", "Comores", "Mauritanie",
  "Rwanda", "Burundi", "France", "Belgique", "Suisse", "Canada", "Autre",
];

/* ─── Champ input réutilisable ─── */
function Field({ label, type = "text", value, onChange, placeholder, required, suffix }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder: string; required?: boolean; suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#141413", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
        {label}{required && <span style={{ color: SAIM.accent, marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: "relative" as const }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box" as const,
            border: `1.5px solid ${focused ? "#141413" : "#D9D8D5"}`,
            borderRadius: 12, padding: suffix ? "13px 44px 13px 16px" : "13px 16px",
            fontSize: 15, color: "#141413", background: "#ffffff",
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            outline: "none", transition: "border-color 0.15s",
            boxShadow: focused ? "0 0 0 3px rgba(20,20,19,0.06)" : "none",
          }}
        />
        {suffix && (
          <div style={{ position: "absolute" as const, right: 14, top: "50%", transform: "translateY(-50%)" }}>
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Bouton méthode ─── */
function MethodBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 14,
        padding: "14px 20px", borderRadius: 14,
        background: hov ? "#F5F3EF" : "#ffffff",
        border: `1.5px solid ${hov ? "#C0BEB9" : "#D9D8D5"}`,
        cursor: "pointer", transition: "all 0.15s",
        fontFamily: "'Inter Tight', system-ui, sans-serif",
        fontSize: 15, fontWeight: 500, color: "#141413",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

type Screen = "select" | "email" | "whatsapp" | "wizard-1" | "wizard-2";

export default function AuthPage() {
  const router   = useRouter();
  const { user, loaded, login } = useAuth();

  const [screen,    setScreen]    = useState<Screen>("select");
  const [isLogin,   setIsLogin]   = useState(false);
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [role,      setRole]      = useState("");
  const [country,   setCountry]   = useState("");
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);

  /* Redirection si déjà connecté */
  useEffect(() => {
    if (!loaded) return;
    if (user?.setupDone) router.replace("/dashboard");
    else if (user && !user.setupDone) { setPendingUser(user); setScreen("wizard-1"); }
  }, [loaded, user, router]);

  const makeId = () => Math.random().toString(36).slice(2, 10);

  /* ── Auth Google (simulée) ── */
  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      const u: AuthUser = {
        id: makeId(), name: "Utilisateur Google", email: "user@gmail.com",
        method: "google", credits: 20, setupDone: false,
      };
      setPendingUser(u);
      login(u);
      setScreen("wizard-1");
      setLoading(false);
    }, 900);
  };

  /* ── Soumission Email / WhatsApp ── */
  const handleSubmit = (method: "email" | "whatsapp") => {
    setError("");
    const identifier = method === "email" ? email : phone;
    if (!identifier || (!isLogin && !name) || !password) { setError("Merci de remplir tous les champs."); return; }
    setLoading(true);
    setTimeout(() => {
      const u: AuthUser = {
        id: makeId(),
        name: isLogin ? (identifier.split("@")[0] || identifier) : name,
        ...(method === "email" ? { email } : { phone }),
        method, credits: 20, setupDone: false,
      };
      setPendingUser(u);
      login(u);
      if (isLogin) { router.replace("/dashboard"); }
      else         { setScreen("wizard-1"); }
      setLoading(false);
    }, 800);
  };

  /* ── Fin du wizard ── */
  const handleWizardDone = () => {
    if (!pendingUser) return;
    const updated = { ...pendingUser, role, country, setupDone: true };
    login(updated);
    router.replace("/dashboard");
  };

  /* ── Spinner d'attente ── */
  if (!loaded) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFAF7" }}>
      <SaimMark size={40} />
    </div>
  );

  /* ─────────── RENDU ─────────── */
  return (
    <div style={{
      minHeight: "100vh", background: "#FBFAF7",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'Inter Tight', system-ui, sans-serif",
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SaimMark size={32} />
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 400, color: "#141413", fontStyle: "italic", letterSpacing: "-0.02em" }}>
            saim <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: "#73726C", letterSpacing: "0.12em", textTransform: "uppercase" as const, fontStyle: "normal" }}>ai</span>
          </span>
        </div>
      </Link>

      {/* Carte */}
      <div style={{
        width: "100%", maxWidth: 440,
        background: "#ffffff",
        border: "1px solid #E8E6E1",
        borderRadius: 20,
        padding: "36px 32px",
        boxShadow: "0 4px 32px rgba(20,20,19,0.07)",
      }}>

        {/* ══ SCREEN : SELECT ══ */}
        {screen === "select" && (
          <>
            <div style={{ textAlign: "center" as const, marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 400, color: "#141413", margin: "0 0 8px", letterSpacing: "-0.025em" }}>
                {isLogin ? "Bon retour !" : "Bienvenue sur SAIM AI"}
              </h1>
              {!isLogin && (
                <p style={{ fontSize: 14, color: "#73726C", margin: 0, lineHeight: 1.5 }}>
                  Créez votre compte et recevez{" "}
                  <strong style={{ color: SAIM.accent }}>20 crédits offerts</strong> gratuitement.
                </p>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <MethodBtn icon={<GoogleSvg />}     label="Continuer avec Google"  onClick={handleGoogle} />
              <MethodBtn icon={<MailSvg />}        label="Continuer avec Email"   onClick={() => setScreen("email")} />
              <MethodBtn icon={<WhatsAppSvg />}    label="Numéro WhatsApp"        onClick={() => setScreen("whatsapp")} />
            </div>

            {loading && (
              <div style={{ textAlign: "center" as const, marginTop: 20, color: "#73726C", fontSize: 13 }}>
                Connexion en cours…
              </div>
            )}

            <div style={{ marginTop: 24, textAlign: "center" as const, fontSize: 14, color: "#73726C" }}>
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} style={{ background: "none", border: "none", cursor: "pointer", color: "#141413", fontWeight: 600, fontSize: 14, textDecoration: "underline", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </div>
          </>
        )}

        {/* ══ SCREEN : EMAIL ══ */}
        {screen === "email" && (
          <>
            <button onClick={() => { setScreen("select"); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#73726C", fontSize: 13, display: "flex", alignItems: "center", gap: 6, marginBottom: 20, padding: 0, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Retour
            </button>

            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 400, color: "#141413", margin: "0 0 24px", letterSpacing: "-0.02em" }}>
              {isLogin ? "Se connecter" : "Créer votre compte"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {!isLogin && (
                <Field label="Nom complet" value={name} onChange={setName} placeholder="Marie Dupont" required />
              )}
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="marie@exemple.com" required />
              <Field
                label="Mot de passe" type={showPw ? "text" : "password"}
                value={password} onChange={setPassword} placeholder="8 caractères minimum" required
                suffix={
                  <button onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: "#73726C", display: "flex", padding: 0 }}>
                    <EyeSvg open={showPw} />
                  </button>
                }
              />
            </div>

            {error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 12, marginBottom: 0 }}>{error}</p>}

            <button
              onClick={() => handleSubmit("email")}
              disabled={loading}
              style={{
                width: "100%", marginTop: 20, padding: "14px 0", borderRadius: 12,
                background: loading ? "#73726C" : "#141413",
                color: "#FBFAF7", border: "none", cursor: loading ? "default" : "pointer",
                fontSize: 15, fontWeight: 600, fontFamily: "'Inter Tight', system-ui, sans-serif",
                transition: "background 0.15s",
              }}
            >
              {loading ? "Chargement…" : (isLogin ? "Se connecter" : "Créer mon compte")}
            </button>

            <div style={{ marginTop: 16, textAlign: "center" as const, fontSize: 14, color: "#73726C" }}>
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} style={{ background: "none", border: "none", cursor: "pointer", color: "#141413", fontWeight: 600, fontSize: 14, textDecoration: "underline", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </div>
          </>
        )}

        {/* ══ SCREEN : WHATSAPP ══ */}
        {screen === "whatsapp" && (
          <>
            <button onClick={() => { setScreen("select"); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#73726C", fontSize: 13, display: "flex", alignItems: "center", gap: 6, marginBottom: 20, padding: 0, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Retour
            </button>

            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 400, color: "#141413", margin: "0 0 24px", letterSpacing: "-0.02em" }}>
              {isLogin ? "Se connecter" : "Créer votre compte"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {!isLogin && (
                <Field label="Nom complet" value={name} onChange={setName} placeholder="Marie Dupont" required />
              )}
              {/* Indicatif + numéro */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#141413" }}>
                  Numéro WhatsApp<span style={{ color: SAIM.accent, marginLeft: 3 }}>*</span>
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <select
                    style={{
                      border: "1.5px solid #D9D8D5", borderRadius: 12, padding: "13px 10px",
                      fontSize: 14, color: "#141413", background: "#ffffff", cursor: "pointer",
                      fontFamily: "'Inter Tight', system-ui, sans-serif", outline: "none",
                      flexShrink: 0,
                    }}
                    defaultValue="+237"
                  >
                    <option value="+237">🇨🇲 +237</option>
                    <option value="+225">🇨🇮 +225</option>
                    <option value="+221">🇸🇳 +221</option>
                    <option value="+242">🇨🇬 +242</option>
                    <option value="+241">🇬🇦 +241</option>
                    <option value="+235">🇹🇩 +235</option>
                    <option value="+243">🇨🇩 +243</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+32">🇧🇪 +32</option>
                    <option value="+1">🇨🇦 +1</option>
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="6 90 00 00 00"
                    style={{
                      flex: 1, border: "1.5px solid #D9D8D5", borderRadius: 12, padding: "13px 16px",
                      fontSize: 15, color: "#141413", background: "#ffffff",
                      fontFamily: "'Inter Tight', system-ui, sans-serif", outline: "none",
                    }}
                  />
                </div>
              </div>
              <Field
                label="Mot de passe" type={showPw ? "text" : "password"}
                value={password} onChange={setPassword} placeholder="8 caractères minimum" required
                suffix={
                  <button onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: "#73726C", display: "flex", padding: 0 }}>
                    <EyeSvg open={showPw} />
                  </button>
                }
              />
            </div>

            {error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 12, marginBottom: 0 }}>{error}</p>}

            <button
              onClick={() => handleSubmit("whatsapp")}
              disabled={loading}
              style={{
                width: "100%", marginTop: 20, padding: "14px 0", borderRadius: 12,
                background: loading ? "#73726C" : "#141413",
                color: "#FBFAF7", border: "none", cursor: loading ? "default" : "pointer",
                fontSize: 15, fontWeight: 600, fontFamily: "'Inter Tight', system-ui, sans-serif",
                transition: "background 0.15s",
              }}
            >
              {loading ? "Chargement…" : (isLogin ? "Se connecter" : "Créer mon compte")}
            </button>
          </>
        )}

        {/* ══ WIZARD STEP 1 : Rôle ══ */}
        {screen === "wizard-1" && (
          <>
            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#141413", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#FBFAF7" }}>1</span>
              </div>
              <div style={{ flex: 1, height: 2, background: "#E8E6E1", borderRadius: 2 }} />
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#E8E6E1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#73726C" }}>2</span>
              </div>
            </div>

            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 400, color: "#141413", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Vous êtes ?
            </h2>
            <p style={{ fontSize: 13, color: "#73726C", margin: "0 0 24px" }}>
              Cela aide SAIM à personnaliser ses réponses.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                    background: role === r.id ? "rgba(20,20,19,0.05)" : "#ffffff",
                    border: `1.5px solid ${role === r.id ? "#141413" : "#D9D8D5"}`,
                    fontFamily: "'Inter Tight', system-ui, sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{r.emoji}</span>
                  <div style={{ textAlign: "left" as const }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#141413" }}>{r.label}</div>
                    {r.sub && <div style={{ fontSize: 12, color: "#73726C", marginTop: 1 }}>{r.sub}</div>}
                  </div>
                  {role === r.id && (
                    <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: "#141413", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FBFAF7" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => role && setScreen("wizard-2")}
              disabled={!role}
              style={{
                width: "100%", marginTop: 20, padding: "14px 0", borderRadius: 12,
                background: role ? "#141413" : "#D9D8D5",
                color: "#FBFAF7", border: "none", cursor: role ? "pointer" : "default",
                fontSize: 15, fontWeight: 600, fontFamily: "'Inter Tight', system-ui, sans-serif",
                transition: "background 0.2s",
              }}
            >
              Continuer →
            </button>
          </>
        )}

        {/* ══ WIZARD STEP 2 : Pays ══ */}
        {screen === "wizard-2" && (
          <>
            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#141413", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FBFAF7" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ flex: 1, height: 2, background: "#141413", borderRadius: 2 }} />
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#141413", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#FBFAF7" }}>2</span>
              </div>
            </div>

            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 400, color: "#141413", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Votre pays ?
            </h2>
            <p style={{ fontSize: 13, color: "#73726C", margin: "0 0 24px" }}>
              Pour adapter la fiscalité et les réglementations.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#141413" }}>Pays<span style={{ color: SAIM.accent, marginLeft: 3 }}>*</span></label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                style={{
                  width: "100%", border: `1.5px solid ${country ? "#141413" : "#D9D8D5"}`,
                  borderRadius: 12, padding: "13px 16px",
                  fontSize: 15, color: country ? "#141413" : "#73726C",
                  background: "#ffffff", cursor: "pointer",
                  fontFamily: "'Inter Tight', system-ui, sans-serif", outline: "none",
                  appearance: "none" as const,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2373726C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: 40,
                }}
              >
                <option value="" disabled>Sélectionner votre pays…</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Récap crédits */}
            <div style={{
              marginTop: 20, padding: "14px 18px", borderRadius: 12,
              background: "rgba(194,86,44,0.06)", border: "1px solid rgba(194,86,44,0.18)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 22 }}>⚡</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#141413" }}>20 crédits gratuits vous attendent</div>
                <div style={{ fontSize: 12, color: "#73726C", marginTop: 2 }}>1 crédit = 1 question · Sans carte bancaire</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setScreen("wizard-1")}
                style={{
                  padding: "14px 0", borderRadius: 12, border: "1.5px solid #D9D8D5",
                  background: "transparent", color: "#73726C", cursor: "pointer",
                  fontSize: 14, fontFamily: "'Inter Tight', system-ui, sans-serif",
                  width: 80, flexShrink: 0,
                }}
              >
                ← Retour
              </button>
              <button
                onClick={handleWizardDone}
                disabled={!country}
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 12,
                  background: country ? "#141413" : "#D9D8D5",
                  color: "#FBFAF7", border: "none", cursor: country ? "pointer" : "default",
                  fontSize: 15, fontWeight: 600, fontFamily: "'Inter Tight', system-ui, sans-serif",
                  transition: "background 0.2s",
                }}
              >
                Commencer avec SAIM →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bas de page */}
      <p style={{ marginTop: 24, fontSize: 12, color: "#A8A5A0", textAlign: "center" as const, lineHeight: 1.5 }}>
        En continuant, vous acceptez nos{" "}
        <Link href="#" style={{ color: "#73726C", textDecoration: "underline" }}>CGU</Link>{" "}et notre{" "}
        <Link href="#" style={{ color: "#73726C", textDecoration: "underline" }}>politique de confidentialité</Link>.
      </p>
    </div>
  );
}
