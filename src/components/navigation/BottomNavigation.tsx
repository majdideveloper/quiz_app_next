'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

export default function BottomNavigation() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const navItems = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: '🏠',
      activeIcon: '🏠'
    },
    {
      name: t('nav.courses'),
      href: '/courses',
      icon: '📚',
      activeIcon: '📚'
    },
    {
      name: t('nav.quizzes'),
      href: '/quizzes',
      icon: '📝',
      activeIcon: '📝'
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: '📰',
      activeIcon: '📰'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <nav className="flex justify-around py-2">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-xl mb-1">
                {active ? item.activeIcon : item.icon}
              </span>
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}