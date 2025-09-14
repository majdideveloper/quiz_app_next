'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import FAQManager from '@/components/admin/FAQManager'
import FAQForm from '@/components/admin/FAQForm'
import { useAdminFAQs } from '@/hooks/useFAQs'
import type { FAQ } from '@/types'

export default function AdminFAQsPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const { 
    faqs, 
    loading, 
    error, 
    actionLoading,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    reorderFAQs,
    togglePublished
  } = useAdminFAQs()

  const handleCreateFAQ = async (faqData: Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    const success = await createFAQ(faqData)
    if (success) {
      setIsCreating(false)
    }
    return success
  }

  const handleUpdateFAQ = async (id: string, updates: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>>) => {
    const success = await updateFAQ(id, updates)
    if (success) {
      setEditingFAQ(null)
    }
    return success
  }

  const handleDeleteFAQ = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      return await deleteFAQ(id)
    }
    return false
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
              <p className="text-gray-600 mt-2">
                Manage frequently asked questions that appear on the landing page
              </p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              disabled={actionLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
            >
              + Create FAQ
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-red-800 font-medium">Error loading FAQs</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total FAQs</p>
                <p className="text-2xl font-bold text-gray-900">{faqs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {faqs.filter(faq => faq.is_published).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {faqs.filter(faq => !faq.is_published).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Form Modal */}
        {(isCreating || editingFAQ) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <FAQForm
                faq={editingFAQ}
                onSubmit={editingFAQ ? 
                  (data) => handleUpdateFAQ(editingFAQ.id, data) : 
                  handleCreateFAQ
                }
                onCancel={() => {
                  setIsCreating(false)
                  setEditingFAQ(null)
                }}
                loading={actionLoading}
              />
            </div>
          </div>
        )}

        {/* FAQ Manager */}
        <div className="bg-white rounded-lg border border-gray-200">
          <FAQManager
            faqs={faqs}
            loading={loading}
            onEdit={setEditingFAQ}
            onDelete={handleDeleteFAQ}
            onReorder={reorderFAQs}
            onTogglePublished={togglePublished}
            actionLoading={actionLoading}
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}