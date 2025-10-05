'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, FileText, Clock, Target } from 'lucide-react'
import { Quiz, Course } from '@/types'

export default function AdminQuizzesPage() {
  const { profile } = useAuth()
  const [quizzes, setQuizzes] = useState<(Quiz & { course?: Course })[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchQuizzes()
    fetchCourses()
  }, [filter])

  const fetchQuizzes = async () => {
    try {
      let query = supabase
        .from('quizzes')
        .select(`
          *,
          courses (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false })

      if (filter === 'published') {
        query = query.eq('is_published', true)
      } else if (filter === 'draft') {
        query = query.eq('is_published', false)
      }

      const { data, error } = await query
      
      if (error) throw error
      setQuizzes(data || [])
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('title')

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const togglePublishStatus = async (quizId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ is_published: !currentStatus })
        .eq('id', quizId)

      if (error) throw error
      fetchQuizzes()
    } catch (error) {
      console.error('Error updating quiz:', error)
    }
  }

  const deleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId)

      if (error) throw error
      fetchQuizzes()
    } catch (error) {
      console.error('Error deleting quiz:', error)
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
                  Quiz Management
                </h1>
              </div>
              
              <Link 
                href="/admin/quizzes/new" 
                className="btn-primary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <Plus size={16} />
                New Quiz
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
                <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Quizzes</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>{quizzes.length}</p>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Eye style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Published</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {quizzes.filter(q => q.is_published).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Target style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Avg. Pass Rate</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>78%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
              {[
                { key: 'all', label: 'All Quizzes' },
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

            {/* Quizzes Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Quiz
                    </th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Course
                    </th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Settings
                    </th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Status
                    </th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            {quiz.title}
                          </h3>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {quiz.description}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {quiz.courses?.title || 'Standalone'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                            <Clock size={12} />
                            {quiz.time_limit ? `${quiz.time_limit} min` : 'No limit'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Target size={12} />
                            {quiz.passing_score}% to pass
                          </div>
                        </div>
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
                            backgroundColor: quiz.is_published ? '#dcfce7' : '#fef3c7',
                            color: quiz.is_published ? '#166534' : '#92400e'
                          }}
                        >
                          {quiz.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <Link
                            href={`/admin/quizzes/${quiz.id}/edit`}
                            style={{ 
                              color: '#6b7280', 
                              textDecoration: 'none',
                              padding: '0.25rem',
                              borderRadius: '0.25rem'
                            }}
                            title="Edit quiz"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => togglePublishStatus(quiz.id, quiz.is_published)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: quiz.is_published ? '#dc2626' : '#16a34a',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              borderRadius: '0.25rem'
                            }}
                            title={quiz.is_published ? 'Unpublish' : 'Publish'}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteQuiz(quiz.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              borderRadius: '0.25rem'
                            }}
                            title="Delete quiz"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {quizzes.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                  <FileText style={{ width: '3rem', height: '3rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
                    No quizzes found
                  </h3>
                  <p style={{ color: '#6b7280', margin: '0 0 1.5rem 0' }}>
                    Get started by creating your first quiz.
                  </p>
                  <Link href="/admin/quizzes/new" className="btn-primary" style={{ textDecoration: 'none' }}>
                    Create Quiz
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