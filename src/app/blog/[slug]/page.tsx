'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Post } from '@/types'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, Clock, User } from 'lucide-react'

export default function PostPage() {
  const params = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [author, setAuthor] = useState<string>('Admin')

  useEffect(() => {
    if (params.slug) {
      fetchPost()
    }
  }, [params.slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      
      // First, fetch the post - try exact match first, then fuzzy match
      let { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', params.slug)
        .single()

      // If exact match fails, try to find posts with similar slugs (handle trailing spaces, etc.)
      if (postError && postError.code === 'PGRST116') {
        console.log('Exact slug match failed, trying fuzzy match...')
        const { data: allPosts, error: allError } = await supabase
          .from('posts')
          .select('*')
        
        if (!allError && allPosts) {
          // Find a post that matches when trimmed
          postData = allPosts.find(post => 
            post.slug.trim() === params.slug || 
            post.slug === params.slug ||
            post.slug.trim().toLowerCase() === params.slug.toLowerCase()
          )
          
          if (postData) {
            console.log('Found post with fuzzy matching:', postData.title)
            postError = null // Clear the error since we found a match
          }
        }
      }

      if (postError) {
        console.error('Failed to fetch post:', postError)
        notFound()
        return
      }

      if (!postData) {
        notFound()
        return
      }

      setPost(postData)

      // Then, fetch the author information separately
      if (postData.author_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', postData.author_id)
          .single()

        if (profileData?.full_name) {
          setAuthor(profileData.full_name)
        }
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
            
            {/* Featured image skeleton */}
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            
            {/* Title skeleton */}
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            
            {/* Meta info skeleton */}
            <div className="flex gap-4 mb-8">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-5/6"></div>
              <div className="h-6 bg-gray-200 rounded w-4/6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Featured Image */}
          {post.image_url && (
            <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 overflow-hidden">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8 lg:p-12">
            {/* Category Badge */}
            {post.category && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Tag className="w-4 h-4 mr-1" />
                  {post.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By {author}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getReadingTime(post.content)} min read</span>
              </div>

              {post.updated_at && post.updated_at !== post.created_at && (
                <div className="flex items-center gap-2 text-blue-600">
                  <span>Updated {formatDate(post.updated_at)}</span>
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </article>

        {/* Back to Blog CTA */}
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Read More Articles
          </Link>
        </div>
      </div>
    </div>
  )
}
