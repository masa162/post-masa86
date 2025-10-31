import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: '中山雑記',
  description: '記録と感覚の交差点、unbelongの雑記ブログ。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* Cloudflare Web Analytics */}
        <Script
          defer
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "cloudflare-analytics-token"}'
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

