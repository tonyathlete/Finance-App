import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const interLedger = Inter({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-ledger',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Quiz ADM',
  description: 'Rencontre financière, conseiller et client',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} ${inter.variable} ${interLedger.variable}`}>
      <body className="min-h-screen bg-papier">{children}</body>
    </html>
  )
}
