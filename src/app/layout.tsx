import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Discover Your Signature Style | Spree with Me',
  description: 'This short quiz helps uncover your authentic style – based on what you like, how you see yourself, and how you want to be seen.',
  keywords: 'style quiz, personal style, fashion archetype, style personality',
  metadataBase: new URL('https://spreewithme.com'),
  openGraph: {
    title: 'Discover Your Signature Style',
    description: 'Take the quick style quiz and get your signature style.',
    type: 'website',
    url: 'https://spreewithme.com/style-quiz',
    images: [
      {
        url: 'https://images.squarespace-cdn.com/content/v1/5c3079f9f407b4ab43249324/b7717dac-2cf1-4f0a-8707-beebcd872331/Personal+Stylists+Australia+Spree+with+Me.jpg?format=2500w',
        width: 1200,
        height: 630,
        alt: 'Discover Your Style Profile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Your Signature Style',
    description: 'Take the quick style quiz and get your signature style.',
    images: ['https://images.squarespace-cdn.com/content/v1/5c3079f9f407b4ab43249324/b7717dac-2cf1-4f0a-8707-beebcd872331/Personal+Stylists+Australia+Spree+with+Me.jpg?format=2500w'],
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
        {/* Iframe height auto-resize script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.self !== window.top) {
                  // We're in an iframe
                  function sendHeight() {
                    const height = Math.max(
                      document.body.scrollHeight,
                      document.body.offsetHeight,
                      document.documentElement.clientHeight,
                      document.documentElement.scrollHeight,
                      document.documentElement.offsetHeight
                    );
                    window.parent.postMessage({
                      type: 'iframeResize',
                      height: height
                    }, '*');
                  }

                  // Send height on load
                  if (document.readyState === 'complete') {
                    sendHeight();
                  } else {
                    window.addEventListener('load', sendHeight);
                  }

                  // Send height on resize
                  window.addEventListener('resize', sendHeight);

                  // Use MutationObserver to detect DOM changes
                  const observer = new MutationObserver(sendHeight);
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true
                  });

                  // Send height periodically as backup
                  setInterval(sendHeight, 100);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}