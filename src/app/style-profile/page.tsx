'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Home, Share2, Check, Facebook, Send } from 'lucide-react'
import confetti from 'canvas-confetti'

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
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')

  // Format text with paragraph breaks after first sentence and every 2-3 sentences
  const formatTextWithBreaks = (text: string) => {
    if (!text) return ''

    // Split by periods followed by space or end of string
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

    let formatted = ''
    sentences.forEach((sentence, index) => {
      formatted += sentence

      // Add break after first sentence
      if (index === 0) {
        formatted += '\n\n'
      }
      // Add break every 2-3 sentences after that
      else if (index > 0 && (index % 2 === 0 || index % 3 === 0)) {
        formatted += '\n\n'
      }
    })

    return formatted
  }

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

  // Trigger confetti when profile loads successfully
  useEffect(() => {
    if (!loading && profile && !error) {
      // Trigger confetti after a short delay to sync with reveal animation
      const confettiTimer = setTimeout(() => {
        // Fire confetti from multiple points for better effect
        const duration = 2000
        const animationEnd = Date.now() + duration
        const defaults = {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          colors: ['#D4A574', '#C9976D', '#E8C9A0', '#B88A5C'] // Accent colors
        }

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min
        }

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now()

          if (timeLeft <= 0) {
            return clearInterval(interval)
          }

          const particleCount = 50 * (timeLeft / duration)

          // Fire from two different origins
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          })
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          })
        }, 250)
      }, 500) // Delay to sync with the page reveal

      return () => clearTimeout(confettiTimer)
    }
  }, [loading, profile, error])

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

  // Generate share content
  const getShareContent = () => {
    const styleDescription = fields.slug?.replace(/-/g, ' · ') || 'my style'
    const quizUrl = 'https://spreewithme.com.au/style-quiz' // Update with your actual domain
    const profileUrl = window.location.href

    return {
      styleDescription,
      // Social media post text
      socialText: `I just discovered my style profile is ${styleDescription.toUpperCase()}! 💫 Would you agree? Check yours here:`,
      quizUrl,
      profileUrl
    }
  }

  // Handle native share functionality
  const handleShare = async () => {
    const { styleDescription, socialText, quizUrl, profileUrl } = getShareContent()

    const shareData = {
      title: 'My Signature Style Profile',
      text: `${socialText} ${quizUrl}`,
      url: profileUrl
    }

    try {
      // Try native Web Share API first (works on mobile)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard (works on desktop)
        await navigator.clipboard.writeText(profileUrl)
        setShareStatus('copied')
        setTimeout(() => setShareStatus('idle'), 2000)
      }
    } catch (err) {
      // If user cancels share dialog or clipboard fails, just ignore
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error sharing:', err)
      }
    }
  }

  // Handle social media shares
  const handleSocialShare = (platform: 'facebook' | 'pinterest' | 'whatsapp') => {
    const { socialText, quizUrl } = getShareContent()
    const fullText = `${socialText} ${quizUrl}`

    switch (platform) {
      case 'facebook':
        // Facebook doesn't support pre-filled text, just shares the URL
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(quizUrl)}`
        window.open(facebookUrl, '_blank', 'width=600,height=400')
        break
      case 'pinterest':
        // Pinterest supports pre-filled description and URL
        const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(quizUrl)}&description=${encodeURIComponent(fullText)}`
        window.open(pinterestUrl, '_blank', 'width=750,height=550')
        break
      case 'whatsapp':
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`
        window.open(whatsappUrl, '_blank', 'width=600,height=400')
        break
    }
  }

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
            <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mb-2">
              Welcome, {userName}!
            </h1>
          )}
          <h2 className="text-xl md:text-2xl font-bold text-accent-600 capitalize">
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
              <div className="text-primary-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {formatTextWithBreaks(fields.text)}
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

        {/* Share Section */}
        <motion.div
          className="mt-12 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {/* Share Heading */}
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-semibold text-primary-900 mb-2">
              Share Your Style Discovery
            </h3>
            <p className="text-sm md:text-base text-primary-600">
              Let others discover their signature style too!
            </p>
          </div>

          {/* Social Share Buttons */}
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {/* General Share Button */}
            <button
              onClick={handleShare}
              className="btn-primary flex items-center space-x-2"
            >
              {shareStatus === 'copied' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleSocialShare('facebook')}
              className="flex items-center space-x-2 px-4 py-2 md:px-5 md:py-3 rounded-lg bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium transition-colors shadow-md hover:shadow-lg"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
              <span className="hidden sm:inline">Facebook</span>
            </button>

            {/* Pinterest */}
            <button
              onClick={() => handleSocialShare('pinterest')}
              className="flex items-center space-x-2 px-4 py-2 md:px-5 md:py-3 rounded-lg bg-[#E60023] hover:bg-[#CC001F] text-white font-medium transition-colors shadow-md hover:shadow-lg"
              aria-label="Share on Pinterest"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
              </svg>
              <span className="hidden sm:inline">Pinterest</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleSocialShare('whatsapp')}
              className="flex items-center space-x-2 px-4 py-2 md:px-5 md:py-3 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-white font-medium transition-colors shadow-md hover:shadow-lg"
              aria-label="Share on WhatsApp"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>

          {/* Quiz Again Button */}
          <div className="text-center pt-6 border-t border-primary-200">
            <button
              onClick={() => router.push('/')}
              className="btn-secondary"
            >
              Take the Quiz Again
            </button>
          </div>
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
