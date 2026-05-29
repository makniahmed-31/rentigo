"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import fr from "@/messages/fr.json"
import en from "@/messages/en.json"

export type Language = "fr" | "en"
export type Messages = typeof fr

const messages: Record<Language, Messages> = { fr, en }

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
    if (saved === "fr" || saved === "en") setLangState(saved)
  }, [])

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
