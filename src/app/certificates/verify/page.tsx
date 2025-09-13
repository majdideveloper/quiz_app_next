'use client'

import { useState } from 'react'
import { useCertificates } from '@/hooks/useCertificates'

interface VerificationResult {
  valid: boolean
  message?: string
  data?: {
    userName: string
    courseName: string
    score: number
    issuedAt: string
  }
}

export default function CertificateVerificationPage() {
  const [certificateId, setCertificateId] = useState('')
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const { verifyCertificate } = useCertificates()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certificateId.trim()) return

    setLoading(true)
    try {
      const verificationResult = await verifyCertificate(certificateId.trim())
      setResult(verificationResult)
    } catch (error) {
      setResult({ valid: false, message: 'Verification failed' })
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Certificate Verification
          </h1>
          <p className="text-gray-600">
            Enter a certificate ID to verify its authenticity and view details
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">
                Certificate ID
              </label>
              <input
                type="text"
                id="certificateId"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="CERT-XXXXX-XXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Certificate IDs are in the format: CERT-XXXXX-XXXXX
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !certificateId.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify Certificate'
              )}
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {result && (
          <div className={`rounded-lg p-8 ${
            result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                result.valid ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {result.valid ? (
                  <span className="text-green-600 text-lg">✓</span>
                ) : (
                  <span className="text-red-600 text-lg">✗</span>
                )}
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className={`text-lg font-semibold ${
                  result.valid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.valid ? 'Certificate Verified' : 'Certificate Invalid'}
                </h3>
                
                {result.valid && result.data ? (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-700">Recipient</p>
                        <p className="text-green-800">{result.data.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Course</p>
                        <p className="text-green-800">{result.data.courseName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Score</p>
                        <p className="text-green-800">{result.data.score}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Issued</p>
                        <p className="text-green-800">{formatDate(result.data.issuedAt)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className={`mt-2 text-sm ${
                    result.valid ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message || 'Certificate verification failed'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About Certificate Verification</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Our certificate verification system allows you to instantly verify the authenticity of any certificate issued by our platform.
            </p>
            <p>
              Each certificate is assigned a unique ID that can be used to verify:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>The recipient's name</li>
              <li>The course completed</li>
              <li>The final score achieved</li>
              <li>The date of issuance</li>
            </ul>
            <p>
              If you have questions about a certificate or need additional verification, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}