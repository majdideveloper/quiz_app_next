'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async (userId: string, retryCount = 0) => {
      try {
        console.log(`Loading profile for user: ${userId} (attempt ${retryCount + 1})`)

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) {
          console.error('Error loading profile:', error)
          // If profile doesn't exist, create it (fallback)
          if (error.code === 'PGRST116' && retryCount < 2) {
            console.log(`Profile not found, retrying in ${(retryCount + 1) * 500}ms...`)
            setTimeout(() => loadProfile(userId, retryCount + 1), (retryCount + 1) * 500)
            return
          } else {
            console.error('Failed to load profile after retries')
            setProfile(null)
            setLoading(false) // Stop loading even on error
          }
        } else {
          console.log('Profile loaded successfully:', {
            id: profile.id,
            email: profile.email,
            role: profile.role,
            full_name: profile.full_name
          })
          setProfile(profile)
          setLoading(false)
        }
      } catch (err) {
        console.error('Profile loading error:', err)
        if (retryCount < 2) {
          console.log(`Retrying profile load due to error in ${(retryCount + 1) * 500}ms...`)
          setTimeout(() => loadProfile(userId, retryCount + 1), (retryCount + 1) * 500)
        } else {
          setProfile(null)
          setLoading(false) // Stop loading even on error
        }
      }
    }

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      } catch (err) {
        console.error('Session error:', err)
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    }

    // Set a maximum timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth loading timeout - stopping loading state')
      setLoading(false)
    }, 10000) // 10 seconds max

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }
        
        setUser(session?.user ?? null)
        
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          await loadProfile(session.user.id)
        } else if (!session?.user) {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      clearTimeout(loadingTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setLoading(false)
        return { error: error.message }
      }
      
      // Don't set loading to false here - let the auth state change handler do it
      return {}
    } catch (err) {
      setLoading(false)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      if (error) {
        setLoading(false)
        return { error: error.message }
      }
      
      // Don't set loading to false here - let the auth state change handler do it
      return {}
    } catch (err) {
      setLoading(false)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    try {
      console.log('Starting logout process...')
      
      // Set loading to true to prevent any redirects during logout
      setLoading(true)
      
      // Sign out from Supabase first
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
      
      // Clear the profile state
      setProfile(null)
      setUser(null)
      
      // Clear all possible cached data
      if (typeof window !== 'undefined') {
        // Clear localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
        
        // Clear sessionStorage
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            sessionStorage.removeItem(key)
          }
        })
      }
      
      console.log('Logout completed, redirecting...')
      
      // Small delay to ensure state is cleared, then redirect
      setTimeout(() => {
        const timestamp = Date.now()
        window.location.replace(`/?t=${timestamp}`)
      }, 100)
      
    } catch (error) {
      console.error('Error during logout:', error)
      // Clear state even on error
      setProfile(null)
      setUser(null)
      setLoading(false)
      
      // Force redirect even if there's an error with timestamp
      setTimeout(() => {
        const timestamp = Date.now()
        window.location.replace(`/?t=${timestamp}`)
      }, 100)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}