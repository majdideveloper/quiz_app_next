'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Eye, Plus, Trash2, ChevronUp, ChevronDown, Upload, X } from 'lucide-react'
import { Course, QuestionType } from '@/types'
import { uploadQuestionImage, deleteQuestionImage, validateImageFile } from '@/lib/utils/imageUpload'

interface Question {
  id: string
  question_text: string
  question_type: QuestionType
  options: string[]
  correct_answer: string
  points: number
  order_index: number
  image_url?: string | null
  explanation?: string | null
  explanation_visible?: boolean
}

export default function EditQuizPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    time_limit: 30,
    passing_score: 70,
    max_attempts: 3,
    is_published: false
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsToDelete, setQuestionsToDelete] = useState<string[]>([])

  useEffect(() => {
    if (quizId) {
      fetchQuizData()
      fetchCourses()
    }
  }, [quizId])

  const fetchQuizData = async () => {
    try {
      // Fetch quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single()

      if (quizError) throw quizError

      setFormData({
        title: quizData.title,
        description: quizData.description || '',
        course_id: quizData.course_id || '',
        time_limit: quizData.time_limit || 30,
        passing_score: quizData.passing_score || 70,
        max_attempts: quizData.max_attempts || 3,
        is_published: quizData.is_published || false
      })

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index')

      if (questionsError) throw questionsError

      setQuestions(questionsData || [])
    } catch (error) {
      console.error('Error fetching quiz:', error)
      alert('Error loading quiz. Please try again.')
      router.push('/admin/quizzes')
    } finally {
      setInitialLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('is_published', true)
        .order('title')

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `new-${Math.random().toString(36).substring(2, 15)}`,
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1,
      order_index: questions.length,
      image_url: null,
      explanation: '',
      explanation_visible: true
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, [field]: value } : q
    ))
  }

  const deleteQuestion = (questionId: string) => {
    // If it's an existing question (not new), mark it for deletion
    if (!questionId.startsWith('new-')) {
      setQuestionsToDelete([...questionsToDelete, questionId])
    }

    const updatedQuestions = questions.filter(q => q.id !== questionId)
    // Reorder remaining questions
    const reorderedQuestions = updatedQuestions.map((q, index) => ({ ...q, order_index: index }))
    setQuestions(reorderedQuestions)
  }

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === questions.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const updatedQuestions = [...questions]

    // Swap questions
    [updatedQuestions[currentIndex], updatedQuestions[newIndex]] =
    [updatedQuestions[newIndex], updatedQuestions[currentIndex]]

    // Update order indices
    updatedQuestions[currentIndex].order_index = currentIndex
    updatedQuestions[newIndex].order_index = newIndex

    setQuestions(updatedQuestions)
  }

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return

    const updatedOptions = [...question.options]
    updatedOptions[optionIndex] = value
    updateQuestion(questionId, 'options', updatedOptions)
  }

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return

    const updatedOptions = [...question.options, '']
    updateQuestion(questionId, 'options', updatedOptions)
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId)
    if (!question || question.options.length <= 2) return

    const updatedOptions = question.options.filter((_, index) => index !== optionIndex)
    updateQuestion(questionId, 'options', updatedOptions)

    // Clear correct answer if it was the removed option
    if (question.correct_answer === question.options[optionIndex]) {
      updateQuestion(questionId, 'correct_answer', '')
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form data
      if (!formData.title.trim()) {
        alert('Please enter a quiz title.')
        setLoading(false)
        return
      }

      if (!formData.description.trim()) {
        alert('Please enter a quiz description.')
        setLoading(false)
        return
      }

      // Validate number fields
      if (isNaN(formData.time_limit) || formData.time_limit < 1) {
        alert('Please enter a valid time limit (1-180 minutes).')
        setLoading(false)
        return
      }

      if (isNaN(formData.passing_score) || formData.passing_score < 1 || formData.passing_score > 100) {
        alert('Please enter a valid passing score (1-100%).')
        setLoading(false)
        return
      }

      if (isNaN(formData.max_attempts) || formData.max_attempts < 1) {
        alert('Please enter a valid number of max attempts (1-10).')
        setLoading(false)
        return
      }

      // Validate questions
      const validQuestions = questions.filter(q =>
        q.question_text.trim() &&
        q.correct_answer.trim() &&
        (q.question_type !== 'multiple_choice' || q.options.some(opt => opt.trim())) &&
        !isNaN(q.points) && q.points > 0
      )

      if (validQuestions.length === 0) {
        alert('Please add at least one complete question with valid points.')
        setLoading(false)
        return
      }

      // Validate multiple choice questions have correct answers in options
      for (const question of validQuestions) {
        if (question.question_type === 'multiple_choice') {
          const validOptions = question.options.filter(opt => opt.trim())
          if (!validOptions.includes(question.correct_answer)) {
            alert(`Question "${question.question_text}" has a correct answer that doesn't match any of the options. Please fix this.`)
            setLoading(false)
            return
          }
        }
      }

      // Update quiz
      const updateData = {
        title: formData.title,
        description: formData.description,
        course_id: formData.course_id || null,
        time_limit: formData.time_limit,
        passing_score: formData.passing_score,
        max_attempts: formData.max_attempts,
        is_published: publish !== undefined ? publish : formData.is_published
      }

      const { error: quizError } = await supabase
        .from('quizzes')
        .update(updateData)
        .eq('id', quizId)

      if (quizError) throw quizError

      // Delete removed questions
      if (questionsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('questions')
          .delete()
          .in('id', questionsToDelete)

        if (deleteError) throw deleteError
      }

      // Process questions
      const existingQuestions = validQuestions.filter(q => !q.id.startsWith('new-'))
      const newQuestions = validQuestions.filter(q => q.id.startsWith('new-'))

      // Update existing questions
      for (const question of existingQuestions) {
        const { error } = await supabase
          .from('questions')
          .update({
            question_text: question.question_text,
            question_type: question.question_type,
            options: question.question_type === 'multiple_choice' ? question.options.filter(opt => opt.trim()) : null,
            correct_answer: question.correct_answer,
            points: question.points,
            order_index: question.order_index,
            image_url: question.image_url,
            explanation: question.explanation || null,
            explanation_visible: question.explanation_visible ?? true
          })
          .eq('id', question.id)

        if (error) throw error
      }

      // Insert new questions
      if (newQuestions.length > 0) {
        const questionsToInsert = newQuestions.map(q => ({
          quiz_id: quizId,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.question_type === 'multiple_choice' ? q.options.filter(opt => opt.trim()) : null,
          correct_answer: q.correct_answer,
          points: q.points,
          order_index: q.order_index,
          image_url: q.image_url,
          explanation: q.explanation || null,
          explanation_visible: q.explanation_visible ?? true
        }))

        const { error: insertError } = await supabase
          .from('questions')
          .insert(questionsToInsert)

        if (insertError) throw insertError
      }

      router.push('/admin/quizzes')
    } catch (error) {
      console.error('Error updating quiz:', error)

      let errorMessage = 'Error updating quiz. Please try again.'

      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = `Error updating quiz: ${error.message}`
      } else if (error && typeof error === 'object' && 'code' in error) {
        errorMessage = `Database error (${error.code}): Please check your input and try again.`
      }

      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      // Delete questions first (foreign key constraint)
      const { error: questionsError } = await supabase
        .from('questions')
        .delete()
        .eq('quiz_id', quizId)

      if (questionsError) throw questionsError

      // Delete quiz
      const { error: quizError } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId)

      if (quizError) throw quizError

      router.push('/admin/quizzes')
    } catch (error) {
      console.error('Error deleting quiz:', error)
      alert('Error deleting quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

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

  return (
    <ProtectedRoute requiredRole="admin">
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link
                  href="/admin/quizzes"
                  style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to Quizzes
                </Link>
                <span style={{ color: '#d1d5db' }}>/</span>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Edit Quiz
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
                  onClick={(e) => handleSubmit(e)}
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
                  disabled={loading || !formData.title || questions.length === 0}
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: loading || !formData.title || questions.length === 0 ? 0.5 : 1,
                    cursor: loading || !formData.title || questions.length === 0 ? 'not-allowed' : 'pointer'
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
            {/* Main Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Quiz Settings */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
                  Quiz Settings
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                      Quiz Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter quiz title..."
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

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                      Associated Course (Optional)
                    </label>
                    <select
                      value={formData.course_id}
                      onChange={(e) => setFormData({...formData, course_id: e.target.value})}
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
                      <option value="">Standalone Quiz</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the quiz..."
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
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.time_limit || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 30 : parseInt(e.target.value)
                        setFormData({...formData, time_limit: isNaN(value) ? 30 : value})
                      }}
                      min="1"
                      max="180"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      value={formData.passing_score || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 70 : parseInt(e.target.value)
                        setFormData({...formData, passing_score: isNaN(value) ? 70 : value})
                      }}
                      min="1"
                      max="100"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                      Max Attempts
                    </label>
                    <input
                      type="number"
                      value={formData.max_attempts || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 3 : parseInt(e.target.value)
                        setFormData({...formData, max_attempts: isNaN(value) ? 3 : value})
                      }}
                      min="1"
                      max="10"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Questions ({questions.length})
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {questions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      index={index}
                      totalQuestions={questions.length}
                      onUpdate={updateQuestion}
                      onDelete={deleteQuestion}
                      onMove={moveQuestion}
                      onUpdateOption={updateQuestionOption}
                      onAddOption={addOption}
                      onRemoveOption={removeOption}
                    />
                  ))}
                </div>

                {/* Add Question Button - Always at bottom */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                  <button
                    onClick={addQuestion}
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Quiz Summary */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>
                  Quiz Summary
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Questions:</span>
                    <span style={{ color: '#111827', fontWeight: '500' }}>{questions.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Total Points:</span>
                    <span style={{ color: '#111827', fontWeight: '500' }}>{totalPoints}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Time Limit:</span>
                    <span style={{ color: '#111827', fontWeight: '500' }}>{formData.time_limit} min</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Passing Score:</span>
                    <span style={{ color: '#111827', fontWeight: '500' }}>{formData.passing_score}%</span>
                  </div>
                </div>
              </div>

              {/* Publishing Guidelines */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>
                  Quiz Status
                </h3>
                <div style={{ marginBottom: '1rem' }}>
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
                <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                  <p style={{ margin: '0 0 0.75rem 0' }}>
                    <strong style={{ color: '#111827' }}>Draft:</strong> Save your work in progress. Only visible to admins.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: '#111827' }}>Published:</strong> Quiz becomes available to employees.
                  </p>
                </div>
              </div>

              {/* Question Types & Tips */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>
                  Question Types
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#111827' }}>Multiple Choice:</strong> Best for knowledge testing with clear right/wrong answers.
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#111827' }}>True/False:</strong> Quick yes/no questions for basic comprehension.
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#111827' }}>Fill in Blank:</strong> Test specific knowledge or terminology.
                  </div>
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f0f9ff', borderRadius: '0.375rem', border: '1px solid #e0f2fe' }}>
                    <strong style={{ color: '#0369a1' }}>💡 Tip:</strong> You can add images to any question type to provide visual context, diagrams, or examples.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// Question Editor Component
function QuestionEditor({
  question,
  index,
  totalQuestions,
  onUpdate,
  onDelete,
  onMove,
  onUpdateOption,
  onAddOption,
  onRemoveOption
}: {
  question: Question
  index: number
  totalQuestions: number
  onUpdate: (id: string, field: keyof Question, value: any) => void
  onDelete: (id: string) => void
  onMove: (id: string, direction: 'up' | 'down') => void
  onUpdateOption: (id: string, optionIndex: number, value: string) => void
  onAddOption: (id: string) => void
  onRemoveOption: (id: string, optionIndex: number) => void
}) {
  const [imageUploading, setImageUploading] = useState(false)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setImageUploading(true)
    try {
      const imageUrl = await uploadQuestionImage(file, question.id)
      if (imageUrl) {
        onUpdate(question.id, 'image_url', imageUrl)
      } else {
        alert('Failed to upload image. Please try again.')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setImageUploading(false)
      // Clear the file input
      event.target.value = ''
    }
  }

  const handleImageRemove = async () => {
    if (!question.image_url) return

    try {
      await deleteQuestionImage(question.image_url)
      onUpdate(question.id, 'image_url', null)
    } catch (error) {
      console.error('Error removing image:', error)
    }
  }
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      backgroundColor: '#f9fafb'
    }}>
      {/* Question Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
          Question {index + 1}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => onMove(question.id, 'up')}
            disabled={index === 0}
            style={{
              background: 'none',
              border: 'none',
              color: index === 0 ? '#d1d5db' : '#6b7280',
              cursor: index === 0 ? 'not-allowed' : 'pointer',
              padding: '0.25rem'
            }}
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={() => onMove(question.id, 'down')}
            disabled={index === totalQuestions - 1}
            style={{
              background: 'none',
              border: 'none',
              color: index === totalQuestions - 1 ? '#d1d5db' : '#6b7280',
              cursor: index === totalQuestions - 1 ? 'not-allowed' : 'pointer',
              padding: '0.25rem'
            }}
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Question Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
            Question Type
          </label>
          <select
            value={question.question_type}
            onChange={(e) => onUpdate(question.id, 'question_type', e.target.value as QuestionType)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: 'white'
            }}
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True/False</option>
            <option value="fill_in_blank">Fill in Blank</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
            Points
          </label>
          <input
            type="number"
            value={question.points || ''}
            onChange={(e) => {
              const value = e.target.value === '' ? 1 : parseInt(e.target.value)
              onUpdate(question.id, 'points', isNaN(value) ? 1 : value)
            }}
            min="1"
            max="10"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>

        <div></div> {/* Empty grid cell for spacing */}
      </div>

      {/* Question Text */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
          Question Text *
        </label>
        <textarea
          value={question.question_text}
          onChange={(e) => onUpdate(question.id, 'question_text', e.target.value)}
          placeholder="Enter your question here..."
          rows={2}
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

      {/* Explanation Field */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
            Explanation (Optional)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
            <input
              type="checkbox"
              checked={question.explanation_visible ?? true}
              onChange={(e) => onUpdate(question.id, 'explanation_visible', e.target.checked)}
              style={{ marginRight: '0.25rem' }}
            />
            Show to users
          </label>
        </div>
        <textarea
          value={question.explanation || ''}
          onChange={(e) => onUpdate(question.id, 'explanation', e.target.value)}
          placeholder="Provide an explanation that will be shown to users after they answer this question..."
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
        />
        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>
          This explanation will be displayed to users immediately after they answer the question.
        </p>
      </div>

      {/* Image Upload */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
            Question Image (Optional)
          </label>
          {question.image_url && (
            <button
              onClick={handleImageRemove}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              <X size={12} />
              Remove Image
            </button>
          )}
        </div>

        {question.image_url ? (
          <div style={{
            position: 'relative',
            border: '2px dashed #d1d5db',
            borderRadius: '0.375rem',
            padding: '0.5rem',
            backgroundColor: '#f9fafb'
          }}>
            <Image
              src={question.image_url}
              alt="Question"
              width={500}
              height={200}
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                objectFit: 'contain',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={imageUploading}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: imageUploading ? 'not-allowed' : 'pointer',
                zIndex: 10
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '2rem 1rem',
                border: '2px dashed #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: '#f9fafb',
                cursor: imageUploading ? 'not-allowed' : 'pointer',
                opacity: imageUploading ? 0.5 : 1
              }}
            >
              <Upload style={{ width: '2rem', height: '2rem', color: '#6b7280' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: '#111827', margin: 0, fontWeight: '500' }}>
                  {imageUploading ? 'Uploading...' : 'Click to upload image'}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Answer Options */}
      {question.question_type === 'multiple_choice' && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
              Answer Options
            </label>
            <button
              onClick={() => onAddOption(question.id)}
              style={{
                fontSize: '0.75rem',
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Add Option
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correct_answer === option}
                  onChange={() => onUpdate(question.id, 'correct_answer', option)}
                  style={{ marginTop: '0.125rem' }}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => onUpdateOption(question.id, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => onRemoveOption(question.id, optionIndex)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {question.question_type === 'true_false' && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
            Correct Answer
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name={`answer-${question.id}`}
                value="true"
                checked={question.correct_answer === 'true'}
                onChange={(e) => onUpdate(question.id, 'correct_answer', e.target.value)}
              />
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>True</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name={`answer-${question.id}`}
                value="false"
                checked={question.correct_answer === 'false'}
                onChange={(e) => onUpdate(question.id, 'correct_answer', e.target.value)}
              />
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>False</span>
            </label>
          </div>
        </div>
      )}

      {question.question_type === 'fill_in_blank' && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
            Correct Answer *
          </label>
          <input
            type="text"
            value={question.correct_answer}
            onChange={(e) => onUpdate(question.id, 'correct_answer', e.target.value)}
            placeholder="Enter the correct answer..."
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
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Note: Answers will be checked case-insensitively.
          </p>
        </div>
      )}
    </div>
  )
}
