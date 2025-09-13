'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { translations, Language, TranslationKey } from '@/lib/i18n/translations'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    // Fallback when not in provider context
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: TranslationKey) => translations.en[key] || key
    }
  }
  return context
}

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  
  // Check localStorage first
  const stored = localStorage.getItem('language')
  if (stored && (stored === 'en' || stored === 'fr')) {
    return stored as Language
  }
  
  // Check browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('fr')) return 'fr'
  
  return 'en'
}

export function useTranslationState() {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    setLanguageState(getInitialLanguage())
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      document.documentElement.lang = lang
    }
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return {
    language,
    setLanguage,
    t
  }
}