'use client'

import { TranslationContext, useTranslationState } from '@/hooks/useTranslation'

interface TranslationProviderProps {
  children: React.ReactNode
}

export default function TranslationProvider({ children }: TranslationProviderProps) {
  const translationState = useTranslationState()

  return (
    <TranslationContext.Provider value={translationState}>
      {children}
    </TranslationContext.Provider>
  )
}