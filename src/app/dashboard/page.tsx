'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ProgressDashboard from '@/components/progress/ProgressDashboard'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <ProgressDashboard />
      </div>
    </ProtectedRoute>
  )
}