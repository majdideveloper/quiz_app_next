'use client'

import { ReactNode } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'

interface LandingLayoutProps {
  children: ReactNode
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="relative">
        {children}
      </main>
      <Footer />
    </div>
  )
}