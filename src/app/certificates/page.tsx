'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useCertificates } from '@/hooks/useCertificates'
import CertificateGenerator from '@/components/certificates/CertificateGenerator'
import CertificateCard from '@/components/certificates/CertificateCard'

export default function CertificatesPage() {
  const { certificates, loading, getCertificateData } = useCertificates()
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null)
  const [showGenerator, setShowGenerator] = useState(false)

  const handleViewCertificate = async (certificateId: string) => {
    const data = await getCertificateData(certificateId)
    if (data) {
      setSelectedCertificate(data)
      setShowGenerator(true)
    }
  }

  const handleCloseGenerator = () => {
    setShowGenerator(false)
    setSelectedCertificate(null)
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm h-64">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
            <p className="text-gray-600">
              View and download your earned course completion certificates
            </p>
          </div>

          {/* Certificates Grid */}
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onView={() => handleViewCertificate(certificate.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-4xl">🏆</span>
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Certificates Yet</h3>
              <p className="text-gray-500 mb-6">
                Complete courses and pass quizzes to earn certificates
              </p>
              <a
                href="/courses"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </a>
            </div>
          )}

          {/* Certificate Generator Modal */}
          {showGenerator && selectedCertificate && (
            <CertificateGenerator
              data={selectedCertificate}
              onClose={handleCloseGenerator}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}