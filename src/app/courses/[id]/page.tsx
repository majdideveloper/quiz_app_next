'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { Course, CourseEnrollment } from '@/types'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, User, Calendar } from 'lucide-react'
import CourseContentRenderer from '@/components/course/CourseContentRenderer'

interface CourseWithEnrollment extends Course {
  enrollment?: CourseEnrollment
}

export default function CourseDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<CourseWithEnrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    if (user && courseId) {
      fetchCourse()
    }
  }, [user, courseId])

  const fetchCourse = async () => {
    try {
      setLoading(true)

      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('is_published', true)
        .single()

      if (courseError) {
        console.error('Failed to fetch course:', courseError)
        router.push('/courses')
        return
      }

      // Fetch enrollment status
      const { data: enrollmentData } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user?.id)
        .eq('course_id', courseId)
        .single()

      setCourse({
        ...courseData,
        enrollment: enrollmentData || undefined
      })
    } catch (error) {
      console.error('Failed to fetch course:', error)
      router.push('/courses')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!user || !course) return

    try {
      setEnrolling(true)
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id,
          enrolled_at: new Date().toISOString(),
          progress_percentage: 0
        })

      if (error) {
        console.error('Failed to enroll:', error)
        return
      }

      // Refresh course data to show enrollment
      await fetchCourse()
    } catch (error) {
      console.error('Failed to enroll:', error)
    } finally {
      setEnrolling(false)
    }
  }

  const markAsComplete = async () => {
    if (!user || !course || !course.enrollment) return

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update({
          progress_percentage: 100,
          completed_at: new Date().toISOString()
        })
        .eq('id', course.enrollment.id)

      if (error) {
        console.error('Failed to mark as complete:', error)
        return
      }

      // Refresh course data
      await fetchCourse()
    } catch (error) {
      console.error('Failed to mark as complete:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!course) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
            <p className="text-gray-600 mb-6">The course you&apos;re looking for doesn&apos;t exist or isn&apos;t published.</p>
            <Link 
              href="/courses" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Courses
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const isEnrolled = !!course.enrollment
  const isCompleted = course.enrollment?.completed_at !== null
  const progressPercentage = course.enrollment?.progress_percentage || 0

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link 
              href="/courses"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Courses
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {course.description}
                </p>
                
                {/* Course Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <BookOpen size={16} className="mr-2" />
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {course.category}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>Created {formatDate(course.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Enrollment Actions */}
              <div className="mt-6 md:mt-0 md:ml-6">
                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll in Course'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isCompleted ? '✓ Completed' : '📚 In Progress'}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full">
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

                    {!isCompleted && (
                      <button
                        onClick={markAsComplete}
                        className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        Mark as Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Enrollment Info */}
            {course.enrollment && (
              <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
                <div className="flex flex-wrap gap-4">
                  <span>Enrolled: {formatDate(course.enrollment.enrolled_at)}</span>
                  {course.enrollment.completed_at && (
                    <span>Completed: {formatDate(course.enrollment.completed_at)}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
            <div className="prose prose-gray max-w-none">
              <CourseContentRenderer content={course.content} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}