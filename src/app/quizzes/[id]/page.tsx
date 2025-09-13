'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { Quiz, Question, QuizAttempt } from '@/types'
import QuizTakingWithExplanations from '@/components/quiz/QuizTakingWithExplanations'
import QuizResults from '@/components/quiz/QuizResults'

export default function QuizPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchQuizData()
  }, [id, user])

  const fetchQuizData = async () => {
    try {
      // Fetch quiz details
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single()

      if (quizError || !quizData) {
        setError('Quiz not found or not published')
        return
      }

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', id)
        .order('order_index')

      if (questionsError) {
        setError('Failed to load quiz questions')
        return
      }

      // Check for existing attempts
      const { data: attemptData } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', id)
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(1)

      setQuiz(quizData)
      setQuestions(questionsData || [])
      
      // If there's a completed attempt, show results
      if (attemptData && attemptData[0]?.completed_at) {
        setAttempt(attemptData[0])
      }
      
    } catch (err) {
      setError('Failed to load quiz')
      console.error('Quiz fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuizComplete = (completedAttempt: QuizAttempt) => {
    setAttempt(completedAttempt)
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading quiz...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/courses')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  if (!quiz) return null

  // Show results if quiz is completed
  if (attempt?.completed_at) {
    return <QuizResults quiz={quiz} questions={questions} attempt={attempt} />
  }

  // Show quiz taking interface
  return <QuizTakingWithExplanations quiz={quiz} questions={questions} onComplete={handleQuizComplete} />
}