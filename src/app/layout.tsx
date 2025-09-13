import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth/context'
import TranslationProvider from '@/components/providers/TranslationProvider'
import AppLayout from '@/components/navigation/AppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quiz App - Employee Training Platform',
  description: 'Canadian employee quiz and training platform',
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