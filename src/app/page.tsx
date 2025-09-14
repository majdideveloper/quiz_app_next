'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LandingLayout from '@/components/landing/LandingLayout'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Benefits from '@/components/landing/Benefits'
import Testimonials from '@/components/landing/Testimonials'
import Pricing from '@/components/landing/Pricing'
import FAQ from '@/components/landing/FAQ'
import CTA from '@/components/landing/CTA'

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) {
      return
    }

    if (!user) {
      return
    }

    if (!profile) {
      return
    }

    // Redirect authenticated users to their appropriate dashboard
    const currentPath = window.location.pathname
    
    if (currentPath === '/') {
      const targetPath = profile.role === 'admin' ? '/admin/dashboard' : '/dashboard'
      router.replace(targetPath)
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect based on role
  }

  // Show landing page for unauthenticated users
  return (
    <LandingLayout>
      <Hero />
      <Features />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </LandingLayout>
  )
}