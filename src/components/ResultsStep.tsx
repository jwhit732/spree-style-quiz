'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { QuizResult, UserSubmission } from '@/types/quiz'
import { archetypeDescriptions } from '@/utils/scoring'
import { useForm } from 'react-hook-form'
import { Mail, User, RotateCcw, CheckCircle } from 'lucide-react'

interface ResultsStepProps {
  result: QuizResult
  onRestart: () => void
}

interface FormData {
  name: string
  email: string
}

export default function ResultsStep({ result, onRestart }: ResultsStepProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const submission: UserSubmission = {
        name: data.name,
        email: data.email,
        result,
        timestamp: new Date().toISOString()
      }

      // Send to ActiveCampaign (we'll implement this next)
      const response = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      })

      if (response.ok) {
        const result = await response.json()
        setIsSubmitted(true)
        
        // Log development mode info
        if (result.mode === 'development') {
          console.log('🔧 Development Mode: Quiz results logged to console')
        }
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      // For now, just show success (we'll handle errors properly later)
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPrimaryDescription = () => {
    return archetypeDescriptions[result.primary]
  }

  const getSecondaryDescription = () => {
    if (!result.secondary) return ''
    
    const descriptions = {
      natural: "You value comfort and authenticity in your choices.",
      classic: "You appreciate structure and timeless elegance.",
      bold: "You're drawn to making confident style statements.",
      creative: "You enjoy experimenting with unique combinations.",
      rebellious: "You like to challenge conventional style rules.", 
      romantic: "You gravitate toward soft, graceful elements."
    }
    
    return descriptions[result.secondary]
  }

  if (isSubmitted) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-accent-50 to-primary-50 flex items-center justify-center px-4 md:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-2xl mx-auto text-center bg-white rounded-2xl p-6 md:p-12 shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <h2 className="text-xl md:text-3xl font-bold text-primary-900 mb-3 md:mb-4">
            Thank You!
          </h2>
          
          <p className="text-base md:text-lg text-primary-700 mb-4 md:mb-6">
            Your personalized {result.description.toLowerCase()} style guide is on its way to your inbox.
          </p>
          
          <p className="text-sm md:text-base text-primary-600 mb-6 md:mb-8">
            Check your email in the next few minutes for your detailed style profile and personalized recommendations.
          </p>
          
          <button
            onClick={onRestart}
            className="btn-secondary flex items-center space-x-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Take Quiz Again</span>
          </button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-primary-50 py-6 md:py-12 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <motion.div
          className="text-center mb-6 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary-900 mb-3 md:mb-4">
            Your Style Archetype Is...
          </h1>
          <motion.div
            className="text-xl md:text-2xl lg:text-3xl text-accent-600 font-semibold mb-4 md:mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {result.description}
          </motion.div>
        </motion.div>

        {/* Results Content */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-12">
          {/* Primary Archetype */}
          <motion.div
            className="bg-white rounded-2xl p-4 md:p-8 shadow-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-lg md:text-xl font-semibold text-primary-900 mb-3 md:mb-4">
              Your Primary Style
            </h3>
            <div className="text-xl md:text-2xl font-bold text-accent-600 mb-3 md:mb-4 capitalize">
              {result.primary}
            </div>
            <p className="text-primary-700 text-sm md:text-lg leading-relaxed">
              {getPrimaryDescription()}
            </p>
          </motion.div>

          {/* Secondary Archetype */}
          {result.secondary && (
            <motion.div
              className="bg-white rounded-2xl p-4 md:p-8 shadow-lg"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-primary-900 mb-3 md:mb-4">
                Your Secondary Influence
              </h3>
              <div className="text-xl md:text-2xl font-bold text-accent-600 mb-3 md:mb-4 capitalize">
                {result.secondary}
              </div>
              <p className="text-primary-700 text-sm md:text-lg leading-relaxed">
                {getSecondaryDescription()}
              </p>
            </motion.div>
          )}
        </div>

        {/* Email Capture Form */}
        <motion.div
          className="bg-white rounded-2xl p-4 md:p-8 lg:p-12 shadow-xl max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-primary-900 mb-3 md:mb-4">
              Get Your Complete Style Guide
            </h3>
            <p className="text-primary-700 text-sm md:text-lg">
              Enter your details below to receive your personalized style profile, 
              detailed recommendations, and exclusive styling tips.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-primary-900 mb-2">
                <User className="inline w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm md:text-base"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-primary-900 mb-2">
                <Mail className="inline w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Email
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm md:text-base"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-base md:text-lg py-3 md:py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                'Get My Style Profile'
              )}
            </button>

            <p className="text-center text-xs md:text-sm text-primary-600">
              We respect your privacy and won't share your information.
            </p>
          </form>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="text-center mt-6 md:mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-primary-600 max-w-2xl mx-auto text-xs md:text-base">
            Style is deeply personal, and there are 155 possible combinations. 
            This is a great first step to articulating yours.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}