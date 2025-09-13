'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase/client'
import { Course, Quiz, CourseEnrollment, QuizAttempt } from '@/types'

export interface CourseProgress {
  course: Course
  enrollment: CourseEnrollment
  quizzes: Quiz[]
  attempts: QuizAttempt[]
  completedQuizzes: number
  totalQuizzes: number
  averageScore: number
  bestScore: number
  timeSpent: number
  isCompleted: boolean
}

interface UserStats {
  totalEnrollments: number
  completedCourses: number
  totalQuizzesTaken: number
  averageScore: number
  totalTimeSpent: number
  certificatesEarned: number
}

export function useProgress() {
  const { user } = useAuth()
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    
    fetchProgressData()
  }, [user])

  const fetchProgressData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch all user enrollments with course data
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (*)
        `)
        .eq('user_id', user.id)

      if (enrollmentsError) {
        console.error('Failed to fetch enrollments:', enrollmentsError)
        return
      }

      // Fetch all quiz attempts for the user
      const { data: attempts, error: attemptsError } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)

      if (attemptsError) {
        console.error('Failed to fetch quiz attempts:', attemptsError)
        return
      }

      // Process each enrollment to calculate detailed progress
      const progressData: CourseProgress[] = []
      
      for (const enrollment of enrollments || []) {
        const course = enrollment.courses
        
        // Fetch quizzes for this course
        const { data: quizzes } = await supabase
          .from('quizzes')
          .select('*')
          .eq('course_id', course.id)
          .eq('is_published', true)

        // Filter attempts for this course's quizzes
        const courseQuizIds = (quizzes || []).map(q => q.id)
        const courseAttempts = (attempts || []).filter(attempt => 
          courseQuizIds.includes(attempt.quiz_id) && attempt.completed_at
        )

        // Calculate metrics
        const completedQuizzes = new Set(courseAttempts.map(a => a.quiz_id)).size
        const totalQuizzes = (quizzes || []).length
        
        const scores = courseAttempts.map(a => a.score || 0)
        const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
        const bestScore = scores.length > 0 ? Math.max(...scores) : 0
        
        const timeSpent = courseAttempts.reduce((total, attempt) => total + (attempt.time_taken || 0), 0)
        
        const isCompleted = enrollment.completed_at !== null

        progressData.push({
          course,
          enrollment,
          quizzes: quizzes || [],
          attempts: courseAttempts,
          completedQuizzes,
          totalQuizzes,
          averageScore,
          bestScore,
          timeSpent,
          isCompleted
        })
      }

      setCourseProgress(progressData)

      // Calculate overall user stats
      const stats: UserStats = {
        totalEnrollments: progressData.length,
        completedCourses: progressData.filter(p => p.isCompleted).length,
        totalQuizzesTaken: (attempts || []).filter(a => a.completed_at).length,
        averageScore: calculateOverallAverageScore(attempts || []),
        totalTimeSpent: (attempts || []).reduce((total, attempt) => total + (attempt.time_taken || 0), 0),
        certificatesEarned: progressData.filter(p => p.isCompleted && p.averageScore >= 80).length
      }

      setUserStats(stats)
    } catch (error) {
      console.error('Failed to fetch progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateOverallAverageScore = (attempts: QuizAttempt[]) => {
    const completedAttempts = attempts.filter(a => a.completed_at && a.score !== null)
    if (completedAttempts.length === 0) return 0
    
    const totalScore = completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0)
    return Math.round(totalScore / completedAttempts.length)
  }

  const getProgressPercentage = (progress: CourseProgress) => {
    if (progress.totalQuizzes === 0) return 100
    return Math.round((progress.completedQuizzes / progress.totalQuizzes) * 100)
  }

  const refreshProgress = () => {
    fetchProgressData()
  }

  return {
    courseProgress,
    userStats,
    loading,
    refreshProgress,
    getProgressPercentage
  }
}