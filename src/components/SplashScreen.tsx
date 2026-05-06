"use client";

import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("saim_splash")) return;
    sessionStorage.setItem("saim_splash", "1");
    setVisible(true);
    const t1 = setTimeout(() => setFading(true),  1300);
    const t2 = setTimeout(() => setVisible(false), 1850);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#FBFAF7",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
      opacity: fading ? 0 : 1,
      transition: fading ? "opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
      pointerEvents: "none",
    }}>
      <div style={{ animation: "splashLogoIn 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>
        <img src="/simplelogo.svg" height={64} alt="SAIM AI" style={{ display: "block" }} />
      </div>
      <div style={{
        display: "flex", gap: 6,
        animation: "splashLogoIn 0.75s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: "50%", background: "#C2562C",
            animation: `dotBounce 1.1s ${i * 0.14}s infinite ease-in-out`,
          }} />
        ))}
      </div>
    </div>
  );
}
