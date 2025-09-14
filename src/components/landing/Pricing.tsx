'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function Pricing() {
  const { t } = useTranslation()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const plans = [
    {
      name: t('starter'),
      description: t('starterDesc'),
      price: billingCycle === 'monthly' ? { cad: 29, usd: 22 } : { cad: 290, usd: 220 },
      period: billingCycle === 'monthly' ? t('perMonth') : t('perYear'),
      users: '50',
      features: [
        'Up to 50 employees',
        'Unlimited quizzes',
        'Basic analytics',
        'Email support',
        'Certificate generation',
        'Bilingual support'
      ],
      popular: false,
      cta: t('startFreeTrial')
    },
    {
      name: t('professional'),
      description: t('professionalDesc'),
      price: billingCycle === 'monthly' ? { cad: 79, usd: 59 } : { cad: 790, usd: 590 },
      period: billingCycle === 'monthly' ? t('perMonth') : t('perYear'),
      users: '200',
      features: [
        'Up to 200 employees',
        'Advanced quiz builder',
        'Detailed analytics',
        'Priority support',
        'Custom branding',
        'API access',
        'Advanced reporting',
        'Bulk user management'
      ],
      popular: true,
      cta: t('startFreeTrial')
    },
    {
      name: t('enterprise'),
      description: t('enterpriseDesc'),
      price: { cad: 0, usd: 0 },
      period: t('customPricing'),
      users: t('unlimited'),
      features: [
        'Unlimited employees',
        'White-label solution',
        'Advanced integrations',
        'Dedicated support',
        'Custom development',
        'SLA guarantees',
        'Advanced security',
        'Training & onboarding'
      ],
      popular: false,
      cta: t('contactSales')
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            {t('pricing')}
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('flexiblePlans')}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t('flexiblePlansDesc')}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('monthly')}
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all relative ${
                  billingCycle === 'annual'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('annual')}
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {t('save20')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20'
                  : 'border-gray-100 hover:border-blue-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t('mostPopular')}
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    {plan.price.cad > 0 ? (
                      <>
                        <span className="text-4xl font-bold text-gray-900">
                          ${plan.price.cad}
                        </span>
                        <span className="text-lg text-gray-500 ml-1">CAD</span>
                        <span className="text-gray-400 ml-2">/</span>
                        <span className="text-2xl font-semibold text-gray-600 ml-2">
                          ${plan.price.usd} USD
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {plan.price.cad > 0 && plan.period} • Up to {plan.users} users
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.name === t('enterprise') ? (
                  <button className="w-full px-6 py-3 text-center text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200">
                    {plan.cta}
                  </button>
                ) : (
                  <Link
                    href="/auth/register"
                    className={`block w-full px-6 py-3 text-center text-lg font-semibold rounded-lg transition-all duration-200 ${
                      plan.popular
                        ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md'
                        : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('commonQuestions')}
          </h3>
          <p className="text-gray-600 mb-8">
            {t('commonQuestionsDesc')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('freeTrialQuestion')}
              </h4>
              <p className="text-gray-600 text-sm">
                {t('freeTrialAnswer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('cancellationQuestion')}
              </h4>
              <p className="text-gray-600 text-sm">
                {t('cancellationAnswer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('supportQuestion')}
              </h4>
              <p className="text-gray-600 text-sm">
                {t('supportAnswer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('customizationQuestion')}
              </h4>
              <p className="text-gray-600 text-sm">
                {t('customizationAnswer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}