"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
      window.location.href = "/dashboard"
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">YOUR DETAILS</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label htmlFor="email" className="text-white text-sm font-medium">
              Username or Email *
            </label>
            <Input
              id="email"
              placeholder=""
              type="text"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              className="bg-transparent border-0 border-b-2 border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-white text-sm font-medium">
              Password *
            </label>
            <Input
              id="password"
              placeholder=""
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              required
              className="bg-transparent border-0 border-b-2 border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-wide text-lg py-6 rounded-none transition-all hover:shadow-[0_0_30px_rgba(252,211,77,0.5)]"
          disabled={isLoading}
        >
          {isLoading ? "LOGGING IN..." : "LOG IN"}
        </Button>
      </form>

      <div className="text-center text-sm text-white/70">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors font-bold">
          Register here
        </Link>
      </div>
    </div>
  )
}
