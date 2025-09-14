'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { getFAQs, getAdminFAQs, createFAQ, updateFAQ, deleteFAQ, reorderFAQs, toggleFAQPublished } from '@/lib/supabase/admin'
import type { FAQ } from '@/types'

interface UseFAQsOptions {
  includeUnpublished?: boolean
  realtime?: boolean
}

export function useFAQs(options: UseFAQsOptions = {}) {
  const { includeUnpublished = false, realtime = true } = options
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch FAQs
  const fetchFAQs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = includeUnpublished ? await getAdminFAQs() : await getFAQs()
      setFaqs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch FAQs')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchFAQs()
  }, [includeUnpublished])

  // Real-time subscription
  useEffect(() => {
    if (!realtime) return

    const subscription = supabase
      .channel('faqs')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'faqs' },
        (payload) => {
          console.log('FAQ change:', payload)
          fetchFAQs() // Refetch on any change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [realtime, includeUnpublished])

  return {
    faqs,
    loading,
    error,
    refetch: fetchFAQs
  }
}

// Hook specifically for admin usage with management functions
export function useAdminFAQs() {
  const { faqs, loading, error, refetch } = useFAQs({ 
    includeUnpublished: true, 
    realtime: true 
  })
  const [actionLoading, setActionLoading] = useState(false)

  const handleCreateFAQ = async (faqData: Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      setActionLoading(true)
      await createFAQ(faqData)
      await refetch()
      return true
    } catch (err) {
      console.error('Failed to create FAQ:', err)
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateFAQ = async (id: string, updates: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>>) => {
    try {
      setActionLoading(true)
      await updateFAQ(id, updates)
      await refetch()
      return true
    } catch (err) {
      console.error('Failed to update FAQ:', err)
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteFAQ = async (id: string) => {
    try {
      setActionLoading(true)
      await deleteFAQ(id)
      await refetch()
      return true
    } catch (err) {
      console.error('Failed to delete FAQ:', err)
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const handleReorderFAQs = async (faqOrders: { id: string; order_index: number }[]) => {
    try {
      setActionLoading(true)
      await reorderFAQs(faqOrders)
      await refetch()
      return true
    } catch (err) {
      console.error('Failed to reorder FAQs:', err)
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const handleTogglePublished = async (id: string, is_published: boolean) => {
    try {
      setActionLoading(true)
      await toggleFAQPublished(id, is_published)
      await refetch()
      return true
    } catch (err) {
      console.error('Failed to toggle FAQ publication:', err)
      return false
    } finally {
      setActionLoading(false)
    }
  }

  return {
    faqs,
    loading,
    error,
    actionLoading,
    refetch,
    createFAQ: handleCreateFAQ,
    updateFAQ: handleUpdateFAQ,
    deleteFAQ: handleDeleteFAQ,
    reorderFAQs: handleReorderFAQs,
    togglePublished: handleTogglePublished
  }
}

// Hook for public landing page usage
export function usePublicFAQs() {
  return useFAQs({ 
    includeUnpublished: false, 
    realtime: false // Less aggressive for public use
  })
}