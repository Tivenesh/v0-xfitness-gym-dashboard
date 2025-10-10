import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { DotCursor } from '@/components/DotCursor'
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar' // Import the new Navbar component

export const metadata = {
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
      <body className="flex flex-col min-h-screen bg-black">
        <DotCursor />
        <PageTransitionWrapper>
          <Navbar /> {/* Add the Navbar here, at the top */}
          <main className="flex-grow">{children}</main>
          <Footer />
        </PageTransitionWrapper>
        <Analytics />
      </body>
    </html>
  )
}