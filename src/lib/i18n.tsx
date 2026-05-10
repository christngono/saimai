"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Lang } from "./translations";

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; }
const LangContext = createContext<LangCtx>({ lang: "fr", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("saim-lang") as Lang | null;
    if (saved === "fr" || saved === "en") setLang(saved);
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("saim-lang", l);
  };

  return <LangContext.Provider value={{ lang, setLang: changeLang }}>{children}</LangContext.Provider>;
}

export function useLang() { return useContext(LangContext); }

export function useT() {
  const { lang } = useLang();
  return (key: string) => translations[key]?.[lang] ?? key;
}
