'use client'

import { useTranslation } from '@/hooks/useTranslation'

interface LanguageSwitcherProps {
  className?: string
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useTranslation()

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
          language === 'fr'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
        aria-label="Passer au français"
      >
        FR
      </button>
    </div>
  )
}