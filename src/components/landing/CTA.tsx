'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function CTA() {
  const { t } = useTranslation()

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main CTA Content */}
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            {t('readyToTransform')}
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            {t('readyToTransformDesc')}
          </p>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-blue-100">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t('freeTrial14Days')}
            </div>
            <div className="flex items-center">
              <svg className="h-6 w-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t('noCreditCard')}
            </div>
            <div className="flex items-center">
              <svg className="h-6 w-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t('setupIn5Minutes')}
            </div>
            <div className="flex items-center">
              <svg className="h-6 w-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t('canadianSupport')}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-blue-600 bg-white rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t('startFreeTrial')}
              <svg className="ml-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <button className="inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white bg-transparent border-2 border-white rounded-xl hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-200">
              <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {t('talkToExpert')}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="border-t border-blue-400 pt-8">
            <p className="text-blue-200 text-sm mb-6">
              {t('joinCompanies')}
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              <div className="text-white font-semibold">500+ {t('companies')}</div>
              <div className="text-white font-semibold">25,000+ {t('employees')}</div>
              <div className="text-white font-semibold">1M+ {t('quizzesCompleted')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-purple-400 rounded-full opacity-10 blur-3xl"></div>
      </div>
    </section>
  )
}