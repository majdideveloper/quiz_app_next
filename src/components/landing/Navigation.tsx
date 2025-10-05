'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  const navigationItems = [
    { name: t('features'), href: '#features' },
    { name: t('pricing'), href: '#pricing' },
    { name: t('about'), href: '#about' },
    { name: t('contact'), href: '#contact' }
  ]

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl">🧠</div>
              <span className="text-xl font-bold text-gray-900">QuizPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              {t('signIn')}
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              {t('getStarted')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3 bg-gray-50 border-t">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-base font-medium mx-3 text-center transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('getStarted')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}