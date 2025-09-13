'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) {
      return
    }

    const currentPath = window.location.pathname

    if (!user) {
      if (currentPath !== redirectTo && !currentPath.startsWith('/auth')) {
        router.replace(redirectTo)
      }
      return
    }

    if (!profile) {
      // Wait for profile to load, but don't redirect yet
      return
    }

    // Check if user has required role
    if (requiredRole && profile.role !== requiredRole) {
      // Only redirect if we're not already on the correct page
      const targetPath = profile.role === 'admin' ? '/admin/dashboard' : '/dashboard'
      if (currentPath !== targetPath) {
        router.replace(targetPath)
      }
      return
    }

    // If no specific role required, user has access
  }, [user, profile, loading, requiredRole, redirectTo, router])

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{
          width: '8rem',
          height: '8rem',
          border: '2px solid #e5e7eb',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user || (requiredRole && profile?.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}