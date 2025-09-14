'use client'

import { useState } from 'react'
import type { FAQ } from '@/types'

interface FAQManagerProps {
  faqs: FAQ[]
  loading: boolean
  onEdit: (faq: FAQ) => void
  onDelete: (id: string) => Promise<boolean>
  onReorder: (faqOrders: { id: string; order_index: number }[]) => Promise<boolean>
  onTogglePublished: (id: string, is_published: boolean) => Promise<boolean>
  actionLoading: boolean
}

export default function FAQManager({
  faqs,
  loading,
  onEdit,
  onDelete,
  onReorder,
  onTogglePublished,
  actionLoading
}: FAQManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  // Filter FAQs based on search and status
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (faq.question_fr && faq.question_fr.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (faq.answer_fr && faq.answer_fr.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'published' && faq.is_published) ||
                         (filterStatus === 'draft' && !faq.is_published)
    
    return matchesSearch && matchesStatus
  })

  const handleMoveUp = async (faq: FAQ) => {
    const currentIndex = faqs.findIndex(f => f.id === faq.id)
    if (currentIndex > 0) {
      const newOrders = faqs.map((f, index) => {
        if (index === currentIndex) return { id: f.id, order_index: f.order_index - 1 }
        if (index === currentIndex - 1) return { id: f.id, order_index: f.order_index + 1 }
        return { id: f.id, order_index: f.order_index }
      })
      await onReorder(newOrders)
    }
  }

  const handleMoveDown = async (faq: FAQ) => {
    const currentIndex = faqs.findIndex(f => f.id === faq.id)
    if (currentIndex < faqs.length - 1) {
      const newOrders = faqs.map((f, index) => {
        if (index === currentIndex) return { id: f.id, order_index: f.order_index + 1 }
        if (index === currentIndex + 1) return { id: f.id, order_index: f.order_index - 1 }
        return { id: f.id, order_index: f.order_index }
      })
      await onReorder(newOrders)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading FAQs...</p>
      </div>
    )
  }

  if (faqs.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs yet</h3>
        <p className="text-gray-600">Create your first FAQ to get started.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All FAQs</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="divide-y divide-gray-200">
        {filteredFAQs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No FAQs match your current filters.</p>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => (
            <div key={faq.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Status Badge */}
                  <div className="flex items-center mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      faq.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {faq.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      Order: {faq.order_index}
                    </span>
                  </div>

                  {/* Question */}
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  
                  {/* Answer Preview */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {faq.answer}
                  </p>

                  {/* French Content Indicator */}
                  {(faq.question_fr || faq.answer_fr) && (
                    <div className="flex items-center text-xs text-blue-600 mb-2">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                      French translation available
                    </div>
                  )}

                  {/* Metadata */}
                  <p className="text-xs text-gray-500">
                    Created {new Date(faq.created_at).toLocaleDateString()} • 
                    Updated {new Date(faq.updated_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* Move Up/Down */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleMoveUp(faq)}
                      disabled={index === 0 || actionLoading}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      title="Move up"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveDown(faq)}
                      disabled={index === filteredFAQs.length - 1 || actionLoading}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      title="Move down"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Toggle Published */}
                  <button
                    onClick={() => onTogglePublished(faq.id, !faq.is_published)}
                    disabled={actionLoading}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                      faq.is_published
                        ? 'text-yellow-600 hover:bg-yellow-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={faq.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {faq.is_published ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEdit(faq)}
                    disabled={actionLoading}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Edit FAQ"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(faq.id)}
                    disabled={actionLoading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete FAQ"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}