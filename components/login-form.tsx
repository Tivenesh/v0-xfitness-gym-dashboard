"use client"

import type React from "react"

import { useState } from "react"
// Assuming these are custom/shadcn components
// You'll need to have these components defined in your project:
// Button: A custom button component.
// Input: A custom input component.
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

/**
 * @fileoverview LoginForm component.
 * * This component provides a login form with basic form submission handling, 
 * loading state, and simulated API call for authentication.
 * * NOTE: The authentication logic is simulated using a setTimeout. 
 * In a production application, you would replace this with a real API call (e.g., using 'fetch' or 'axios')
 * and handle the response, including storing the authentication token.
 */
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  // State for form data could be added here, e.g.,
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")

  /**
   * Handles the form submission event.
   * @param event The form submission event.
   */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call (e.g., POST request to /api/login)
    // Replace this setTimeout block with your actual authentication logic.
    setTimeout(() => {
      setIsLoading(false)

      // --- Simulated successful authentication ---
      // In a real application:
      // 1. You would handle the API response (e.g., error/success).
      // 2. The server response would typically contain a JWT token or session data.
      // 3. You would store this token securely (e.g., in an HTTP-only cookie, or local storage/session storage for client-side).
      // 4. Handle any potential authentication errors (e.g., display an error message).

      // Redirect to dashboard on simulated success
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
          {/* Username or Email Input */}
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
              // In a real app, you would add an onChange handler here to capture the input value.
              className="bg-transparent border-0 border-b-2 border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors"
            />
          </div>

          {/* Password Input */}
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
              // In a real app, you would add an onChange handler here to capture the input value.
              className="bg-transparent border-0 border-b-2 border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-wide text-lg py-6 rounded-none transition-all hover:shadow-[0_0_30px_rgba(252,211,77,0.5)]"
          disabled={isLoading}
        >
          {isLoading ? "LOGGING IN..." : "LOG IN"}
        </Button>
      </form>

      {/* Registration Link */}
      <div className="text-center text-sm text-white/70">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors font-bold">
          Register here
        </Link>
      </div>
    </div>
  )
}