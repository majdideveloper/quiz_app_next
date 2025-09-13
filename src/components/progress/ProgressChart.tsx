'use client'

import { CourseProgress } from '@/hooks/useProgress'

interface ProgressChartProps {
  courseProgress: CourseProgress[]
}

export default function ProgressChart({ courseProgress }: ProgressChartProps) {
  const getScoreDistribution = () => {
    const distribution = {
      excellent: 0, // 90-100%
      good: 0,      // 80-89%
      average: 0,   // 70-79%
      poor: 0       // <70%
    }

    courseProgress.forEach(progress => {
      if (progress.averageScore >= 90) distribution.excellent++
      else if (progress.averageScore >= 80) distribution.good++
      else if (progress.averageScore >= 70) distribution.average++
      else if (progress.averageScore > 0) distribution.poor++
    })

    return distribution
  }

  const getCompletionData = () => {
    const completed = courseProgress.filter(p => p.isCompleted).length
    const inProgress = courseProgress.filter(p => !p.isCompleted && p.completedQuizzes > 0).length
    const notStarted = courseProgress.filter(p => p.completedQuizzes === 0).length

    return { completed, inProgress, notStarted }
  }

  const scoreDistribution = getScoreDistribution()
  const completionData = getCompletionData()
  
  const total = Object.values(scoreDistribution).reduce((a, b) => a + b, 0)
  const totalCourses = Object.values(completionData).reduce((a, b) => a + b, 0)

  const scoreColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    average: 'bg-yellow-500',
    poor: 'bg-red-500'
  }

  const completionColors = {
    completed: 'bg-green-500',
    inProgress: 'bg-blue-500',
    notStarted: 'bg-gray-400'
  }

  if (courseProgress.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📊</span>
          </div>
          <p className="text-gray-500">No data available yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Progress Overview</h3>
      
      <div className="space-y-8">
        {/* Course Completion Status */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Course Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Completed</span>
              <span className="text-sm font-medium text-gray-800">{completionData.completed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-l-full"
                style={{ width: `${totalCourses > 0 ? (completionData.completed / totalCourses) * 100 : 0}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">In Progress</span>
              <span className="text-sm font-medium text-gray-800">{completionData.inProgress}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-l-full"
                style={{ width: `${totalCourses > 0 ? (completionData.inProgress / totalCourses) * 100 : 0}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Not Started</span>
              <span className="text-sm font-medium text-gray-800">{completionData.notStarted}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-400 h-2 rounded-l-full"
                style={{ width: `${totalCourses > 0 ? (completionData.notStarted / totalCourses) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Score Distribution */}
        {total > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3">Score Distribution</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Excellent (90-100%)</span>
                <span className="text-sm font-medium text-gray-800">{scoreDistribution.excellent}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-l-full"
                  style={{ width: `${(scoreDistribution.excellent / total) * 100}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Good (80-89%)</span>
                <span className="text-sm font-medium text-gray-800">{scoreDistribution.good}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-l-full"
                  style={{ width: `${(scoreDistribution.good / total) * 100}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Average (70-79%)</span>
                <span className="text-sm font-medium text-gray-800">{scoreDistribution.average}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-l-full"
                  style={{ width: `${(scoreDistribution.average / total) * 100}%` }}
                />
              </div>
              
              {scoreDistribution.poor > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Needs Improvement (&lt;70%)</span>
                    <span className="text-sm font-medium text-gray-800">{scoreDistribution.poor}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-l-full"
                      style={{ width: `${(scoreDistribution.poor / total) * 100}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}