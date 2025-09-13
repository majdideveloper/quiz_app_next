'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Post } from '@/types'
import { notFound } from 'next/navigation'
import BlogPostForm from '@/components/admin/BlogPostForm'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const resolvedParams = use(params)

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error || !data) {
        notFound()
      }

      setPost(data)
    } catch (error) {
      console.error('Failed to fetch post:', error)
    } finally {
      setLoading(false)
    }
  }, [resolvedParams.id])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!post) {
    return null
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Post</h1>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="p-6">
              <BlogPostForm post={post} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
