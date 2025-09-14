'use client'

import { useState, useEffect } from 'react'
import type { FAQ } from '@/types'

interface FAQFormProps {
  faq?: FAQ | null
  onSubmit: (data: Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<boolean>
  onCancel: () => void
  loading?: boolean
}

export default function FAQForm({ faq, onSubmit, onCancel, loading = false }: FAQFormProps) {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    question_fr: '',
    answer_fr: '',
    order_index: 0,
    is_published: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'en' | 'fr'>('en')

  // Populate form with existing FAQ data for editing
  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        question_fr: faq.question_fr || '',
        answer_fr: faq.answer_fr || '',
        order_index: faq.order_index,
        is_published: faq.is_published
      })
    }
  }, [faq])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.question.trim()) {
      newErrors.question = 'English question is required'
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'English answer is required'
    }

    if (formData.order_index < 0) {
      newErrors.order_index = 'Order must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const success = await onSubmit({
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      question_fr: formData.question_fr.trim() || null,
      answer_fr: formData.answer_fr.trim() || null,
      order_index: formData.order_index,
      is_published: formData.is_published
    })

    if (success && !faq) {
      // Reset form after successful creation
      setFormData({
        question: '',
        answer: '',
        question_fr: '',
        answer_fr: '',
        order_index: 0,
        is_published: true
      })
    }
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {faq ? 'Edit FAQ' : 'Create New FAQ'}
        </h2>
        <p className="text-gray-600 mt-1">
          {faq ? 'Update the FAQ information below' : 'Add a new frequently asked question'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'en'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              English <span className="text-red-500">*</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fr')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'fr'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Français
            </button>
          </nav>
        </div>

        {/* English Content */}
        {activeTab === 'en' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => handleChange('question', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.question ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter the question in English"
              />
              {errors.question && (
                <p className="text-red-500 text-sm mt-1">{errors.question}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer (English) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => handleChange('answer', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                  errors.answer ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter the answer in English"
              />
              {errors.answer && (
                <p className="text-red-500 text-sm mt-1">{errors.answer}</p>
              )}
            </div>
          </div>
        )}

        {/* French Content */}
        {activeTab === 'fr' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question (Français)
              </label>
              <input
                type="text"
                value={formData.question_fr}
                onChange={(e) => handleChange('question_fr', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez la question en français"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer (Français)
              </label>
              <textarea
                value={formData.answer_fr}
                onChange={(e) => handleChange('answer_fr', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                placeholder="Entrez la réponse en français"
              />
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              min="0"
              value={formData.order_index}
              onChange={(e) => handleChange('order_index', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.order_index ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.order_index && (
              <p className="text-red-500 text-sm mt-1">{errors.order_index}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={() => handleChange('is_published', true)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Published</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="is_published"
                  checked={!formData.is_published}
                  onChange={() => handleChange('is_published', false)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Draft</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {faq ? 'Update FAQ' : 'Create FAQ'}
          </button>
        </div>
      </form>
    </div>
  )
}