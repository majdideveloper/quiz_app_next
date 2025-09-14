import { supabase } from './client'
import type { FAQ } from '@/types'

// FAQ Management Functions
export async function getFAQs(includeUnpublished = false): Promise<FAQ[]> {
  let query = supabase
    .from('faqs')
    .select('*')
    .order('order_index', { ascending: true })
  
  if (!includeUnpublished) {
    query = query.eq('is_published', true)
  }
  
  const { data, error } = await query
  
  if (error) {
    throw new Error(`Failed to fetch FAQs: ${error.message}`)
  }
  
  return data || []
}

export async function getAdminFAQs(): Promise<FAQ[]> {
  return getFAQs(true)
}

export async function createFAQ(faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<FAQ> {
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('User must be authenticated to create FAQs')
  }
  
  const { data, error } = await supabase
    .from('faqs')
    .insert([{ ...faq, created_by: user.id }])
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to create FAQ: ${error.message}`)
  }
  
  return data
}

export async function updateFAQ(id: string, updates: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>>): Promise<FAQ> {
  const { data, error } = await supabase
    .from('faqs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to update FAQ: ${error.message}`)
  }
  
  return data
}

export async function deleteFAQ(id: string): Promise<void> {
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id)
  
  if (error) {
    throw new Error(`Failed to delete FAQ: ${error.message}`)
  }
}

export async function reorderFAQs(faqOrders: { id: string; order_index: number }[]): Promise<void> {
  // Update multiple FAQs with new order indices
  const updates = faqOrders.map(({ id, order_index }) => 
    supabase
      .from('faqs')
      .update({ order_index })
      .eq('id', id)
  )
  
  const results = await Promise.all(updates)
  
  const errors = results.filter(result => result.error)
  if (errors.length > 0) {
    throw new Error(`Failed to reorder FAQs: ${errors.map(e => e.error?.message).join(', ')}`)
  }
}

export async function toggleFAQPublished(id: string, is_published: boolean): Promise<FAQ> {
  return updateFAQ(id, { is_published })
}