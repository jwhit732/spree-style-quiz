'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { questions } from '@/data/questions'
import { QuizState } from '@/types/quiz'
import QuizStep from './QuizStep'
import ResultsStep from './ResultsStep'
import ProgressBar from './ProgressBar'
import { calculateQuizResult } from '@/utils/scoring'

export default function QuizContainer() {
  const [showIntro, setShowIntro] = useState(true)
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
    setShowIntro(true)
    setQuizState({
      currentStep: 0,
      answers: {},
      isComplete: false
    })
  }

  const startQuiz = () => {
    setShowIntro(false)
  }

  // Calculate results when quiz is complete
  const quizResult = quizState.isComplete 
    ? calculateQuizResult(quizState.answers)
    : null

  // Show intro screen first
  if (showIntro) {
    // Get archetype images from the questions data
    const archetypeImages = questions.find(q => q.type === 'image')?.options || []
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8 md:py-12 px-6 md:px-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-8 md:mb-10">
            Discover Your Style Archetype
          </h1>

          {/* Animated Carousel */}
          <div className="mb-8 md:mb-12 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-primary-50 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-primary-50 to-transparent z-10"></div>
            
            <motion.div 
              className="flex gap-4 md:gap-6"
              animate={{ 
                x: [0, -(120 * archetypeImages.length)]
              }}
              transition={{ 
                duration: 23,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ width: `${archetypeImages.length * 2 * 140}px` }}
            >
              {/* Create two sets for seamless loop */}
              {[...archetypeImages, ...archetypeImages].map((archetype, index) => (
                <motion.div
                  key={`${archetype.id}-${Math.floor(index / archetypeImages.length)}`}
                  className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % archetypeImages.length) * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                >
                  <img
                    src={archetype.imageUrl}
                    alt={archetype.imageAlt || archetype.text}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-1 left-1 right-1 md:bottom-2 md:left-2 md:right-2">
                      <p className="text-white text-xs md:text-sm font-medium text-center truncate">
                        {archetype.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
            <p className="text-primary-700 text-xl leading-relaxed">
              This short quiz helps uncover your authentic style – based on what you like, 
              how you see yourself, and how you want to be seen.
            </p>
            <p className="text-primary-600 text-lg leading-relaxed">
              Choose what feels most like you. Don't overthink it – just choose what feels right.
            </p>
            <p className="text-primary-500 text-lg leading-relaxed">
              There are 155 possible combinations — style is deeply personal, 
              and this is a great first step to articulating yours.
            </p>
          </div>

          <motion.button
            onClick={startQuiz}
            className="btn-primary text-lg md:text-xl px-10 py-4 mt-8 md:mt-12"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's Begin
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (quizState.isComplete && quizResult) {
    return (
      <ResultsStep 
        result={quizResult}
        onRestart={resetQuiz}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-2 md:py-6">
      {/* Progress Bar Only */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 mb-3 md:mb-8">
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