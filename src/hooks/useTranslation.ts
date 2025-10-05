'use client'

import { createContext, useContext } from 'react'
import { translations, TranslationKey } from '@/lib/i18n/translations'

interface TranslationContextType {
  t: (key: TranslationKey) => string
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    // Fallback when not in provider context - return French translations
    return {
      t: (key: TranslationKey) => translations[key] || key
    }
  }
  return context
}

export function useTranslationState() {
  const t = (key: TranslationKey): string => {
    return translations[key] || key
  }

  return {
    t
  }
}