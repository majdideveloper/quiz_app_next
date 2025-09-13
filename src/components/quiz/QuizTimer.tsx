'use client'

import { useEffect, useState } from 'react'

interface QuizTimerProps {
  timeRemaining: number
  onTimeUp: () => void
  onTick: (time: number) => void
}

export default function QuizTimer({ timeRemaining, onTimeUp, onTick }: QuizTimerProps) {
  const [seconds, setSeconds] = useState(timeRemaining)

  useEffect(() => {
    setSeconds(timeRemaining)
  }, [timeRemaining])

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setSeconds(prev => {
        const newTime = prev - 1
        onTick(newTime)
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [seconds, onTimeUp, onTick])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (seconds <= 300) return 'text-red-600' // Last 5 minutes
    if (seconds <= 600) return 'text-yellow-600' // Last 10 minutes
    return 'text-green-600'
  }

  const getProgressPercentage = () => {
    return (seconds / timeRemaining) * 100
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
          {formatTime(seconds)}
        </div>
        <div className="text-xs text-gray-500">Time Remaining</div>
      </div>
      
      {/* Progress bar */}
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            seconds <= 300 ? 'bg-red-500' : 
            seconds <= 600 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
    </div>
  )
}