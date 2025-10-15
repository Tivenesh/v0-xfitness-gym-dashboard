"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Dumbbell, Calendar, CreditCard, BarChart3, Settings, Receipt, ShieldCheck, MessageSquare } from "lucide-react"

// Mock User for demonstration (Replace with actual authenticated user context/state)
const mockUser = {
  role: "Owner", // Change to "Staff" to see the effect
}

const allNavigation = [
  { name: "Members", href: "/dashboard", icon: Users, roles: ["Owner", "Staff"] },
  { name: "Trainers", href: "/dashboard/trainers", icon: Dumbbell, roles: ["Owner", "Staff"] },
  { name: "Payments", href: "/dashboard/payments", icon: Receipt, roles: ["Owner", "Staff"] }, // Corrected Icon
  { name: "Classes", href: "/dashboard/classes", icon: Calendar, roles: ["Owner", "Staff"] },
  { name: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard, roles: ["Owner"] }, // Owner only
  { name: "Access Logs", href: "/dashboard/logs", icon: ShieldCheck, roles: ["Owner"] },
  { name: "Notifications", href: "/dashboard/notifications", icon: MessageSquare, roles: ["Owner", "Staff"] }, // Added roles
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3, roles: ["Owner"] },         // Owner only
  { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["Owner"] },       // Owner only
]

export function DashboardSidebar() {
  const pathname = usePathname()
  
  // Filter navigation items based on the mock user's role
  const navigation = allNavigation.filter(item => 
    item.roles.includes(mockUser.role)
  );

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