'use client'

interface EngagementData {
  date: string
  attempts: number
  completions: number
}

interface UserEngagementChartProps {
  data: EngagementData[]
}

export default function UserEngagementChart({ data }: UserEngagementChartProps) {
  const maxValue = Math.max(...data.map(d => Math.max(d.attempts, d.completions)), 1)

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📈</span>
          </div>
          <p className="text-gray-500">No engagement data available</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">User Engagement</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-600">Quiz Attempts</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600">Quiz Completions</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 w-8">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart bars */}
        <div className="ml-10 h-full flex items-end space-x-1">
          {data.map((item, index) => {
            const attemptHeight = (item.attempts / maxValue) * 100
            const completionHeight = (item.completions / maxValue) * 100

            return (
              <div key={index} className="flex-1 flex flex-col justify-end h-full relative group">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div>{formatDate(item.date)}</div>
                  <div>Attempts: {item.attempts}</div>
                  <div>Completions: {item.completions}</div>
                </div>

                {/* Bars */}
                <div className="flex space-x-1 items-end">
                  <div 
                    className="bg-blue-500 w-full rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${attemptHeight}%` }}
                  />
                  <div 
                    className="bg-green-500 w-full rounded-t transition-all hover:bg-green-600"
                    style={{ height: `${completionHeight}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* X-axis */}
        <div className="ml-10 mt-2 flex justify-between text-xs text-gray-500">
          {data.map((item, index) => (
            index % Math.ceil(data.length / 5) === 0 && (
              <span key={index}>{formatDate(item.date)}</span>
            )
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {data.reduce((sum, d) => sum + d.attempts, 0)}
          </div>
          <div className="text-xs text-gray-500">Total Attempts</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {data.reduce((sum, d) => sum + d.completions, 0)}
          </div>
          <div className="text-xs text-gray-500">Total Completions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {data.length > 0 
              ? Math.round(data.reduce((sum, d) => sum + d.attempts, 0) / data.length)
              : 0
            }
          </div>
          <div className="text-xs text-gray-500">Daily Average</div>
        </div>
      </div>
    </div>
  )
}