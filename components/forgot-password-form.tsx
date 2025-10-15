"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call to send reset email
    setTimeout(() => {
      setIsLoading(false)
      setEmailSent(true)
    }, 1000)
  }

  if (emailSent) {
    return (
      <div className="space-y-6 text-center p-8 bg-zinc-900 rounded-lg">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Email Sent!</h2>
        <p className="text-white/70">
          We have sent a password reset link to your email address. Please check your inbox and spam folder.
        </p>
        <Link href="/login" passHref>
          <Button className="w-full bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-wide text-lg py-6 rounded-none transition-all hover:shadow-[0_0_30px_rgba(252,211,77,0.5)]">
            Back to Log In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">RESET PASSWORD</h1>
        <p className="text-white/70 max-w-sm mx-auto">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-2">
            <label htmlFor="email" className="text-white text-sm font-medium">
              Email *
            </label>
            <Input
              id="email"
              placeholder=""
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              className="bg-transparent border-0 border-b-2 border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors"
            />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-wide text-lg py-6 rounded-none transition-all hover:shadow-[0_0_30px_rgba(252,211,77,0.5)]"
          disabled={isLoading}
        >
          {isLoading ? "SENDING LINK..." : "SEND RESET LINK"}
        </Button>
      </form>
      
      <div className="text-center text-sm text-white/70">
        <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-bold flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4"/> Back to Log In
        </Link>
      </div>
    </div>
  )
}