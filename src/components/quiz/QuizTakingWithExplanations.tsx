'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { Quiz, Question, QuizAttempt } from '@/types'
import QuizTimer from './QuizTimer'
import QuestionCardWithExplanation from './QuestionCardWithExplanation'
import QuizNavigationWithExplanations from './QuizNavigationWithExplanations'

interface QuizTakingWithExplanationsProps {
  quiz: Quiz
  questions: Question[]
  onComplete: (attempt: QuizAttempt) => void
}

export default function QuizTakingWithExplanations({ quiz, questions, onComplete }: QuizTakingWithExplanationsProps) {
  const { user } = useAuth()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({})
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(new Date())

  // Initialize quiz attempt
  useEffect(() => {
    if (!user || attemptId) return
    
    const initializeAttempt = async () => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: quiz.id,
          answers: {},
          started_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to initialize quiz attempt:', error)
        return
      }

      setAttemptId(data.id)
      
      // Set timer if quiz has time limit
      if (quiz.time_limit) {
        setTimeRemaining(quiz.time_limit * 60) // Convert minutes to seconds
      }
    }

    initializeAttempt()
  }, [user, quiz, attemptId])

  // Auto-submit when timer expires
  const handleTimeUp = useCallback(async () => {
    if (isSubmitting) return
    await submitQuiz()
  }, [isSubmitting])

  const handleAnswerChange = async (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)

    // Show explanation immediately after answer is provided
    setShowExplanations(prev => ({ ...prev, [questionId]: true }))

    // Save answer to database
    if (attemptId) {
      await supabase
        .from('quiz_attempts')
        .update({ answers: newAnswers })
        .eq('id', attemptId)
    }
  }

  const calculateScore = () => {
    let correct = 0
    let totalPoints = 0

    questions.forEach(question => {
      totalPoints += question.points
      const userAnswer = answers[question.id]
      
      if (userAnswer && userAnswer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim()) {
        correct += question.points
      }
    })

    return totalPoints > 0 ? Math.round((correct / totalPoints) * 100) : 0
  }

  const submitQuiz = async () => {
    if (isSubmitting || !attemptId || !user) return
    
    setIsSubmitting(true)
    
    try {
      const score = calculateScore()
      const timeTaken = Math.round((new Date().getTime() - startTime.getTime()) / 1000)
      
      const { data, error } = await supabase
        .from('quiz_attempts')
        .update({
          answers,
          score,
          completed_at: new Date().toISOString(),
          time_taken: timeTaken
        })
        .eq('id', attemptId)
        .select()
        .single()

      if (error) {
        console.error('Failed to submit quiz:', error)
        setIsSubmitting(false)
        return
      }

      // Update course progress if quiz is passed
      if (score >= quiz.passing_score) {
        await updateCourseProgress()
      }

      onComplete(data)
    } catch (error) {
      console.error('Quiz submission error:', error)
      setIsSubmitting(false)
    }
  }

  const updateCourseProgress = async () => {
    if (!user) return

    // Check if user is enrolled in the course
    const { data: enrollment } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', quiz.course_id)
      .single()

    if (enrollment) {
      // Update progress - for now, completing quiz means 100% progress
      await supabase
        .from('course_enrollments')
        .update({
          progress_percentage: 100,
          completed_at: new Date().toISOString()
        })
        .eq('id', enrollment.id)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const toggleExplanation = (questionId: string) => {
    setShowExplanations(prev => ({ 
      ...prev, 
      [questionId]: !prev[questionId] 
    }))
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Questions Available</h2>
          <p className="text-gray-600">This quiz doesn't have any questions yet.</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
              <p className="text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            {quiz.time_limit && timeRemaining !== null && (
              <QuizTimer 
                timeRemaining={timeRemaining}
                onTimeUp={handleTimeUp}
                onTick={setTimeRemaining}
              />
            )}
          </div>
        </div>

        {/* Question Card with Explanation and Navigation */}
        <div className="mb-6">
          <QuestionCardWithExplanation 
            question={currentQuestion}
            answer={answers[currentQuestion.id] || ''}
            showExplanation={showExplanations[currentQuestion.id] || false}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
            onToggleExplanation={() => toggleExplanation(currentQuestion.id)}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onPrevious={previousQuestion}
            onNext={nextQuestion}
            onSubmit={submitQuiz}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Quiz Overview Navigation */}
        <QuizNavigationWithExplanations 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          answers={answers}
          showExplanations={showExplanations}
          questions={questions}
          onGoToQuestion={goToQuestion}
          onPrevious={previousQuestion}
          onNext={nextQuestion}
          onSubmit={submitQuiz}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}