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
    if (!currentQuestion) return

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
    if (!currentQuestion) return false

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
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-6 md:py-8 px-6 md:px-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6 md:mb-8">
            Discover Your Signature Style
          </h1>

          {/* Animated Carousel */}
          <div className="mb-6 md:mb-8 overflow-hidden relative">
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

          <div className="max-w-2xl mx-auto space-y-5 md:space-y-6">
            <p className="text-primary-700 text-base leading-relaxed">
              This short quiz is a great first step to articulating your signature style. Expect to uncover your authentic style - based on what you like, how you see yourself, and how you want to be seen.
            </p>
            <p className="text-primary-700 text-base leading-relaxed">
              Style is deeply personal, and there are over 155 possible combination outcomes!
            </p>
            <p className="text-primary-700 text-sm leading-relaxed">
              At the end of this quiz, you'll receive your signature style defined, a free in-depth description of what that means, and unique tips to help you to lean into your unique style.
            </p>
            <p className="text-primary-700 text-sm leading-relaxed">
              Choose what feels most like you. Don't overthink it - just choose what feels right.
            </p>
          </div>

          <motion.button
            onClick={startQuiz}
            className="btn-primary text-base px-8 py-3 mt-6 md:mt-8"
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

  // Safety check - if no current question, show error or redirect
  if (!currentQuestion) {
    return (
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-primary-700 mb-4">Something went wrong with the quiz.</p>
          <button onClick={resetQuiz} className="btn-primary">
            Restart Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-2 md:py-6 min-h-full">
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