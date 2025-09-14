'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function Benefits() {
  const { t } = useTranslation()

  const benefits = [
    {
      statistic: '85%',
      label: t('higherCompletion'),
      description: t('higherCompletionDesc')
    },
    {
      statistic: '60%',
      label: t('timeSaved'),
      description: t('timeSavedDesc')
    },
    {
      statistic: '95%',
      label: t('complianceRate'),
      description: t('complianceRateDesc')
    },
    {
      statistic: '3x',
      label: t('fasterOnboarding'),
      description: t('fasterOnboardingDesc')
    }
  ]

  const outcomes = [
    {
      icon: '📈',
      title: t('improvePerformance'),
      description: t('improvePerformanceDesc'),
      details: [
        'Higher quiz scores',
        'Better retention rates',
        'Faster skill acquisition',
        'Reduced training gaps'
      ]
    },
    {
      icon: '💰',
      title: t('reduceCosts'),
      description: t('reduceCostsDesc'),
      details: [
        'Lower training overhead',
        'Reduced instructor time',
        'Minimize travel expenses',
        'Scalable solutions'
      ]
    },
    {
      icon: '✅',
      title: t('ensureCompliance'),
      description: t('ensureComplianceDesc'),
      details: [
        'Automatic record keeping',
        'Regulatory reporting',
        'Certification tracking',
        'Audit readiness'
      ]
    },
    {
      icon: '🚀',
      title: t('scaleEffectively'),
      description: t('scaleEffectivelyDesc'),
      details: [
        'Multi-location support',
        'Unlimited users',
        'Bulk enrollment',
        'Enterprise integration'
      ]
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Statistics Section */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            {t('provenResults')}
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('realImpact')}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t('realImpactDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-24">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-4">
                <div className="text-4xl font-bold mb-2">{benefit.statistic}</div>
                <div className="text-blue-100 text-sm uppercase tracking-wide">
                  {benefit.label}
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Outcomes Section */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('transformYourTraining')}
          </h3>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {t('transformYourTrainingDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {outcomes.map((outcome, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  {outcome.icon}
                </div>
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {outcome.title}
                </h4>
                <p className="text-gray-600 mb-4">
                  {outcome.description}
                </p>
                <ul className="space-y-2">
                  {outcome.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ROI Calculator Section */}
        <div className="mt-24 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t('calculateROI')}
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              {t('calculateROIDesc')}
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">500</div>
                  <div className="text-sm text-gray-600">Employees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">$50</div>
                  <div className="text-sm text-gray-600">Cost per hour</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">$125,000</div>
                  <div className="text-sm text-gray-600">Annual savings</div>
                </div>
              </div>
              
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                {t('calculateYourSavings')}
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}