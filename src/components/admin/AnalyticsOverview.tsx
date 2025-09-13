'use client'

interface AnalyticsData {
  totalUsers: number
  totalCourses: number
  totalQuizzes: number
  totalEnrollments: number
  activeUsers: number
  avgQuizScore: number
  completionRate: number
}

interface AnalyticsOverviewProps {
  data: AnalyticsData
}

export default function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const cards = [
    {
      title: 'Total Users',
      value: data.totalUsers,
      subtitle: `${data.activeUsers} active`,
      icon: '👥',
      color: 'bg-blue-50 text-blue-700',
      trend: data.activeUsers > 0 ? `${Math.round((data.activeUsers / data.totalUsers) * 100)}% active` : null
    },
    {
      title: 'Total Courses',
      value: data.totalCourses,
      subtitle: `${data.totalEnrollments} enrollments`,
      icon: '📚',
      color: 'bg-green-50 text-green-700',
      trend: data.totalCourses > 0 ? `${Math.round(data.totalEnrollments / data.totalCourses)} avg per course` : null
    },
    {
      title: 'Quiz Performance',
      value: `${data.avgQuizScore}%`,
      subtitle: 'Average score',
      icon: '📊',
      color: 'bg-purple-50 text-purple-700',
      trend: data.avgQuizScore >= 80 ? 'Excellent' : data.avgQuizScore >= 70 ? 'Good' : 'Needs improvement'
    },
    {
      title: 'Completion Rate',
      value: `${data.completionRate}%`,
      subtitle: 'Course completion',
      icon: '🎯',
      color: 'bg-yellow-50 text-yellow-700',
      trend: data.completionRate >= 80 ? 'Excellent' : data.completionRate >= 60 ? 'Good' : 'Low'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-xl`}>
              {card.icon}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <div className="text-sm text-gray-500">
                {card.subtitle}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              {card.title}
            </h3>
            {card.trend && (
              <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                card.trend === 'Excellent' || card.trend.includes('%') 
                  ? 'bg-green-100 text-green-800'
                  : card.trend === 'Good' 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {card.trend}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}