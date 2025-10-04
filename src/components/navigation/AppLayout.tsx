'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { UserCircle } from 'lucide-react'
import Sidebar from './Sidebar'
import BottomNavigation from './BottomNavigation'
import SkipLink from '@/components/accessibility/SkipLink'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth()

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
          <Link
            href="/profile"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="View profile"
          >
            <UserCircle size={28} className="text-gray-700" />
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar - always visible on desktop */}
        <div className="hidden md:block w-80 flex-shrink-0">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
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