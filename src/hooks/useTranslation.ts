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
    // Fallback when not in provider context - default to French
    return {
      language: 'fr' as Language,
      setLanguage: () => {},
      t: (key: TranslationKey) => translations.fr[key] || key
    }
  }
  return context
}

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'fr'

  // Check localStorage first
  const stored = localStorage.getItem('language')
  if (stored && (stored === 'en' || stored === 'fr')) {
    return stored as Language
  }

  // Default to French
  return 'fr'
}

export function useTranslationState() {
  const [language, setLanguageState] = useState<Language>('fr')

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
    return translations[language][key] || translations.fr[key] || key
  }

  return {
    language,
    setLanguage,
    t
  }
}