'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { UserCircle, LogOut } from 'lucide-react'
import Sidebar from './Sidebar'
import BottomNavigation from './BottomNavigation'
import SkipLink from '@/components/accessibility/SkipLink'
import { useTranslation } from '@/hooks/useTranslation'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth()
  const { t } = useTranslation()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SkipLink />

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">Learning Hub</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="View profile"
            >
              <UserCircle size={24} className="text-gray-700" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar - always visible on desktop */}
        <div className="hidden md:block w-80 flex-shrink-0">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Desktop Header */}
          <div className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-end px-6 py-3 gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                aria-label="View profile"
              >
                <UserCircle size={20} />
                <span className="text-sm font-medium">{t('nav.profile')}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                aria-label="Logout"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">{t('nav.logout')}</span>
              </button>
            </div>
          </div>

          <main id="main-content" className="pb-16 md:pb-0">
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  )
}