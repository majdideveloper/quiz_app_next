'use client'

import { useProgress } from '@/hooks/useProgress'
import ProgressCard from './ProgressCard'
import ProgressChart from './ProgressChart'
import UserStatsCards from './UserStatsCards'

export default function ProgressDashboard() {
  const { courseProgress, userStats, loading, refreshProgress } = useProgress()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
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
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Progress</h1>
        <button
          onClick={refreshProgress}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* User Stats Cards */}
      {userStats && <UserStatsCards stats={userStats} />}

      {/* Progress Overview Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart courseProgress={courseProgress} />
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Progress</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {courseProgress.length > 0 ? (
              courseProgress.map((progress) => (
                <ProgressCard key={progress.course.id} progress={progress} />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Courses Yet</h3>
                <p className="text-gray-500 text-sm">
                  Start your learning journey by enrolling in a course!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}