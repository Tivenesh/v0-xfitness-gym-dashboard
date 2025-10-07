"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Dumbbell, Calendar, CreditCard, BarChart3, Settings } from "lucide-react"

const navigation = [
  { name: "Members", href: "/dashboard", icon: Users },
  { name: "Trainers", href: "/dashboard/trainers", icon: Dumbbell },
  { name: "Classes", href: "/dashboard/classes", icon: Calendar },
  { name: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-black border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center justify-center">
          <Image
            src="/xfitness-logo.jpg"
            alt="XFitness Logo"
            width={140}
            height={56}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-none text-sm font-bold uppercase tracking-wide transition-all",
                isActive
                  ? "bg-primary text-black shadow-[0_0_20px_rgba(252,211,77,0.3)]"
                  : "text-white/70 hover:bg-white/5 hover:text-primary",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
