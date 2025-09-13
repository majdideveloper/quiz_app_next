'use client'

interface Activity {
  id: string
  userName: string
  quizName: string
  score: number
  completedAt: string
  type: 'quiz_completion'
}

interface RecentActivityFeedProps {
  activities: Activity[]
}

export default function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return '🎉'
    if (score >= 80) return '✅'
    if (score >= 70) return '⚡'
    return '📝'
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">🔄</span>
          </div>
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
              {getScoreIcon(activity.score)}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900 truncate">
                  <span className="font-medium">{activity.userName}</span>
                  {' completed '}
                  <span className="font-medium">{activity.quizName}</span>
                </p>
                <time className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {formatTimeAgo(activity.completedAt)}
                </time>
              </div>
              
              <div className="mt-1 flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(activity.score)}`}>
                  {activity.score}%
                </span>
                
                <span className={`text-xs font-medium ${
                  activity.score >= 80 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {activity.score >= 80 ? 'Passed' : 'Failed'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Link */}
      {activities.length >= 10 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Activity
          </button>
        </div>
      )}
    </div>
  )
}