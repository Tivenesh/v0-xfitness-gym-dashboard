import { ForgotPasswordForm } from "@/components/forgot-password-form"
import Image from "next/image"
import { Info } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="w-full bg-primary py-3 px-4 flex items-center justify-center gap-2 border-b border-primary/20">
        <span className="text-black font-bold uppercase tracking-wide text-sm md:text-base">
          ACCOUNT RECOVERY
        </span>
        <Info className="w-5 h-5 text-black" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl space-y-8">
          <div className="flex items-center justify-center mb-12">
            <Image
              src="/xfitness-logo.jpg"
              alt="XFitness Logo"
              width={200}
              height={80}
              className="object-contain"
              priority
            />
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
} 