'use client'

interface CoursePerformanceData {
  courseName: string
  enrollments: number
  completions: number
  avgProgress: number
}

interface CoursePerformanceChartProps {
  data: CoursePerformanceData[]
}

export default function CoursePerformanceChart({ data }: CoursePerformanceChartProps) {
  const maxEnrollments = Math.max(...data.map(d => d.enrollments), 1)

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📊</span>
          </div>
          <p className="text-gray-500">No course data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Course Performance</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-600">Enrollments</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600">Completions</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {data.map((course, index) => {
          const completionRate = course.enrollments > 0 
            ? Math.round((course.completions / course.enrollments) * 100)
            : 0

          return (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 truncate flex-1">
                  {course.courseName}
                </h4>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <span>{course.enrollments} enrolled</span>
                  <span>{course.completions} completed</span>
                  <span className={`px-2 py-1 rounded-full ${
                    completionRate >= 80 ? 'bg-green-100 text-green-800' :
                    completionRate >= 60 ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {completionRate}%
                  </span>
                </div>
              </div>

              {/* Enrollment Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Enrollments</span>
                  <span className="text-gray-700">{course.enrollments}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(course.enrollments / maxEnrollments) * 100}%` }}
                  />
                </div>
              </div>

              {/* Completion Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Completions</span>
                  <span className="text-gray-700">{course.completions}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${course.enrollments > 0 ? (course.completions / course.enrollments) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Average Progress */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Average Progress</span>
                  <span className="text-gray-700">{course.avgProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${course.avgProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}