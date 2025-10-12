'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { QuizResult, UserSubmission } from '@/types/quiz'
import { archetypeDescriptions } from '@/utils/scoring'
import { useForm } from 'react-hook-form'
import { Mail, User } from 'lucide-react'

interface ResultsStepProps {
  result: QuizResult
  onRestart: () => void
}

interface FormData {
  name: string
  email: string
  consent: boolean
}

export default function ResultsStep({ result, onRestart }: ResultsStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // Submit to ActiveCampaign via API
      const submission: UserSubmission = {
        name: data.name,
        email: data.email,
        result: result,
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      })

      if (!response.ok) {
        console.error('Failed to submit to ActiveCampaign:', await response.text())
        // Continue anyway to show results
      } else {
        console.log('Successfully submitted to ActiveCampaign')
      }

      // Encode the quiz result data to pass via URL
      const resultData = encodeURIComponent(JSON.stringify({
        name: data.name,
        email: data.email,
        primary: result.primary,
        secondary: result.secondary,
        tertiary: result.tertiary,
        description: result.description,
        timestamp: new Date().toISOString()
      }))

      // Redirect to style profile page with results
      window.location.href = `/style-profile?data=${resultData}`
    } catch (error) {
      console.error('Error submitting quiz:', error)
      // Fallback: still redirect without full data
      const params = new URLSearchParams()
      params.append('primary', result.primary)
      if (result.secondary) params.append('secondary', result.secondary)
      if (result.tertiary) params.append('tertiary', result.tertiary)
      window.location.href = `/style-profile?${params.toString()}`
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
          <h1 className="text-xl md:text-3xl font-bold text-primary-900 mb-3 md:mb-4">
            Thank You! Your signature style is defined as:
          </h1>
          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Glow effect background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-400/20 via-accent-500/30 to-accent-400/20 blur-xl rounded-full"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 2,
                delay: 0.5,
                ease: "easeInOut"
              }}
            />
            {/* Text content */}
            <div className="relative text-xl md:text-3xl text-accent-600 font-semibold mb-4 md:mb-6 px-6">
              {result.description}
            </div>
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
            <h3 className="text-base md:text-lg font-semibold text-primary-900 mb-3 md:mb-4">
              Your Primary Style
            </h3>
            <div className="text-lg md:text-xl font-bold text-accent-600 mb-3 md:mb-4 capitalize">
              {result.primary}
            </div>
            <p className="text-primary-700 text-sm md:text-base leading-relaxed">
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
              <h3 className="text-base md:text-lg font-semibold text-primary-900 mb-3 md:mb-4">
                Your Secondary Influence
              </h3>
              <div className="text-lg md:text-xl font-bold text-accent-600 mb-3 md:mb-4 capitalize">
                {result.secondary}
              </div>
              <p className="text-primary-700 text-sm md:text-base leading-relaxed">
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
            <h3 className="text-lg md:text-xl font-bold text-primary-900 mb-3 md:mb-4">
              Get A Complete Description of Your Signature Style
            </h3>
            <p className="text-primary-700 text-sm md:text-base">
              To understand what that means exactly, enter your email to receive your full description of your signature style with specific advice
              detailed recommendations, and exclusive styling advice.
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

            <div className="flex items-start space-x-3">
              <input
                {...register('consent', {
                  required: 'Please confirm you\'d like to join our style community'
                })}
                type="checkbox"
                id="consent"
                className="mt-1 w-4 h-4 md:w-5 md:h-5 rounded border-primary-300 text-accent-600 focus:ring-accent-500 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="consent" className="text-xs md:text-sm text-primary-700 leading-relaxed cursor-pointer">
                I'd love to join the Spree with Me community and receive my personalized style profile, along with occasional style inspiration, fashion tips, and updates that celebrate authentic self-expression.
              </label>
            </div>
            {errors.consent && (
              <p className="text-red-600 text-sm mt-1">{errors.consent.message}</p>
            )}

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
                'Get full description of my unique signature style'
              )}
            </button>

            <p className="text-center text-xs md:text-sm text-primary-600">
              Spree with Me and the Style Squad are here to support you. We’re a locally owned Australian company. By receiving your exclusive and unique signature style profile, you will also join us to receive occasional fashion and style news, and other stylish updates with and occasional news from us. Your details will remain private.
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