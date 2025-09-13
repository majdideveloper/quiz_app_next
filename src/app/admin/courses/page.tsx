'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, BookOpen, Users } from 'lucide-react'
import { Course } from '@/types'

export default function AdminCoursesPage() {
  const { profile } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchCourses()
  }, [filter])

  const fetchCourses = async () => {
    try {
      let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter === 'published') {
        query = query.eq('is_published', true)
      } else if (filter === 'draft') {
        query = query.eq('is_published', false)
      }

      const { data, error } = await query
      
      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublishStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !currentStatus })
        .eq('id', courseId)

      if (error) throw error
      fetchCourses()
    } catch (error) {
      console.error('Error updating course:', error)
    }
  }

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (error) throw error
      fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  if (loading) {
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

  return (
    <ProtectedRoute requiredRole="admin">
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/admin/dashboard" style={{ color: '#6b7280', textDecoration: 'none' }}>
                  Admin
                </Link>
                <span style={{ color: '#d1d5db' }}>/</span>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Course Management
                </h1>
              </div>
              
              <Link 
                href="/admin/courses/new" 
                className="btn-primary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <Plus size={16} />
                New Course
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BookOpen style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Courses</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>{courses.length}</p>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Eye style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Published</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {courses.filter(c => c.is_published).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Draft</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {courses.filter(c => !c.is_published).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
              {[
                { key: 'all', label: 'All Courses' },
                { key: 'published', label: 'Published' },
                { key: 'draft', label: 'Draft' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: filter === tab.key ? '#2563eb' : '#6b7280',
                    borderBottom: filter === tab.key ? '2px solid #2563eb' : '2px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Courses Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Course
                    </th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Category
                    </th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Status
                    </th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Created
                    </th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            {course.title}
                          </h3>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {course.description}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {course.category}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: course.is_published ? '#dcfce7' : '#fef3c7',
                            color: course.is_published ? '#166534' : '#92400e'
                          }}
                        >
                          {course.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(course.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <Link
                            href={`/admin/courses/${course.id}/edit`}
                            style={{ 
                              color: '#6b7280', 
                              textDecoration: 'none',
                              padding: '0.25rem',
                              borderRadius: '0.25rem'
                            }}
                            title="Edit course"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => togglePublishStatus(course.id, course.is_published)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: course.is_published ? '#dc2626' : '#16a34a',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              borderRadius: '0.25rem'
                            }}
                            title={course.is_published ? 'Unpublish' : 'Publish'}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              borderRadius: '0.25rem'
                            }}
                            title="Delete course"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {courses.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                  <BookOpen style={{ width: '3rem', height: '3rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
                    No courses found
                  </h3>
                  <p style={{ color: '#6b7280', margin: '0 0 1.5rem 0' }}>
                    Get started by creating your first course.
                  </p>
                  <Link href="/admin/courses/new" className="btn-primary" style={{ textDecoration: 'none' }}>
                    Create Course
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}