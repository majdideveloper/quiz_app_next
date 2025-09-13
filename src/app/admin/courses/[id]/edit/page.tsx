'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react'
import { Course } from '@/types'
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

export default function EditCoursePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [course, setCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Safety',
    is_published: false
  })

  useEffect(() => {
    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (error) throw error

      setCourse(data)
      setFormData({
        title: data.title,
        description: data.description || '',
        content: data.content || '',
        category: data.category || 'Safety',
        is_published: data.is_published
      })
    } catch (error) {
      console.error('Error fetching course:', error)
      router.push('/admin/courses')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        is_published: publish !== undefined ? publish : formData.is_published
      }

      const { error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', courseId)

      if (error) throw error

      router.push('/admin/courses')
    } catch (error) {
      console.error('Error updating course:', error)
      alert('Error updating course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (error) throw error
      router.push('/admin/courses')
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Error deleting course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (initialLoading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '2px solid #e5e7eb',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!course) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2>Course not found</h2>
            <Link href="/admin/courses" className="btn-primary" style={{ textDecoration: 'none' }}>
              Back to Courses
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
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
                  Edit Course
                </h1>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    border: '1px solid #dc2626',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                
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
                  Save Changes
                </button>
                
                <button
                  onClick={(e) => handleSubmit(e, !formData.is_published)}
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
                  {loading ? 'Updating...' : (formData.is_published ? 'Unpublish' : 'Publish')}
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
              <form onSubmit={(e) => handleSubmit(e)}>
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
              {/* Course Status */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>
                  Course Status
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: formData.is_published ? '#dcfce7' : '#fef3c7',
                        color: formData.is_published ? '#166534' : '#92400e'
                      }}
                    >
                      {formData.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                    Created: {new Date(course.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

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
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}