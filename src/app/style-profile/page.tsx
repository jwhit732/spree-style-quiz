'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Home } from 'lucide-react'

interface StyleProfile {
  id: string
  fields: {
    slug?: string
    text?: string
    images?: Array<{ url: string }>
    [key: string]: any
  }
}

function StyleProfileContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [profile, setProfile] = useState<StyleProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Get parameters from URL
        const dataParam = searchParams.get('data')
        let primary: string | null = null
        let secondary: string | null = null
        let tertiary: string | null = null
        let name: string = ''

        if (dataParam) {
          // Parse the encoded data
          const data = JSON.parse(decodeURIComponent(dataParam))
          primary = data.primary
          secondary = data.secondary
          tertiary = data.tertiary
          name = data.name || ''
          setUserName(name)
        } else {
          // Fallback to individual params
          primary = searchParams.get('primary')
          secondary = searchParams.get('secondary')
          tertiary = searchParams.get('tertiary')
        }

        if (!primary) {
          setError('Missing signature style information')
          setLoading(false)
          return
        }

        // Fetch profile from API
        const params = new URLSearchParams()
        params.append('primary', primary)
        if (secondary) params.append('secondary', secondary)
        if (tertiary) params.append('tertiary', tertiary)

        const response = await fetch(`/api/style-profile?${params.toString()}`)

        if (!response.ok) {
          throw new Error('Failed to fetch style profile')
        }

        const data = await response.json()
        setProfile(data)
      } catch (err) {
        console.error('Error loading style profile:', err)
        setError('Failed to load your style profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 to-primary-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-12 h-12 text-accent-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-primary-700">Loading your personalized style profile...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 to-primary-50 flex items-center justify-center px-4">
        <motion.div
          className="max-w-2xl mx-auto text-center bg-white rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-lg text-primary-700 mb-6">
            {error || 'We couldn\'t load your style profile.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        </motion.div>
      </div>
    )
  }

  const { fields } = profile

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-primary-50 py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-primary-700 hover:text-primary-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Quiz</span>
          </button>

          {userName && (
            <h1 className="text-3xl md:text-5xl font-bold text-primary-900 mb-2">
              Welcome, {userName}!
            </h1>
          )}
          <h2 className="text-2xl md:text-4xl font-bold text-accent-600 capitalize">
            Your {fields.slug?.replace(/-/g, ' · ')} Style Profile
          </h2>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Text */}
          {fields.text && (
            <motion.div
              className="bg-white rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-primary-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                {fields.text}
              </div>
            </motion.div>
          )}

          {/* Images */}
          {fields.images && fields.images.length > 0 && (
            <motion.div
              className="grid md:grid-cols-2 gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {fields.images.map((image: any, index: number) => (
                <div key={index} className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={image.url}
                    alt={`Style inspiration ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Footer CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => router.push('/')}
            className="btn-secondary"
          >
            Take the Quiz Again
          </button>
        </motion.div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-primary-50 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loader2 className="w-12 h-12 text-accent-600 animate-spin mx-auto mb-4" />
        <p className="text-lg text-primary-700">Loading your personalized style profile...</p>
      </motion.div>
    </div>
  )
}

export default function StyleProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <StyleProfileContent />
    </Suspense>
  )
}
