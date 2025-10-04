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
  const isMarkedAsRead = course.enrollment?.completed_at !== null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (listView) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border transition-shadow ${
        isMarkedAsRead ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:shadow-md'
      }`}>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                      {course.title}
                    </h3>
                    {isMarkedAsRead && (
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Read
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {course.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span>Created: {formatDate(course.created_at)}</span>
                {isMarkedAsRead && course.enrollment?.completed_at && (
                  <span className="text-green-600 font-medium">
                    Marked as read: {formatDate(course.enrollment.completed_at)}
                  </span>
                )}
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex-shrink-0">
              <Link
                href={`/courses/${course.id}`}
                className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium block min-w-[140px]"
              >
                View Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original card view for backward compatibility
  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-shadow ${
      isMarkedAsRead ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:shadow-md'
    }`}>
      {/* Course Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>
            {isMarkedAsRead && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Read
              </span>
            )}
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

          {isMarkedAsRead && course.enrollment?.completed_at && (
            <div className="text-sm text-green-600 font-medium">
              <span className="font-medium">Marked as read:</span>
              <span className="ml-2">{formatDate(course.enrollment.completed_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Course Footer */}
      <div className="px-6 pb-6">
        <Link
          href={`/courses/${course.id}`}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium block"
        >
          View Course
        </Link>
      </div>
    </div>
  )
}