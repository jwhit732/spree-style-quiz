'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { questions } from '@/data/questions'
import { QuizState } from '@/types/quiz'
import QuizStep from './QuizStep'
import ResultsStep from './ResultsStep'
import ProgressBar from './ProgressBar'
import { calculateQuizResult } from '@/utils/scoring'

export default function QuizContainer() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentStep: 0,
    answers: {},
    isComplete: false
  })

  const currentQuestion = questions[quizState.currentStep]
  const isLastStep = quizState.currentStep === questions.length - 1

  const handleAnswerChange = (value: string | string[]) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: value
      }
    }))
  }

  const handleNext = () => {
    if (isLastStep) {
      // Complete quiz and show results
      setQuizState(prev => ({
        ...prev,
        isComplete: true
      }))
    } else {
      // Go to next question
      setQuizState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }))
    }
  }

  const handlePrevious = () => {
    setQuizState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }))
  }

  const canProceed = () => {
    const currentAnswer = quizState.answers[currentQuestion.id]
    
    if (!currentAnswer) return false
    
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.length > 0
    }
    
    return true
  }

  const resetQuiz = () => {
    setQuizState({
      currentStep: 0,
      answers: {},
      isComplete: false
    })
  }

  // Calculate results when quiz is complete
  const quizResult = quizState.isComplete 
    ? calculateQuizResult(quizState.answers)
    : null

  if (quizState.isComplete && quizResult) {
    return (
      <ResultsStep 
        result={quizResult}
        onRestart={resetQuiz}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-6 md:py-8">
      {/* Header with Progress */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-2">
            Discover Your Style Archetype
          </h1>
          <p className="text-primary-700 text-lg max-w-2xl mx-auto">
            This short quiz helps uncover your authentic style – based on what you like, 
            how you see yourself, and how you want to be seen.
          </p>
        </div>
        <ProgressBar 
          current={quizState.currentStep + 1} 
          total={questions.length}
          className="max-w-md mx-auto"
        />
      </div>

      {/* Quiz Content */}
      <AnimatePresence mode="wait">
        <QuizStep
          key={quizState.currentStep}
          question={currentQuestion}
          currentAnswer={quizState.answers[currentQuestion.id] || (currentQuestion.type === 'multiple' ? [] : '')}
          onAnswerChange={handleAnswerChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirst={quizState.currentStep === 0}
          isLast={isLastStep}
          canProceed={canProceed()}
          stepNumber={quizState.currentStep + 1}
          totalSteps={questions.length}
        />
      </AnimatePresence>
    </div>
  )
}