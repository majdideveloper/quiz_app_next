'use client'

interface UserStats {
  totalEnrollments: number
  completedCourses: number
  totalQuizzesTaken: number
  averageScore: number
  totalTimeSpent: number
  certificatesEarned: number
}

interface UserStatsCardsProps {
  stats: UserStats
}

export default function UserStatsCards({ stats }: UserStatsCardsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const completionRate = stats.totalEnrollments > 0 
    ? Math.round((stats.completedCourses / stats.totalEnrollments) * 100)
    : 0

  const statsCards = [
    {
      title: 'Courses Enrolled',
      value: stats.totalEnrollments,
      subtitle: `${stats.completedCourses} completed`,
      icon: '📚',
      color: 'bg-blue-50 text-blue-700',
      progress: completionRate
    },
    {
      title: 'Quizzes Taken',
      value: stats.totalQuizzesTaken,
      subtitle: `${stats.averageScore}% avg score`,
      icon: '📝',
      color: 'bg-green-50 text-green-700',
      progress: null
    },
    {
      title: 'Time Spent',
      value: formatTime(stats.totalTimeSpent),
      subtitle: 'Learning time',
      icon: '⏱️',
      color: 'bg-purple-50 text-purple-700',
      progress: null
    },
    {
      title: 'Certificates',
      value: stats.certificatesEarned,
      subtitle: 'Earned',
      icon: '🏆',
      color: 'bg-yellow-50 text-yellow-700',
      progress: null
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-xl`}>
              {card.icon}
            </div>
            {card.progress !== null && (
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {card.progress}%
                </div>
                <div className="text-xs text-gray-500">completion</div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              {card.title}
            </h3>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {card.value}
            </div>
            <p className="text-sm text-gray-500">
              {card.subtitle}
            </p>
          </div>

          {card.progress !== null && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}