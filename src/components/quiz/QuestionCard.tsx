'use client'

import { Question } from '@/types'
import Image from 'next/image'

interface QuestionCardProps {
  question: Question
  answer: string
  onAnswerChange: (answer: string) => void
  // Navigation props
  currentQuestionIndex?: number
  totalQuestions?: number
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
}

export default function QuestionCard({ 
  question, 
  answer, 
  onAnswerChange,
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false
}: QuestionCardProps) {
  const renderQuestion = () => {
    switch (question.question_type) {
      case 'multiple_choice':
        return renderMultipleChoice()
      case 'true_false':
        return renderTrueFalse()
      case 'fill_in_blank':
        return renderFillInBlank()
      default:
        return null
    }
  }

  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <label 
          key={index}
          className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
            checked={answer === option}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="mr-3 h-4 w-4 text-blue-600"
          />
          <span className="flex-1">{option}</span>
        </label>
      ))}
    </div>
  )

  const renderTrueFalse = () => (
    <div className="space-y-3">
      {['True', 'False'].map((option) => (
        <label 
          key={option}
          className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
            checked={answer === option}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="mr-3 h-4 w-4 text-blue-600"
          />
          <span className="flex-1">{option}</span>
        </label>
      ))}
    </div>
  )

  const renderFillInBlank = () => (
    <div>
      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={4}
      />
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Question Text */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 flex-1">
            {question.question_text}
          </h2>
          <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
            {question.points} point{question.points !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Question Image */}
        {question.image_url && (
          <div className="mb-4">
            <Image 
              src={question.image_url}
              alt="Question image"
              width={500}
              height={300}
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                console.log('Image failed to load:', question.image_url)
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div>
        {renderQuestion()}
      </div>

      {/* Navigation Buttons */}
      {currentQuestionIndex !== undefined && totalQuestions !== undefined && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <span className="mr-2">←</span>
              Previous
            </button>

            <div className="text-sm text-gray-500 font-medium">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>

            <div>
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={onNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
                >
                  Next
                  <span className="ml-2">→</span>
                </button>
              ) : (
                <button
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className={`
                    px-6 py-2 rounded-lg font-medium transition-colors flex items-center
                    ${answer && answer.trim() !== ''
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Question Type Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500 uppercase">
          {question.question_type.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}