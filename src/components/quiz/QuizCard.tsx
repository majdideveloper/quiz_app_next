'use client'

import { Quiz, Course } from '@/types'
import Link from 'next/link'

interface QuizWithCourse extends Quiz {
  courses?: Course
}

interface QuizCardProps {
  quiz: QuizWithCourse
  status: 'available' | 'started' | 'completed' | 'failed'
  bestScore: number | null
  listView?: boolean
}

export default function QuizCard({ quiz, status, bestScore, listView = false }: QuizCardProps) {
  const formatTimeLimit = (minutes: number | null) => {
    if (!minutes) return 'No time limit'
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ Completed
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ⚠ Failed
          </span>
        )
      case 'started':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⏳ In Progress
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Available
          </span>
        )
    }
  }

  const getButtonText = () => {
    switch (status) {
      case 'completed':
        return 'Retake Quiz'
      case 'failed':
        return 'Try Again'
      case 'started':
        return 'Continue Quiz'
      default:
        return 'Start Quiz'
    }
  }

  const getButtonStyle = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 hover:bg-green-700'
      case 'failed':
        return 'bg-orange-600 hover:bg-orange-700'
      case 'started':
        return 'bg-yellow-600 hover:bg-yellow-700'
      default:
        return 'bg-blue-600 hover:bg-blue-700'
    }
  }

  if (listView) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {quiz.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {getStatusBadge()}
                    {bestScore !== null && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        bestScore >= quiz.passing_score 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Best: {bestScore}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">From:</span> {quiz.courses?.title || 'Standalone Quiz'}
                </p>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {quiz.description}
              </p>

              {/* Quiz Stats - Compact */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span>⏱ {formatTimeLimit(quiz.time_limit)}</span>
                <span>🎯 {quiz.passing_score}% to pass</span>
                <span>🔄 {quiz.max_attempts} attempts</span>
                <span>📂 {quiz.courses?.category || 'General'}</span>
                <span>📅 {new Date(quiz.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex-shrink-0">
              <Link
                href={`/quizzes/${quiz.id}`}
                className={`w-full lg:w-auto ${getButtonStyle()} text-white py-2 px-4 rounded-lg transition-colors text-center font-medium block min-w-[140px]`}
              >
                {getButtonText()}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original card view for backward compatibility
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Quiz Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {quiz.title}
            </h3>
            {getStatusBadge()}
          </div>
        </div>

        {/* Course Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">From course:</p>
          <p className="font-medium text-gray-900 text-sm">
            {quiz.courses?.title || 'Course information unavailable'}
          </p>
        </div>

        {/* Quiz Description */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {quiz.description}
        </p>

        {/* Quiz Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="font-medium text-gray-700">Time Limit:</span>
            <p className="text-gray-600 text-xs">{formatTimeLimit(quiz.time_limit)}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Passing Score:</span>
            <p className="text-gray-600 text-xs">{quiz.passing_score}%</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Max Attempts:</span>
            <p className="text-gray-600 text-xs">{quiz.max_attempts}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Category:</span>
            <p className="text-gray-600 text-xs">{quiz.courses?.category || 'General'}</p>
          </div>
        </div>

        {/* Score Display */}
        {bestScore !== null && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Best Score:</span>
              <span className={`text-lg font-bold ${
                bestScore >= quiz.passing_score ? 'text-green-600' : 'text-red-600'
              }`}>
                {bestScore}%
              </span>
            </div>
            {bestScore >= quiz.passing_score && (
              <p className="text-xs text-green-600 mt-1">✓ Passed</p>
            )}
          </div>
        )}
      </div>

      {/* Quiz Footer */}
      <div className="px-6 pb-6">
        <Link
          href={`/quizzes/${quiz.id}`}
          className={`w-full ${getButtonStyle()} text-white py-2 px-4 rounded-lg transition-colors text-center font-medium block`}
        >
          {getButtonText()}
        </Link>
      </div>

      {/* Quiz Meta */}
      <div className="px-6 pb-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
        <div className="flex justify-between">
          <span>Created: {new Date(quiz.created_at).toLocaleDateString()}</span>
          {status === 'completed' && (
            <span className="text-green-600 font-medium">✓ Quiz Passed</span>
          )}
          {status === 'failed' && (
            <span className="text-red-600 font-medium">Try again to pass</span>
          )}
        </div>
      </div>
    </div>
  )
}