'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import RichTextEditor from '@/components/admin/RichTextEditor'

const categories = [
  'Safety',
  'Compliance',
  'HR',
  'IT Security',
  'Professional Development',
  'Leadership',
  'Communication',
  'Other'
]

export default function NewCoursePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Safety',
    is_published: false
  })

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          is_published: publish,
          created_by: user?.id
        }])
        .select()

      if (error) throw error

      router.push('/admin/courses')
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Error creating course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link 
                  href="/admin/courses" 
                  style={{ 
                    color: '#6b7280', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to Courses
                </Link>
                <span style={{ color: '#d1d5db' }}>/</span>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Create New Course
                </h1>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={loading || !formData.title}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: loading || !formData.title ? 0.5 : 1,
                    cursor: loading || !formData.title ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Save size={16} />
                  Save Draft
                </button>
                
                <button
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading || !formData.title || !formData.description || !formData.content}
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: loading || !formData.title || !formData.description || !formData.content ? 0.5 : 1,
                    cursor: loading || !formData.title || !formData.description || !formData.content ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Eye size={16} />
                  {loading ? 'Creating...' : 'Publish Course'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            {/* Main Form */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
              <form onSubmit={(e) => handleSubmit(e, false)}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter course title..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of the course..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => handleChange('content', value)}
                  placeholder="Enter the full course content here. Use the formatting toolbar for bold, italic, and quotes..."
                  rows={15}
                  required
                />
              </form>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Publishing Guidelines */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>
                  Publishing Guidelines
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                  <p style={{ margin: '0 0 0.75rem 0' }}>
                    <strong style={{ color: '#111827' }}>Draft:</strong> Save your work in progress. Only visible to admins.
                  </p>
                  <p style={{ margin: '0 0 0.75rem 0' }}>
                    <strong style={{ color: '#111827' }}>Published:</strong> Course becomes available to all employees.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: '#111827' }}>Requirements:</strong> Title, description, and content are required for publishing.
                  </p>
                </div>
              </div>

              {/* Content Tips */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>
                  Content Tips
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                  <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Use clear, concise language</li>
                    <li style={{ marginBottom: '0.5rem' }}>Include practical examples</li>
                    <li style={{ marginBottom: '0.5rem' }}>Structure content with headings</li>
                    <li style={{ marginBottom: '0.5rem' }}>Add relevant Canadian regulations</li>
                    <li>Consider accessibility guidelines</li>
                  </ul>
                </div>
              </div>

              {/* Course Categories */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>
                  Popular Categories
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {categories.slice(0, 6).map(category => (
                    <span
                      key={category}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: formData.category === category ? '#dbeafe' : '#f3f4f6',
                        color: formData.category === category ? '#1d4ed8' : '#6b7280',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleChange('category', category)}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}