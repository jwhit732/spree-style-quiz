'use client'

import { motion } from 'framer-motion'
import { Question } from '@/types/quiz'
import QuestionCard from './QuestionCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface QuizStepProps {
  question: Question
  currentAnswer: string | string[]
  onAnswerChange: (value: string | string[]) => void
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
  canProceed: boolean
  stepNumber: number
  totalSteps: number
}

export default function QuizStep({
  question,
  currentAnswer,
  onAnswerChange,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  canProceed,
  stepNumber,
  totalSteps
}: QuizStepProps) {
  
  const handleOptionSelect = (optionId: string) => {
    if (question.type === 'multiple') {
      const currentSelections = Array.isArray(currentAnswer) ? currentAnswer : []
      const maxSelections = question.maxSelections || 999
      
      if (currentSelections.includes(optionId)) {
        // Remove selection
        onAnswerChange(currentSelections.filter(id => id !== optionId))
      } else if (currentSelections.length < maxSelections) {
        // Add selection
        onAnswerChange([...currentSelections, optionId])
      }
    } else {
      // Single selection
      onAnswerChange(optionId)
    }
  }

  const isOptionSelected = (optionId: string) => {
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.includes(optionId)
    }
    return currentAnswer === optionId
  }

  const getSelectedCount = () => {
    return Array.isArray(currentAnswer) ? currentAnswer.length : 0
  }

  const isMaxSelectionsReached = () => {
    if (question.type !== 'multiple') return false
    const maxSelections = question.maxSelections || 999
    return getSelectedCount() >= maxSelections
  }

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-6"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ 
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1] // Custom easing for smoother animation
      }}
    >
      {/* Question Header */}
      <div className="text-center mb-12">
        <p className="text-primary-600 text-sm font-medium mb-2">
          Question {stepNumber} of {totalSteps}
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary-900 mb-4">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-primary-700 text-lg">
            {question.subtitle}
          </p>
        )}
        {question.type === 'multiple' && question.maxSelections && (
          <div className="mt-4 p-3 bg-accent-50 rounded-lg inline-block">
            <p className="text-accent-700 text-sm font-medium">
              {getSelectedCount()} of {question.maxSelections} selected
            </p>
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className={`mb-12 ${
        question.type === 'image' 
          ? 'grid grid-cols-2 md:grid-cols-3 gap-6'
          : 'space-y-4'
      }`}>
        {question.options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.2, 
              delay: index * 0.05,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <QuestionCard
              option={option}
              isSelected={isOptionSelected(option.id)}
              onSelect={handleOptionSelect}
              type={question.type}
              disabled={question.type === 'multiple' && isMaxSelectionsReached() && !isOptionSelected(option.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`btn-secondary flex items-center space-x-2 ${
            isFirst ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`btn-primary flex items-center space-x-2 ${
            !canProceed ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>{isLast ? 'Get Results' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}