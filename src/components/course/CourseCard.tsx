'use client'

import { Course, CourseEnrollment } from '@/types'
import Link from 'next/link'

interface CourseWithEnrollment extends Course {
  enrollment?: CourseEnrollment
}

interface CourseCardProps {
  course: CourseWithEnrollment
  onEnroll: () => void
  listView?: boolean
}

export default function CourseCard({ course, onEnroll, listView = false }: CourseCardProps) {
  const isEnrolled = !!course.enrollment
  const isCompleted = course.enrollment?.completed_at !== null
  const progressPercentage = course.enrollment?.progress_percentage || 0

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✓ Completed
        </span>
      )
    }
    if (isEnrolled) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          📚 In Progress
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Available
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (listView) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {getStatusBadge()}
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {course.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {course.description}
              </p>

              {/* Progress Bar (if enrolled) */}
              {isEnrolled && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span>Created: {formatDate(course.created_at)}</span>
                {course.enrollment && (
                  <span>Enrolled: {formatDate(course.enrollment.enrolled_at)}</span>
                )}
                {course.enrollment?.completed_at && (
                  <span>Completed: {formatDate(course.enrollment.completed_at)}</span>
                )}
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex-shrink-0">
              {isEnrolled ? (
                <Link
                  href={`/courses/${course.id}`}
                  className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium block min-w-[140px]"
                >
                  {isCompleted ? 'Review Course' : 'Continue Learning'}
                </Link>
              ) : (
                <button
                  onClick={onEnroll}
                  className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium min-w-[140px]"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original card view for backward compatibility
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Course Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>
            {getStatusBadge()}
          </div>
        </div>

        {/* Course Description */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {course.description}
        </p>

        {/* Course Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Category:</span>
            <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
              {course.category}
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            <span className="font-medium">Created:</span>
            <span className="ml-2">{formatDate(course.created_at)}</span>
          </div>
        </div>

        {/* Progress Bar (if enrolled) */}
        {isEnrolled && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Course Footer */}
      <div className="px-6 pb-6">
        {isEnrolled ? (
          <Link
            href={`/courses/${course.id}`}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium block"
          >
            {isCompleted ? 'Review Course' : 'Continue Learning'}
          </Link>
        ) : (
          <button
            onClick={onEnroll}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Enroll Now
          </button>
        )}
      </div>

      {/* Enrollment Date (if applicable) */}
      {course.enrollment && (
        <div className="px-6 pb-4 text-xs text-gray-500">
          Enrolled: {formatDate(course.enrollment.enrolled_at)}
          {course.enrollment.completed_at && (
            <span className="ml-4">
              Completed: {formatDate(course.enrollment.completed_at)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}