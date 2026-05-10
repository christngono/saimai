"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SaimLogoH, Footer, SAIM, LangSwitcher } from "./SaimUI";
import { useT } from "@/lib/i18n";

/* ─── Hook responsive ─── */
function useResponsive() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return { isMobile: width > 0 && width < 768, isSmall: width > 0 && width < 1024 };
}

/* ─── Icônes réseaux sociaux ─── */
function LinkedInSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
function FacebookSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function TikTokSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.83a8.26 8.26 0 0 0 4.83 1.55V4.59a4.85 4.85 0 0 1-1.06-.1z"/>
    </svg>
  );
}
function MailSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function WhatsAppSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

/* ─── Nav simplifiée ─── */
function ContactNav() {
  const { isSmall } = useResponsive();
  const t = useT();
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: isSmall ? "14px 20px" : "14px 48px",
      background: "#FBFAF7",
      borderBottom: "1px solid #DEDEDD",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <SaimLogoH size={28} dark={true} />
      {!isSmall && (
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <Link href="/#pricing" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: "#73726C", textDecoration: "none" }}>
            {t("contact.nav.pricing")}
          </Link>
          <Link href="/contact" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: "#141413", textDecoration: "none" }}>
            {t("nav.contact")}
          </Link>
        </div>
      )}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <LangSwitcher />
        <Link href="/dashboard" prefetch={false} style={{
          fontFamily: "'Inter Tight', system-ui, sans-serif",
          fontSize: 14, fontWeight: 600,
          color: "#FBFAF7", textDecoration: "none",
          padding: isSmall ? "8px 16px" : "9px 20px", borderRadius: 10,
          background: "#1A1612",
        }}>
          {t("contact.nav.try")}
        </Link>
      </div>
    </nav>
  );
}

/* ─── Champ formulaire ─── */
function Field({ label, type = "text", placeholder, rows, required }: {
  label: string; type?: string; placeholder: string; rows?: number; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    width: "100%", border: `1.5px solid ${focused ? "#141413" : "#D9D8D5"}`,
    borderRadius: 12, padding: "13px 16px",
    fontSize: 15, color: "#141413", background: "#ffffff",
    fontFamily: "'Inter Tight', system-ui, sans-serif",
    outline: "none", transition: "border-color 0.15s",
    boxSizing: "border-box" as const,
    boxShadow: focused ? "0 0 0 3px rgba(20,20,19,0.06)" : "none",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#141413", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
        {label}{required && <span style={{ color: SAIM.accent, marginLeft: 3 }}>*</span>}
      </label>
      {rows ? (
        <textarea
          placeholder={placeholder}
          rows={rows}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...base, resize: "vertical", minHeight: 120, lineHeight: 1.6 }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={base}
        />
      )}
    </div>
  );
}

/* ─── Page principale ─── */
export default function ContactPage() {
  const { isMobile, isSmall } = useResponsive();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const t = useT();

  const SOCIALS = [
    { name: "LinkedIn",  descKey: "contact.social.li", href: "https://linkedin.com/company/saim-ai", icon: <LinkedInSvg />, color: "#0A66C2", bg: "#EBF3FB" },
    { name: "Facebook",  descKey: "contact.social.fb", href: "https://facebook.com/saimai",           icon: <FacebookSvg />, color: "#1877F2", bg: "#EBF1FE" },
    { name: "TikTok",    descKey: "contact.social.tt", href: "https://tiktok.com/@saimai",            icon: <TikTokSvg />,   color: "#141413", bg: "#F0EEE9" },
    { name: "WhatsApp",  descKey: "contact.social.wa", href: "https://wa.me/237690000000",            icon: <WhatsAppSvg />, color: "#25D366", bg: "#EAFBF1" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  return (
    <div style={{ background: "#FBFAF7", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <ContactNav />

      {/* ── Hero ── */}
      <section style={{ background: "#FBFAF7", padding: isMobile ? "56px 24px 48px" : "80px 48px 72px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" as const }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 20 }}>
            {t("contact.kicker")}
          </div>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: isMobile ? 36 : 56,
            fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.05,
            color: "#141413", margin: "0 0 20px",
          }}>
            {t("contact.h1.l1")}<br />
            <em style={{ fontStyle: "italic", color: SAIM.accent }}>{t("contact.h1.em")}</em>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#73726C", margin: 0 }}>
            {t("contact.sub.l1")}<br />{t("contact.sub.l2")}
          </p>
        </div>
      </section>

      {/* ── Contenu ── */}
      <section style={{ padding: isMobile ? "0 24px 80px" : "0 48px 96px" }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isSmall ? "1fr" : "1.1fr 0.9fr",
          gap: isSmall ? 48 : 72,
          alignItems: "start",
        }}>

          {/* ── Formulaire ── */}
          <div>
            <div style={{
              background: "#ffffff",
              border: "1px solid #E8E6E1",
              borderRadius: 20,
              padding: isMobile ? "28px 20px" : "40px 36px",
              boxShadow: "0 4px 24px rgba(20,20,19,0.06)",
            }}>
              {sent ? (
                <div style={{ textAlign: "center" as const, padding: "40px 0" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EAFBF1", border: "2px solid #25D366", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 400, color: "#141413", margin: "0 0 10px" }}>{t("contact.sent.t")}</h3>
                  <p style={{ fontSize: 15, color: "#73726C", lineHeight: 1.6, margin: "0 0 24px" }}>
                    {t("contact.sent.d")}
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    style={{ background: "none", border: "1px solid #D9D8D5", borderRadius: 10, padding: "10px 20px", fontSize: 14, color: "#73726C", cursor: "pointer", fontFamily: "'Inter Tight', system-ui, sans-serif" }}
                  >
                    {t("contact.sent.again")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                    <Field label={t("contact.fname")} placeholder={t("contact.fname.ph")} required />
                    <Field label={t("contact.lname")} placeholder={t("contact.lname.ph")} required />
                  </div>
                  <Field label={t("contact.email")} type="email" placeholder={t("contact.email.ph")} required />
                  <Field label={t("contact.subject")} placeholder={t("contact.subject.ph")} required />
                  <Field label={t("contact.message")} placeholder={t("contact.message.ph")} rows={5} required />

                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      width: "100%", padding: "15px 0", borderRadius: 12,
                      background: sending ? "#73726C" : "#141413",
                      color: "#FBFAF7", border: "none",
                      fontSize: 15, fontWeight: 600, cursor: sending ? "default" : "pointer",
                      fontFamily: "'Inter Tight', system-ui, sans-serif",
                      transition: "background 0.15s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    {sending ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBFAF7" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        {t("contact.submit")}
                      </>
                    )}
                  </button>

                  <p style={{ fontSize: 12, color: "#A8A5A0", textAlign: "center" as const, margin: 0, lineHeight: 1.5 }}>
                    {t("contact.privacy")}{" "}
                    <Link href="#" style={{ color: "#73726C", textDecoration: "underline" }}>{t("contact.privacy.link")}</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* ── Coordonnées + Réseaux ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Email direct */}
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#73726C", marginBottom: 16 }}>
                {t("contact.direct")}
              </div>
              <a href="mailto:partners@mysaim.cm" style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 20px", borderRadius: 14,
                background: "#ffffff", border: "1px solid #E8E6E1",
                textDecoration: "none", color: "#141413",
                transition: "box-shadow 0.15s",
                boxShadow: "0 2px 8px rgba(20,20,19,0.04)",
              }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(20,20,19,0.09)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(20,20,19,0.04)")}
              >
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "#F0EEE9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: SAIM.accent }}>
                  <MailSvg />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#73726C", marginBottom: 2 }}>Email</div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>partners@mysaim.cm</div>
                </div>
              </a>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#73726C", marginBottom: 16 }}>
                {t("contact.socials")}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SOCIALS.map(s => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 18px", borderRadius: 14,
                      background: "#ffffff", border: "1px solid #E8E6E1",
                      textDecoration: "none", color: "#141413",
                      transition: "box-shadow 0.15s, border-color 0.15s",
                      boxShadow: "0 2px 8px rgba(20,20,19,0.04)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(20,20,19,0.09)";
                      e.currentTarget.style.borderColor = "#D9D8D5";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(20,20,19,0.04)";
                      e.currentTarget.style.borderColor = "#E8E6E1";
                    }}
                  >
                    <div style={{
                      width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                      background: s.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: s.color,
                    }}>
                      {s.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#141413", marginBottom: 2 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "#73726C" }}>{t(s.descKey)}</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D9D8D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Horaires */}
            <div style={{
              padding: "20px 22px", borderRadius: 14,
              background: "rgba(194,86,44,0.05)",
              border: "1px solid rgba(194,86,44,0.15)",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: SAIM.accent, marginBottom: 12 }}>
                {t("contact.hours")}
              </div>
              <div style={{ fontSize: 14, color: "#141413", lineHeight: 1.7 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#73726C" }}>{t("contact.weekdays")}</span>
                  <span style={{ fontWeight: 500 }}>8h – 18h</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#73726C" }}>SAIM AI (agent)</span>
                  <span style={{ fontWeight: 500, color: SAIM.accent }}>{t("contact.247")}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
