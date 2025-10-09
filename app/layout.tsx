// In: app/layout.tsx

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { DotCursor } from '@/components/DotCursor' // Import the new dot cursor

export const metadata: Metadata = {
  title: 'XFitness Gym',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <DotCursor /> {/* Add the dot cursor component here */}
        {children}
        <Analytics />
      </body>
    </html>
  )
}