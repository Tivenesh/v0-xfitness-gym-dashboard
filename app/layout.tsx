import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { DotCursor } from '@/components/DotCursor'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { WhatsAppButton } from '@/components/WhatsAppButton' // Import the new component

export const metadata = {
  title: 'XFitness Gym',
  description: 'Created with v0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-black">
        <DotCursor />
        <Navbar />
        <main className="flex-grow pt-24">{children}</main>
        <Footer />
        <WhatsAppButton /> {/* Add the button here */}
        <Analytics />
      </body>
    </html>
  )
}