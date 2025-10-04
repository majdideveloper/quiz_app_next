'use client'

import { CourseProgress } from '@/hooks/useProgress'
import Link from 'next/link'

interface ProgressCardProps {
  progress: CourseProgress
}

export default function ProgressCard({ progress }: ProgressCardProps) {
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
        {progress.isCompleted && (
          <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
            ✓ Completed
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4">
        <Link
          href={`/courses/${progress.course.id}`}
          className="block w-full text-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          View Course
        </Link>
      </div>
    </div>
  )
}