'use client'

import BlogPostForm from '@/components/admin/BlogPostForm'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function CreatePostPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Post</h1>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="p-6">
              <BlogPostForm />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
