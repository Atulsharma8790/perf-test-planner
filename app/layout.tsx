import { Suspense } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/theme'
import { AuthProvider } from '@/context/auth'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import PortfolioBar from '@/components/PortfolioBar'


export const metadata: Metadata = {
  title: 'Performance Test Planner — AI-Generated k6 & JMeter Test Plans',
  description: 'Describe your app and get a complete performance test plan — load scenarios, runnable k6 script, SLA thresholds, and monitoring recommendations.',
  authors: [{ name: "Atul Sharma", url: "https://atulsharma8790.github.io" }],
  creator: "Atul Sharma",
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', minHeight: '100vh' }}>
        <Suspense fallback={null}><PortfolioBar /></Suspense>
        <ThemeProvider><AuthProvider><DisclaimerBanner />{children}</AuthProvider></ThemeProvider>
      <Suspense fallback={null}><PortfolioBar /></Suspense></body>
    </html>
  )
}
