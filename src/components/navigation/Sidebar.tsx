'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const { t } = useTranslation()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const mainNavItems = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: '🏠',
      description: 'Voir votre progression d\'apprentissage',
      section: 'general'
    }
  ]

  const learningNavItems = [
    {
      name: t('nav.courses'),
      href: '/courses',
      icon: '📚',
      description: 'Parcourir et s\'inscrire aux cours',
      section: 'learning'
    },
    {
      name: t('nav.quizzes'),
      href: '/quizzes',
      icon: '📝',
      description: 'Passer des quiz et tester vos connaissances',
      section: 'learning'
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: '📰',
      description: 'Lire nos derniers articles',
      section: 'learning'
    }
  ]

  const progressNavItems: any[] = []

  const adminNavItems = profile?.role === 'admin' ? [
    {
      name: 'Tableau de bord admin',
      href: '/admin/dashboard',
      icon: '⚙️',
      description: 'Gérer les cours et les utilisateurs'
    },
    {
      name: 'Analyses',
      href: '/admin/analytics',
      icon: '📊',
      description: 'Voir les analyses de performance'
    },
    {
      name: 'Gestion FAQ',
      href: '/admin/faqs',
      icon: '❓',
      description: 'Gérer les FAQ de la page d\'accueil'
    }
  ] : []

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Centre d&apos;apprentissage</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Bienvenue, {profile?.full_name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {/* Dashboard */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Vue d&apos;ensemble
              </h2>
              {mainNavItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center p-3 rounded-lg transition-colors group
                      ${active
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-600">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Learning Section */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                📖 Apprentissage
              </h2>
              {learningNavItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center p-3 rounded-lg transition-colors group border-l-4
                      ${active
                        ? 'bg-blue-50 text-blue-700 border-blue-500'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-transparent hover:border-blue-300'
                      }
                    `}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 group-hover:text-blue-600">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>


            {/* Admin Navigation */}
            {adminNavItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Administration
                </h2>
                {adminNavItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center p-3 rounded-lg transition-colors group
                        ${active
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <span className="text-xl mr-3">{item.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-600">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </nav>

        </div>
      </div>
    </>
  )
}