import { SignupForm } from "@/components/signup-form"
import Image from "next/image"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-center mb-8">
          <Image
            src="/xfitness-logo.jpg"
            alt="XFitness Logo"
            width={200}
            height={80}
            className="object-contain"
            priority
          />
        </div>

        <SignupForm />
      </div>
    </div>
  )
}
