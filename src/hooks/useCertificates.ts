'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase/client'
import { Course, QuizAttempt, Profile } from '@/types'

interface Certificate {
  id: string
  user_id: string
  course_id: string
  certificate_id: string
  score: number
  issued_at: string
  course: Course
  user: Profile
}

export function useCertificates() {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    
    fetchCertificates()
  }, [user])

  const fetchCertificates = async () => {
    if (!user) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses(*),
          profiles(*)
        `)
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch certificates:', error)
        return
      }

      setCertificates(data || [])
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCertificateId = () => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `CERT-${timestamp}-${random}`.toUpperCase()
  }

  const issueCertificate = async (courseId: string, score: number): Promise<string | null> => {
    if (!user) return null

    try {
      // Check if certificate already exists
      const { data: existing } = await supabase
        .from('certificates')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

      if (existing) {
        return existing.id
      }

      // Generate new certificate
      const certificateId = generateCertificateId()
      
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          user_id: user.id,
          course_id: courseId,
          certificate_id: certificateId,
          score,
          issued_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to issue certificate:', error)
        return null
      }

      // Refresh certificates list
      await fetchCertificates()
      
      return data.id
    } catch (error) {
      console.error('Failed to issue certificate:', error)
      return null
    }
  }

  const getCertificateData = async (certificateId: string) => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses(*),
          profiles(*)
        `)
        .eq('id', certificateId)
        .single()

      if (error) {
        console.error('Failed to fetch certificate:', error)
        return null
      }

      return {
        user: data.profiles,
        course: data.courses,
        completionDate: data.issued_at,
        score: data.score,
        certificateId: data.certificate_id
      }
    } catch (error) {
      console.error('Failed to fetch certificate:', error)
      return null
    }
  }

  const verifyCertificate = async (certificateId: string) => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses(title),
          profiles(full_name)
        `)
        .eq('certificate_id', certificateId)
        .single()

      if (error || !data) {
        return { valid: false, message: 'Certificate not found' }
      }

      return {
        valid: true,
        data: {
          userName: data.profiles.full_name,
          courseName: data.courses.title,
          score: data.score,
          issuedAt: data.issued_at
        }
      }
    } catch (error) {
      return { valid: false, message: 'Verification failed' }
    }
  }

  return {
    certificates,
    loading,
    issueCertificate,
    getCertificateData,
    verifyCertificate,
    refreshCertificates: fetchCertificates
  }
}