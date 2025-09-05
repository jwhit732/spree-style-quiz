import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Discover Your Style Archetype | Spree with Me',
  description: 'This short quiz helps uncover your authentic style – based on what you like, how you see yourself, and how you want to be seen.',
  keywords: 'style quiz, personal style, fashion archetype, style personality',
  openGraph: {
    title: 'Discover Your Style Archetype',
    description: 'Take our quiz to discover your unique style personality',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Iframe optimization */}
        <meta name="referrer" content="origin-when-cross-origin" />
      </head>
      <body className="min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}