'use client'

import { Question } from '@/types'

interface QuizNavigationProps {
  currentQuestionIndex: number
  totalQuestions: number
  answers: Record<string, string>
  questions: Question[]
  onGoToQuestion: (index: number) => void
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export default function QuizNavigation({
  currentQuestionIndex,
  totalQuestions,
  answers,
  questions,
  onGoToQuestion,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting
}: QuizNavigationProps) {
  const getAnsweredCount = () => {
    return questions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length
  }

  const isQuestionAnswered = (question: Question) => {
    return answers[question.id] && answers[question.id].trim() !== ''
  }

  const allQuestionsAnswered = getAnsweredCount() === totalQuestions

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Progress Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {getAnsweredCount()} of {totalQuestions} answered
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((getAnsweredCount() / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getAnsweredCount() / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Grid */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Navigation</h3>
        <div className="grid grid-cols-10 gap-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => onGoToQuestion(index)}
              className={`
                w-10 h-10 rounded-lg text-sm font-medium transition-all
                ${index === currentQuestionIndex 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                  : isQuestionAnswered(question)
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              title={`Question ${index + 1}${isQuestionAnswered(question) ? ' (Answered)' : ' (Not answered)'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 rounded mr-1"></div>
          <span>Unanswered</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 rounded mr-1"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 rounded mr-1"></div>
          <span>Current</span>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Use the grid above to quickly jump between questions
        </p>
      </div>
    </div>
  )
}