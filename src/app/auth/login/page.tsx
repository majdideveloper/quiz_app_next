'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user, profile, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user && profile) {
      const targetPath = profile.role === 'admin' ? '/admin/dashboard' : '/dashboard'
      router.replace(targetPath)
    }
  }, [user, profile, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error)
        setLoading(false)
      } else {
        // Wait a moment for the auth state to update, then redirect will happen via useEffect
        console.log('Login successful, waiting for profile to load...')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f9fafb', 
      padding: '3rem 1rem' 
    }}>
      <div style={{ 
        maxWidth: '28rem', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2rem' 
      }}>
        <div>
          <h2 style={{ 
            marginTop: '1.5rem', 
            textAlign: 'center', 
            fontSize: '1.875rem', 
            fontWeight: '800', 
            color: '#111827' 
          }}>
            Sign in to your account
          </h2>
          <p style={{ 
            marginTop: '0.5rem', 
            textAlign: 'center', 
            fontSize: '0.875rem', 
            color: '#6b7280' 
          }}>
            Or{' '}
            <Link 
              href="/auth/register" 
              style={{ 
                fontWeight: '500', 
                color: '#2563eb', 
                textDecoration: 'none' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form 
          style={{ 
            marginTop: '2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem' 
          }} 
          onSubmit={handleSubmit}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'none' }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                style={{
                  appearance: 'none',
                  borderRadius: '0.375rem',
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  color: '#111827',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div>
              <label htmlFor="password" style={{ display: 'none' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                style={{
                  appearance: 'none',
                  borderRadius: '0.375rem',
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  color: '#111827',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          {error && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.75rem 1rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: '0.375rem',
                color: 'white',
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                cursor: loading ? 'not-allowed' : 'pointer',
                outline: 'none',
                transition: 'background-color 0.2s ease',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}