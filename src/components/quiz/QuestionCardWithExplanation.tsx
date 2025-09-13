'use client'

import { Question } from '@/types'
import Image from 'next/image'

interface QuestionCardWithExplanationProps {
  question: Question
  answer: string
  showExplanation: boolean
  onAnswerChange: (answer: string) => void
  onToggleExplanation: () => void
  // Navigation props
  currentQuestionIndex: number
  totalQuestions: number
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
}

export default function QuestionCardWithExplanation({ 
  question, 
  answer, 
  showExplanation, 
  onAnswerChange, 
  onToggleExplanation,
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false
}: QuestionCardWithExplanationProps) {
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
      {question.options?.map((option, index) => {
        const isSelected = answer === option
        const isCorrect = option === question.correct_answer
        const shouldHighlight = showExplanation && (isSelected || isCorrect)
        
        return (
          <label 
            key={index}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              shouldHighlight
                ? isCorrect 
                  ? 'bg-green-50 border-green-300' 
                  : isSelected 
                  ? 'bg-red-50 border-red-300' 
                  : 'hover:bg-gray-50'
                : isSelected
                ? 'bg-blue-50 border-blue-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={isSelected}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="mr-3 h-4 w-4 text-blue-600"
              disabled={showExplanation}
            />
            <span className="flex-1">{option}</span>
            {shouldHighlight && (
              <span className={`ml-2 text-sm font-medium ${
                isCorrect ? 'text-green-600' : isSelected ? 'text-red-600' : ''
              }`}>
                {isCorrect && '✓ Correct'}
                {isSelected && !isCorrect && '✗ Incorrect'}
              </span>
            )}
          </label>
        )
      })}
    </div>
  )

  const renderTrueFalse = () => (
    <div className="space-y-3">
      {['True', 'False'].map((option) => {
        const isSelected = answer === option
        const isCorrect = option === question.correct_answer
        const shouldHighlight = showExplanation && (isSelected || isCorrect)
        
        return (
          <label 
            key={option}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              shouldHighlight
                ? isCorrect 
                  ? 'bg-green-50 border-green-300' 
                  : isSelected 
                  ? 'bg-red-50 border-red-300' 
                  : 'hover:bg-gray-50'
                : isSelected
                ? 'bg-blue-50 border-blue-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={isSelected}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="mr-3 h-4 w-4 text-blue-600"
              disabled={showExplanation}
            />
            <span className="flex-1">{option}</span>
            {shouldHighlight && (
              <span className={`ml-2 text-sm font-medium ${
                isCorrect ? 'text-green-600' : isSelected ? 'text-red-600' : ''
              }`}>
                {isCorrect && '✓ Correct'}
                {isSelected && !isCorrect && '✗ Incorrect'}
              </span>
            )}
          </label>
        )
      })}
    </div>
  )

  const renderFillInBlank = () => {
    const isCorrect = answer && answer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim()
    
    return (
      <div className="space-y-3">
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type your answer here..."
          className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            showExplanation 
              ? isCorrect 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
              : ''
          }`}
          rows={4}
          disabled={showExplanation}
        />
        {showExplanation && (
          <div className="flex items-center justify-between">
            <div className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '✓ Correct answer' : '✗ Incorrect answer'}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Correct answer: </span>
              <span className="font-semibold text-green-600">{question.correct_answer}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

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
      <div className="mb-4">
        {renderQuestion()}
      </div>

      {/* Explanation Section */}
      {answer && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onToggleExplanation}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showExplanation 
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{showExplanation ? '🔍' : '💡'}</span>
              {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </button>
          </div>

          {showExplanation && question.explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm">💡</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Explanation</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showExplanation && !question.explanation && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-500 text-sm">ℹ️</span>
                </div>
                <p className="text-sm text-gray-600">
                  No explanation available for this question.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
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

      {/* Question Type Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500 uppercase">
          {question.question_type.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}