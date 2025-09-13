'use client'

import { CourseProgress } from '@/hooks/useProgress'
import Link from 'next/link'

interface ProgressCardProps {
  progress: CourseProgress
}

export default function ProgressCard({ progress }: ProgressCardProps) {
  const getProgressPercentage = () => {
    if (progress.totalQuizzes === 0) return 100
    return Math.round((progress.completedQuizzes / progress.totalQuizzes) * 100)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getStatusColor = () => {
    if (progress.isCompleted) return 'text-green-600'
    if (getProgressPercentage() > 50) return 'text-blue-600'
    return 'text-gray-600'
  }

  const getStatusText = () => {
    if (progress.isCompleted) return 'Completed'
    if (progress.completedQuizzes === 0) return 'Not Started'
    return 'In Progress'
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link 
            href={`/courses/${progress.course.id}`}
            className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors"
          >
            {progress.course.title}
          </Link>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {progress.course.description}
          </p>
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          progress.isCompleted 
            ? 'bg-green-100 text-green-800'
            : progress.completedQuizzes > 0
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {getStatusText()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {progress.completedQuizzes} of {progress.totalQuizzes} quizzes completed
          </span>
          <span className="text-sm font-medium text-gray-800">
            {getProgressPercentage()}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              progress.isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold text-gray-800">
            {progress.averageScore}%
          </div>
          <div className="text-xs text-gray-500">Avg Score</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-800">
            {progress.bestScore}%
          </div>
          <div className="text-xs text-gray-500">Best Score</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-800">
            {formatTime(progress.timeSpent)}
          </div>
          <div className="text-xs text-gray-500">Time Spent</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-2">
        <Link
          href={`/courses/${progress.course.id}`}
          className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          {progress.isCompleted ? 'Review' : 'Continue'}
        </Link>
        
        {progress.quizzes.length > 0 && (
          <Link
            href={`/quizzes/${progress.quizzes[0].id}`}
            className="flex-1 text-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            {progress.completedQuizzes === 0 ? 'Start Quiz' : 'Retake Quiz'}
          </Link>
        )}
      </div>
    </div>
  )
}