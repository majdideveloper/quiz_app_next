'use client'

interface QuizStatistic {
  quizName: string
  attempts: number
  avgScore: number
  passRate: number
}

interface QuizAnalyticsProps {
  data: QuizStatistic[]
}

export default function QuizAnalytics({ data }: QuizAnalyticsProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Analytics</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📝</span>
          </div>
          <p className="text-gray-500">No quiz data available</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getPassRateColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-500'
    if (rate >= 80) return 'bg-blue-500'
    if (rate >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quiz Analytics</h3>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {data.map((quiz, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900 flex-1 truncate">
                {quiz.quizName}
              </h4>
              <span className="ml-2 text-xs text-gray-500">
                {quiz.attempts} attempt{quiz.attempts !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Average Score */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600">Average Score</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(quiz.avgScore)}`}>
                  {quiz.avgScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    quiz.avgScore >= 90 ? 'bg-green-500' :
                    quiz.avgScore >= 80 ? 'bg-blue-500' :
                    quiz.avgScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${quiz.avgScore}%` }}
                />
              </div>
            </div>

            {/* Pass Rate */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600">Pass Rate (≥80%)</span>
                <span className="font-medium text-gray-900">{quiz.passRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPassRateColor(quiz.passRate)}`}
                  style={{ width: `${quiz.passRate}%` }}
                />
              </div>
            </div>

            {/* Performance Indicator */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Performance</span>
              <span className={`px-2 py-1 rounded-full font-medium ${
                quiz.avgScore >= 90 && quiz.passRate >= 90 ? 'bg-green-100 text-green-800' :
                quiz.avgScore >= 80 && quiz.passRate >= 80 ? 'bg-blue-100 text-blue-800' :
                quiz.avgScore >= 70 && quiz.passRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {quiz.avgScore >= 90 && quiz.passRate >= 90 ? 'Excellent' :
                 quiz.avgScore >= 80 && quiz.passRate >= 80 ? 'Good' :
                 quiz.avgScore >= 70 && quiz.passRate >= 70 ? 'Fair' : 'Needs Improvement'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {Math.round(data.reduce((sum, q) => sum + q.avgScore, 0) / data.length) || 0}%
            </div>
            <div className="text-xs text-gray-500">Overall Avg Score</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {Math.round(data.reduce((sum, q) => sum + q.passRate, 0) / data.length) || 0}%
            </div>
            <div className="text-xs text-gray-500">Overall Pass Rate</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {data.reduce((sum, q) => sum + q.attempts, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Attempts</div>
          </div>
        </div>
      </div>
    </div>
  )
}