'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Sidebar from './Sidebar'
import BottomNavigation from './BottomNavigation'
import SkipLink from '@/components/accessibility/SkipLink'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <span className="text-xl">☰</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Learning Hub</h1>
          <div className="w-10 h-10"></div> {/* Spacer for balance */}
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar - always visible on desktop */}
        <div className="hidden md:block w-80 flex-shrink-0">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>

        {/* Mobile Sidebar - only shows when hamburger is clicked */}
        <div className="md:hidden">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
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