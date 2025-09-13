'use client'

interface Certificate {
  id: string
  certificate_id: string
  score: number
  issued_at: string
  course: {
    id: string
    title: string
    description: string
  }
}

interface CertificateCardProps {
  certificate: Certificate
  onView: () => void
}

export default function CertificateCard({ certificate, onView }: CertificateCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-700 bg-green-50'
    if (score >= 90) return 'text-blue-700 bg-blue-50'
    if (score >= 80) return 'text-purple-700 bg-purple-50'
    return 'text-gray-700 bg-gray-50'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Certificate Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🏆</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {certificate.course.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Certificate ID: {certificate.certificate_id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Body */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Final Score</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(certificate.score)}`}>
              {certificate.score}%
            </span>
          </div>

          {/* Issue Date */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Issued</span>
            <span className="text-sm text-gray-900 font-medium">
              {formatDate(certificate.issued_at)}
            </span>
          </div>

          {/* Course Description */}
          <div>
            <p className="text-sm text-gray-600 line-clamp-3">
              {certificate.course.description}
            </p>
          </div>
        </div>
      </div>

      {/* Certificate Footer */}
      <div className="px-6 pb-6">
        <div className="flex space-x-3">
          <button
            onClick={onView}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Certificate
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(certificate.certificate_id)
              // You could add a toast notification here
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            title="Copy Certificate ID"
          >
            📋
          </button>
        </div>
      </div>

      {/* Achievement Badge */}
      <div className="absolute top-4 right-4">
        {certificate.score >= 95 && (
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">★</span>
          </div>
        )}
      </div>
    </div>
  )
}