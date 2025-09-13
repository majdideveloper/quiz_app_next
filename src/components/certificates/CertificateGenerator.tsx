'use client'

import { useRef } from 'react'
import { Course, QuizAttempt, Profile } from '@/types'

interface CertificateData {
  user: Profile
  course: Course
  completionDate: string
  score: number
  certificateId: string
}

interface CertificateGeneratorProps {
  data: CertificateData
  onClose?: () => void
}

export default function CertificateGenerator({ data, onClose }: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  const downloadCertificate = async () => {
    if (!certificateRef.current) return

    try {
      // Use html2canvas if available, otherwise provide download instructions
      if (typeof window !== 'undefined' && (window as any).html2canvas) {
        const html2canvas = (window as any).html2canvas
        const canvas = await html2canvas(certificateRef.current, {
          width: 1200,
          height: 800,
          scale: 2,
          backgroundColor: '#ffffff'
        })
        
        const link = document.createElement('a')
        link.download = `certificate-${data.certificateId}.png`
        link.href = canvas.toDataURL()
        link.click()
      } else {
        // Fallback: open print dialog
        window.print()
      }
    } catch (error) {
      console.error('Failed to generate certificate:', error)
      // Fallback to print
      window.print()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Certificate of Completion</h2>
          <div className="flex space-x-3">
            <button
              onClick={downloadCertificate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Certificate */}
        <div className="p-8">
          <div 
            ref={certificateRef}
            className="bg-white border-8 border-blue-600 p-12 text-center relative"
            style={{ 
              minHeight: '600px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              fontFamily: 'serif'
            }}
          >
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-blue-400"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-blue-400"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-blue-400"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-blue-400"></div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-blue-800 mb-2">
                Certificate of Completion
              </h1>
              <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
            </div>

            {/* Main content */}
            <div className="mb-8">
              <p className="text-lg text-gray-700 mb-6">
                This is to certify that
              </p>
              
              <h2 className="text-5xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2 inline-block min-w-96">
                {data.user.full_name}
              </h2>
              
              <p className="text-lg text-gray-700 mb-4">
                has successfully completed the course
              </p>
              
              <h3 className="text-3xl font-bold text-blue-800 mb-6">
                {data.course.title}
              </h3>
              
              <p className="text-lg text-gray-700 mb-6">
                with a score of <span className="font-bold text-green-600">{data.score}%</span>
              </p>
              
              <p className="text-lg text-gray-700">
                on <span className="font-semibold">{formatDate(data.completionDate)}</span>
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between mt-16">
              <div className="text-center">
                <div className="w-48 border-t-2 border-gray-400 pt-2">
                  <p className="text-sm text-gray-600 font-semibold">Training Administrator</p>
                  <p className="text-xs text-gray-500">Digital Signature</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl text-blue-600">🏆</span>
                  </div>
                  <p className="text-xs text-gray-500">Official Seal</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-48 border-t-2 border-gray-400 pt-2">
                  <p className="text-sm text-gray-600 font-semibold">Certificate ID</p>
                  <p className="text-xs text-gray-500 font-mono">{data.certificateId}</p>
                </div>
              </div>
            </div>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <div className="transform rotate-45 text-6xl font-bold text-blue-600">
                CERTIFIED
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>Certificate ID:</strong> {data.certificateId}
            </p>
            <p className="mb-2">
              <strong>Issued:</strong> {formatDate(data.completionDate)}
            </p>
            <p className="mb-2">
              <strong>Verification:</strong> This certificate can be verified using the Certificate ID above.
            </p>
            <p className="text-xs text-gray-500">
              This is a digitally generated certificate. No physical copy is required for validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}