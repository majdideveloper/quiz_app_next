'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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

  if (user) {
    return null // Will redirect based on role
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ 
        maxWidth: '28rem', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2rem' 
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            color: '#111827' 
          }}>
            🧠 Quiz App
          </h1>
          <p style={{ 
            marginTop: '0.5rem', 
            textAlign: 'center', 
            color: '#6b7280' 
          }}>
            Canadian Employee Training Platform
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link 
            href="/auth/login" 
            className="btn-primary"
            style={{ 
              width: '100%', 
              display: 'block', 
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            Sign In
          </Link>
          
          <Link 
            href="/auth/register" 
            className="btn-secondary"
            style={{ 
              width: '100%', 
              display: 'block', 
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  )
}