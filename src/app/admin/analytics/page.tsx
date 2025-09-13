'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard'

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights into course performance and user engagement
            </p>
          </div>
          
          <AdminAnalyticsDashboard />
        </div>
      </div>
    </ProtectedRoute>
  )
}