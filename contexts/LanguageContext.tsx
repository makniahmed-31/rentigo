"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import fr from "@/messages/fr.json"
import ar from "@/messages/ar.json"

export type Language = "fr" | "ar"
export type Messages = typeof fr

const messages: Record<Language, Messages> = { fr, ar }

interface LanguageContextType {
  lang: Language
  t: Messages
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  t: fr,
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("fr")

  useEffect(() => {
    const saved = localStorage.getItem("rentigo-lang") as Language
    if (saved === "fr" || saved === "ar") setLangState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (l: Language) => {
    setLangState(l)
    localStorage.setItem("rentigo-lang", l)
  }

  return (
    <LanguageContext.Provider value={{ lang, t: messages[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
