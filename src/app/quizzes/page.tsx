'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { Quiz, Course, QuizAttempt } from '@/types'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import QuizCard from '@/components/quiz/QuizCard'

interface QuizWithCourse extends Quiz {
  courses?: Course
  userAttempts?: QuizAttempt[]
}

export default function QuizzesPage() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState<QuizWithCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user) {
      fetchQuizzes()
    }
  }, [user])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)

      // Fetch all published quizzes with course information
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select(`
          *,
          courses (*)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (quizzesError) {
        console.error('Failed to fetch quizzes:', quizzesError)
        return
      }

      // Fetch user attempts for these quizzes
      const { data: attemptsData } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user?.id)

      // Combine quizzes with user attempts
      const quizzesWithAttempts = (quizzesData || []).map(quiz => ({
        ...quiz,
        userAttempts: attemptsData?.filter(attempt => attempt.quiz_id === quiz.id) || []
      }))

      setQuizzes(quizzesWithAttempts)
    } catch (error) {
      console.error('Failed to fetch quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getQuizStatus = (quiz: QuizWithCourse) => {
    if (!quiz.userAttempts || quiz.userAttempts.length === 0) {
      return 'available'
    }
    
    const completedAttempts = quiz.userAttempts.filter(attempt => attempt.completed_at)
    if (completedAttempts.length === 0) {
      return 'started'
    }

    const passedAttempts = completedAttempts.filter(attempt => 
      (attempt.score || 0) >= quiz.passing_score
    )
    
    return passedAttempts.length > 0 ? 'completed' : 'failed'
  }

  const getBestScore = (quiz: QuizWithCourse) => {
    if (!quiz.userAttempts || quiz.userAttempts.length === 0) return null
    
    const completedAttempts = quiz.userAttempts.filter(attempt => 
      attempt.completed_at && attempt.score !== null
    )
    
    if (completedAttempts.length === 0) return null
    
    return Math.max(...completedAttempts.map(attempt => attempt.score || 0))
  }

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (quiz.courses && quiz.courses.title.toLowerCase().includes(searchTerm.toLowerCase()))
    
    if (!matchesSearch) return false
    
    const status = getQuizStatus(quiz)
    
    switch (filter) {
      case 'available':
        return status === 'available' || status === 'started' || status === 'failed'
      case 'completed':
        return status === 'completed'
      default:
        return true
    }
  })

  const getFilterCounts = () => {
    return {
      all: quizzes.length,
      available: quizzes.filter(q => ['available', 'started', 'failed'].includes(getQuizStatus(q))).length,
      completed: quizzes.filter(q => getQuizStatus(q) === 'completed').length
    }
  }

  const counts = getFilterCounts()

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm h-24">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 Quizzes</h1>
            <p className="text-gray-600 text-lg">
              Test your knowledge and track your progress
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Quizzes
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by quiz title, description, or course..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'all', label: 'All Quizzes', count: counts.all },
                  { key: 'available', label: 'Available', count: counts.available },
                  { key: 'completed', label: 'Completed', count: counts.completed }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as typeof filter)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      filter === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                    <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredQuizzes.length} of {quizzes.length} quizzes
            </p>
          </div>

          {/* Quizzes List */}
          {filteredQuizzes.length > 0 ? (
            <div className="space-y-4">
              {filteredQuizzes.map((quiz) => (
                <QuizCard 
                  key={quiz.id} 
                  quiz={quiz} 
                  status={getQuizStatus(quiz)}
                  bestScore={getBestScore(quiz)}
                  listView={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-4xl">📝</span>
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                {searchTerm ? 'No quizzes match your search' : filter !== 'all' ? `No ${filter} quizzes` : 'No Quizzes Available'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Check back later for new quizzes or browse our courses'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}