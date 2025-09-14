'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function Testimonials() {
  const { t } = useTranslation()

  const testimonials = [
    {
      content: "QuizPro transformed our employee training program. We've seen an 85% increase in completion rates and our staff are much more engaged with the interactive content.",
      author: "Sarah Chen",
      role: "HR Director",
      company: "TechCorp Canada",
      avatar: "🧑‍💼"
    },
    {
      content: "The bilingual support and accessibility features were crucial for our diverse workforce. Finally, a platform that truly understands Canadian compliance requirements.",
      author: "Jean-Pierre Dubois",
      role: "Training Manager",
      company: "Maple Manufacturing",
      avatar: "👨‍🏫"
    },
    {
      content: "Implementation was seamless and the analytics give us insights we never had before. Our training ROI has improved by 60% in just six months.",
      author: "Priya Patel",
      role: "Learning & Development",
      company: "Northern Bank",
      avatar: "👩‍💼"
    },
    {
      content: "The certificate generation and tracking features have made our compliance audits so much easier. Everything is automated and always up-to-date.",
      author: "Michael Thompson",
      role: "Compliance Officer",
      company: "HealthCare Plus",
      avatar: "👨‍⚕️"
    },
    {
      content: "Customer support is outstanding. They helped us customize the platform to match our specific industry needs. Highly recommend for enterprise use.",
      author: "Lisa Rodriguez",
      role: "VP Operations",
      company: "Energy Solutions Ltd",
      avatar: "👩‍💻"
    },
    {
      content: "Our remote teams love the mobile-friendly interface. Training completion rates improved dramatically once we switched to QuizPro.",
      author: "David Kim",
      role: "Regional Manager",
      company: "Coast to Coast Retail",
      avatar: "🧑‍💻"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            {t('testimonials')}
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('whatClientsSay')}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t('whatClientsSayDesc')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-gray-700 mb-6">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center">
                <div className="text-2xl mr-3">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-blue-600">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Case Study Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                {t('caseStudyTitle')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('caseStudyDesc')}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                  <div className="text-sm text-gray-600">{t('employeesTrained')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">95%</div>
                  <div className="text-sm text-gray-600">{t('completionRate')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">60%</div>
                  <div className="text-sm text-gray-600">{t('timeSaved')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-1">$150k</div>
                  <div className="text-sm text-gray-600">{t('annualSavings')}</div>
                </div>
              </div>

              <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-blue-200">
                {t('readFullCaseStudy')}
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">🏢</div>
                <div>
                  <div className="font-bold text-xl text-gray-900">TechCorp Canada</div>
                  <div className="text-gray-600">Technology Services • 500+ employees</div>
                </div>
              </div>

              <blockquote className="text-gray-700 italic mb-6">
                "QuizPro helped us modernize our entire training approach. The results speak for themselves - higher engagement, better retention, and significant cost savings."
              </blockquote>

              <div className="flex items-center">
                <div className="text-2xl mr-3">👩‍💼</div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-sm text-gray-600">HR Director</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm mb-8">{t('certifiedAndSecure')}</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm font-bold">✓</div>
              <span className="text-gray-600">PIPEDA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-bold">AA</div>
              <span className="text-gray-600">WCAG 2.1 AA</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-sm font-bold">🔒</div>
              <span className="text-gray-600">SOC 2 Type II</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-sm font-bold">🍁</div>
              <span className="text-gray-600">Canada First</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}