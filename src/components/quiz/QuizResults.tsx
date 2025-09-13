'use client'

import { Quiz, Question, QuizAttempt } from '@/types'
import { useRouter } from 'next/navigation'

interface QuizResultsProps {
  quiz: Quiz
  questions: Question[]
  attempt: QuizAttempt
}

export default function QuizResults({ quiz, questions, attempt }: QuizResultsProps) {
  const router = useRouter()
  const score = attempt.score || 0
  const passed = score >= quiz.passing_score
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getScoreColor = () => {
    if (score >= quiz.passing_score) return 'text-green-600'
    if (score >= quiz.passing_score * 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackgroundColor = () => {
    if (score >= quiz.passing_score) return 'bg-green-50 border-green-200'
    if (score >= quiz.passing_score * 0.7) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getQuestionResult = (question: Question) => {
    const userAnswer = attempt.answers[question.id] || ''
    const isCorrect = userAnswer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim()
    return { userAnswer, isCorrect }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Results Header */}
        <div className={`bg-white rounded-lg shadow-sm p-8 mb-8 border-2 ${getScoreBackgroundColor()}`}>
          <div className="text-center">
            <div className="mb-4">
              {passed ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">✓</span>
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-2xl">✗</span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {passed ? 'Congratulations!' : 'Quiz Complete'}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {passed 
                ? `You passed the "${quiz.title}" quiz!` 
                : `You didn't pass this time, but you can try again.`
              }
            </p>

            {/* Score Display */}
            <div className="flex items-center justify-center space-x-8 text-center">
              <div>
                <div className={`text-6xl font-bold ${getScoreColor()}`}>
                  {score}%
                </div>
                <div className="text-gray-500 text-sm">Your Score</div>
              </div>
              <div className="w-px h-16 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-semibold text-gray-700">
                  {quiz.passing_score}%
                </div>
                <div className="text-gray-500 text-sm">Passing Score</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {questions.filter(q => {
                    const userAnswer = attempt.answers[q.id] || ''
                    return userAnswer.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()
                  }).length} / {questions.length}
                </div>
                <div className="text-gray-500 text-sm">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {attempt.time_taken ? formatTime(attempt.time_taken) : 'N/A'}
                </div>
                <div className="text-gray-500 text-sm">Time Taken</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {new Date(attempt.completed_at!).toLocaleDateString()}
                </div>
                <div className="text-gray-500 text-sm">Completed On</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Question Review</h2>
          <div className="space-y-6">
            {questions.map((question, index) => {
              const result = getQuestionResult(question)
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">
                        Q{index + 1}
                      </span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {result.isCorrect ? '✓' : '✗'}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {question.points} point{question.points !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-gray-800 mb-3">
                    {question.question_text}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Your Answer:</span>
                      <div className={`mt-1 p-2 rounded ${
                        result.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {result.userAnswer || 'No answer provided'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Correct Answer:</span>
                      <div className="mt-1 p-2 bg-green-50 text-green-800 rounded">
                        {question.correct_answer}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => router.push('/courses')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Courses
          </button>
          
          {!passed && (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
          
          {passed && (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              View Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  )
}