'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function Features() {
  const { t } = useTranslation()

  const features = [
    {
      icon: '🎯',
      title: t('advancedQuizBuilder'),
      description: t('advancedQuizBuilderDesc'),
      highlights: [
        'Multiple question types',
        'Rich media support',
        'Branching logic',
        'Timer controls'
      ]
    },
    {
      icon: '📊',
      title: t('powerfulAnalytics'),
      description: t('powerfulAnalyticsDesc'),
      highlights: [
        'Real-time progress tracking',
        'Performance insights',
        'Completion rates',
        'Custom reports'
      ]
    },
    {
      icon: '🏆',
      title: t('instantCertification'),
      description: t('instantCertificationDesc'),
      highlights: [
        'Automated certificates',
        'Digital verification',
        'Branded templates',
        'Compliance tracking'
      ]
    },
    {
      icon: '🌐',
      title: t('bilingualSupport'),
      description: t('bilingualSupportDesc'),
      highlights: [
        'English & French',
        'Auto-translation',
        'Cultural adaptation',
        'Regional compliance'
      ]
    },
    {
      icon: '♿',
      title: t('accessibilityFirst'),
      description: t('accessibilityFirstDesc'),
      highlights: [
        'WCAG 2.1 AA compliant',
        'Screen reader support',
        'Keyboard navigation',
        'High contrast modes'
      ]
    },
    {
      icon: '🔐',
      title: t('enterpriseSecurity'),
      description: t('enterpriseSecurityDesc'),
      highlights: [
        'Role-based access',
        'Data encryption',
        'PIPEDA compliance',
        'Audit trails'
      ]
    }
  ]

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            {t('features')}
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('everythingYouNeed')}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t('featuresSubtitle')}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Feature demonstration */}
        <div className="mt-24">
          <div className="mx-auto max-w-4xl">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-1">
              <div className="bg-white rounded-xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('seeItInAction')}
                  </h3>
                  <p className="text-gray-600">
                    {t('seeItInActionDesc')}
                  </p>
                </div>
                
                {/* Mock interface preview */}
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500">QuizPro Dashboard</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="h-16 bg-blue-100 rounded"></div>
                      <div className="h-16 bg-green-100 rounded"></div>
                      <div className="h-16 bg-purple-100 rounded"></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                    {t('tryInteractiveDemo')}
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}