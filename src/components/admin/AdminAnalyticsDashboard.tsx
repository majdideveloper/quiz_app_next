'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import AnalyticsOverview from './AnalyticsOverview'
import CoursePerformanceChart from './CoursePerformanceChart'
import UserEngagementChart from './UserEngagementChart'
import QuizAnalytics from './QuizAnalytics'
import RecentActivityFeed from './RecentActivityFeed'

interface AnalyticsData {
  totalUsers: number
  totalCourses: number
  totalQuizzes: number
  totalEnrollments: number
  activeUsers: number
  avgQuizScore: number
  completionRate: number
  coursePerformance: any[]
  userEngagement: any[]
  quizStatistics: any[]
  recentActivity: any[]
}

export default function AdminAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Calculate date range
      const now = new Date()
      const daysAgo = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      }[timeRange]
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

      // Fetch overview statistics
      const [
        { count: totalUsers },
        { count: totalCourses },
        { count: totalQuizzes },
        { count: totalEnrollments },
        { data: recentLogins },
        { data: quizAttempts },
        { data: enrollments }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('quizzes').select('*', { count: 'exact', head: true }),
        supabase.from('course_enrollments').select('*', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('id, updated_at')
          .gte('updated_at', startDate.toISOString()),
        supabase
          .from('quiz_attempts')
          .select('*, quizzes(title, course_id), profiles(full_name)')
          .gte('started_at', startDate.toISOString()),
        supabase
          .from('course_enrollments')
          .select('*, courses(title), profiles(full_name)')
          .gte('enrolled_at', startDate.toISOString())
      ])

      // Calculate metrics
      const activeUsers = recentLogins?.length || 0
      const completedAttempts = quizAttempts?.filter(a => a.completed_at) || []
      const avgQuizScore = completedAttempts.length > 0 
        ? Math.round(completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length)
        : 0
      const completedEnrollments = enrollments?.filter(e => e.completed_at) || []
      const completionRate = enrollments && enrollments.length > 0 
        ? Math.round((completedEnrollments.length / enrollments.length) * 100)
        : 0

      // Process course performance data
      const coursePerformance = await fetchCoursePerformance(startDate)
      const userEngagement = await fetchUserEngagement(startDate)
      const quizStatistics = await fetchQuizStatistics(startDate)
      const recentActivity = await fetchRecentActivity()

      setAnalyticsData({
        totalUsers: totalUsers || 0,
        totalCourses: totalCourses || 0,
        totalQuizzes: totalQuizzes || 0,
        totalEnrollments: totalEnrollments || 0,
        activeUsers,
        avgQuizScore,
        completionRate,
        coursePerformance,
        userEngagement,
        quizStatistics,
        recentActivity
      })
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCoursePerformance = async (startDate: Date) => {
    const { data: courses } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        course_enrollments!inner(
          id,
          completed_at,
          progress_percentage,
          enrolled_at
        )
      `)
      .gte('course_enrollments.enrolled_at', startDate.toISOString())

    return courses?.map(course => ({
      courseName: course.title,
      enrollments: course.course_enrollments.length,
      completions: course.course_enrollments.filter(e => e.completed_at).length,
      avgProgress: course.course_enrollments.length > 0
        ? Math.round(
            course.course_enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / 
            course.course_enrollments.length
          )
        : 0
    })) || []
  }

  const fetchUserEngagement = async (startDate: Date) => {
    const { data: dailyActivity } = await supabase
      .from('quiz_attempts')
      .select('started_at, completed_at')
      .gte('started_at', startDate.toISOString())

    // Group by day
    const dailyStats = new Map()
    dailyActivity?.forEach(attempt => {
      const date = new Date(attempt.started_at).toISOString().split('T')[0]
      if (!dailyStats.has(date)) {
        dailyStats.set(date, { date, attempts: 0, completions: 0 })
      }
      const stat = dailyStats.get(date)
      stat.attempts++
      if (attempt.completed_at) stat.completions++
    })

    return Array.from(dailyStats.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  const fetchQuizStatistics = async (startDate: Date) => {
    const { data: quizData } = await supabase
      .from('quizzes')
      .select(`
        id,
        title,
        quiz_attempts!inner(
          id,
          score,
          completed_at,
          started_at
        )
      `)
      .gte('quiz_attempts.started_at', startDate.toISOString())

    return quizData?.map(quiz => {
      const attempts = quiz.quiz_attempts.filter(a => a.completed_at)
      const avgScore = attempts.length > 0
        ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
        : 0
      
      return {
        quizName: quiz.title,
        attempts: attempts.length,
        avgScore,
        passRate: attempts.length > 0 
          ? Math.round((attempts.filter(a => (a.score || 0) >= 80).length / attempts.length) * 100)
          : 0
      }
    }).sort((a, b) => b.attempts - a.attempts) || []
  }

  const fetchRecentActivity = async () => {
    const { data: activities } = await supabase
      .from('quiz_attempts')
      .select(`
        id,
        score,
        completed_at,
        started_at,
        quizzes(title),
        profiles(full_name)
      `)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(10)

    return activities?.map((activity: any) => ({
      id: activity.id,
      userName: activity.profiles?.full_name || 'Unknown User',
      quizName: activity.quizzes?.title || 'Unknown Quiz',
      score: activity.score,
      completedAt: activity.completed_at,
      type: 'quiz_completion'
    })) || []
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm h-32">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm h-96">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm h-96">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Failed to load analytics data</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="bg-white rounded-lg p-1 shadow-sm">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range === '7d' ? '7 Days' : 
               range === '30d' ? '30 Days' : 
               range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <AnalyticsOverview data={analyticsData} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoursePerformanceChart data={analyticsData.coursePerformance} />
        <UserEngagementChart data={analyticsData.userEngagement} />
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuizAnalytics data={analyticsData.quizStatistics} />
        <RecentActivityFeed activities={analyticsData.recentActivity} />
      </div>
    </div>
  )
}