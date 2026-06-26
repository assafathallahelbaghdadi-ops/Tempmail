import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono, Cairo } from 'next/font/google'
import './globals.css'
import { I18nProvider } from '@/lib/i18n'
import { Toaster } from '@/components/ui/sonner'
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from '@/lib/adsense'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const cairo = Cairo({ variable: '--font-arabic', subsets: ['arabic', 'latin'] })

export const metadata: Metadata = {
  title: 'TempMail — Free Temporary Email Address',
  description:
    'Generate a free, disposable temporary email address instantly. Receive activation and verification emails while keeping your real inbox private and spam-free. Available in English, French and Arabic.',
  generator: 'v0.app',
  keywords: [
    'temp mail',
    'temporary email',
    'disposable email',
    'fake email',
    'email temporaire',
    'بريد مؤقت',
    'anonymous email',
  ],
  openGraph: {
    title: 'TempMail — Free Temporary Email Address',
    description:
      'Generate a free, disposable temporary email address instantly. Keep your real inbox private and spam-free.',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1f2b' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} bg-background`}
    >
      <head>
        {ADSENSE_ENABLED && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="font-sans antialiased">
        <I18nProvider>
          {children}
          <Toaster richColors position="top-center" />
        </I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
