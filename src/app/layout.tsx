import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth/context'
import TranslationProvider from '@/components/providers/TranslationProvider'
import AppLayout from '@/components/navigation/AppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuizPro - Canadian Employee Training Platform | Interactive Quizzes & Compliance',
  description: 'Transform your Canadian workforce with QuizPro - the leading bilingual, accessible employee training platform. Create engaging quizzes, track progress, generate certificates, and ensure compliance. WCAG 2.1 AA compliant. Free 14-day trial.',
  keywords: 'employee training, canadian compliance, bilingual training, quiz platform, employee assessment, training management, WCAG accessible, certificate generation, corporate training, learning management system',
  authors: [{ name: 'QuizPro Team' }],
  creator: 'QuizPro',
  publisher: 'QuizPro',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://quizpro.ca'
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://quizpro.ca',
    title: 'QuizPro - Canadian Employee Training Platform',
    description: 'The leading bilingual, accessible employee training platform for Canadian organizations. Create engaging quizzes, track progress, and ensure compliance.',
    siteName: 'QuizPro',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'QuizPro - Canadian Employee Training Platform'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuizPro - Canadian Employee Training Platform',
    description: 'Transform your workforce with interactive, compliant training. Free 14-day trial.',
    images: ['/twitter-image.jpg'],
    creator: '@quizpro_ca'
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
  category: 'technology'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`} suppressHydrationWarning>
        <AuthProvider>
          <TranslationProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}