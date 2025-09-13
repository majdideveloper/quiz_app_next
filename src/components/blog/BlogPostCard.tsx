'use client'

import Link from 'next/link'
import { Clock, Calendar, Eye, Tag } from 'lucide-react'
import { Post } from '@/types'

interface BlogPostCardProps {
  post: Post
  listView?: boolean
}

export default function BlogPostCard({ post, listView = false }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const getStatusBadge = () => {
    if (post.published === true) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✓ Published
        </span>
      )
    }
    if (post.published === false) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          📝 Draft
        </span>
      )
    }
    // For posts without published field (legacy), assume they are published
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✓ Published
      </span>
    )
  }

  const getCategoryBadge = () => {
    const categoryColors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Business': 'bg-purple-100 text-purple-800',
      'Health': 'bg-green-100 text-green-800',
      'Education': 'bg-orange-100 text-orange-800',
      'Lifestyle': 'bg-pink-100 text-pink-800'
    }
    
    const colorClass = categoryColors[post.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        <Tag className="w-3 h-3 mr-1" />
        {post.category}
      </span>
    )
  }

  if (listView) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Section */}
              {post.image_url && (
                <div className="lg:w-64 flex-shrink-0">
                  <div className="relative w-full h-48 lg:h-40 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {getStatusBadge()}
                  {getCategoryBadge()}
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {post.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{getReadingTime(post.content)} min read</span>
                  </div>
                  {post.updated_at && post.updated_at !== post.created_at && (
                    <span className="text-blue-600">Updated: {formatDate(post.updated_at)}</span>
                  )}
                </div>
              </div>

              {/* Action Section */}
              <div className="flex-shrink-0 lg:w-auto">
                <div className="flex lg:flex-col gap-2">
                  <span className="inline-flex items-center justify-center w-full lg:w-20 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                    Read More
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  // Grid card view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image Section */}
        {post.image_url && (
          <div className="relative h-48 bg-gray-100 overflow-hidden">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3">
              {getStatusBadge()}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            {getCategoryBadge()}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{getReadingTime(post.content)} min</span>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            {post.updated_at && post.updated_at !== post.created_at && (
              <span className="text-blue-600">Updated</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="w-3 h-3" />
              <span>View Article</span>
            </div>
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <span className="text-blue-600 text-sm">→</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
