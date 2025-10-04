'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Link from 'next/link'
import { Users, BookOpen, FileText, BarChart3, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface DashboardStats {
  totalUsers: number
  activeCourses: number
  totalQuizzes: number
  completionRate: number
}

interface RecentActivity {
  type: 'user' | 'course' | 'quiz'
  message: string
  details: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeCourses: 0,
    totalQuizzes: 0,
    completionRate: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
    fetchRecentActivity()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch active (published) courses
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      // Fetch total quizzes
      const { count: quizzesCount } = await supabase
        .from('quizzes')
        .select('*', { count: 'exact', head: true })

      // Calculate completion rate
      const { count: totalEnrollments } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true })

      const { count: completedEnrollments } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true })
        .not('completed_at', 'is', null)

      const completionRate = totalEnrollments && totalEnrollments > 0
        ? Math.round((completedEnrollments || 0) / totalEnrollments * 100)
        : 0

      setStats({
        totalUsers: usersCount || 0,
        activeCourses: coursesCount || 0,
        totalQuizzes: quizzesCount || 0,
        completionRate
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      const activities: RecentActivity[] = []

      // Get recent users
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('full_name, created_at')
        .order('created_at', { ascending: false })
        .limit(2)

      recentUsers?.forEach(user => {
        const timeAgo = getTimeAgo(user.created_at)
        activities.push({
          type: 'user',
          message: 'New user registration',
          details: `${user.full_name} joined ${timeAgo}`
        })
      })

      // Get recently published courses
      const { data: recentCourses } = await supabase
        .from('courses')
        .select('title, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1)

      recentCourses?.forEach(course => {
        activities.push({
          type: 'course',
          message: 'Course published',
          details: `"${course.title}" is now live`
        })
      })

      // Get recent quiz completions
      const { data: recentAttempts } = await supabase
        .from('quiz_attempts')
        .select('score, completed_at')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)

      if (recentAttempts && recentAttempts.length > 0) {
        activities.push({
          type: 'quiz',
          message: 'Quiz completed',
          details: `Score: ${recentAttempts[0].score}%`
        })
      }

      setRecentActivity(activities.slice(0, 3))
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Users
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? '...' : stats.totalUsers}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Active Courses
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? '...' : stats.activeCourses}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Quizzes
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? '...' : stats.totalQuizzes}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Completion Rate
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? '...' : `${stats.completionRate}%`}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/admin/courses"
                      className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <Plus size={16} className="mr-2" />
                      New Course
                    </Link>
                    <Link
                      href="/admin/quizzes"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Plus size={16} className="mr-2" />
                      New Quiz
                    </Link>
                    <Link
                      href="/admin/blog"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FileText size={16} className="mr-2" />
                      Manage Blog
                    </Link>
                    <Link
                      href="/admin/users"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Users size={16} className="mr-2" />
                      Manage Users
                    </Link>
                    <Link
                      href="/admin/analytics"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <BarChart3 size={16} className="mr-2" />
                      Analytics
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  {loading ? (
                    <div className="space-y-3">
                      <div className="animate-pulse h-16 bg-gray-200 rounded"></div>
                      <div className="animate-pulse h-16 bg-gray-200 rounded"></div>
                      <div className="animate-pulse h-16 bg-gray-200 rounded"></div>
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className={`border-l-4 pl-4 ${
                            activity.type === 'user'
                              ? 'border-green-400'
                              : activity.type === 'course'
                              ? 'border-blue-400'
                              : 'border-yellow-400'
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {activity.message}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}