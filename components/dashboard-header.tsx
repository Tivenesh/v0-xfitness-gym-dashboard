"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/trainers": "Trainers",
  "/dashboard/classes": "Classes",
  "/dashboard/subscriptions": "Subscriptions",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
}

export function DashboardHeader() {
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] || "Dashboard"

  return (
    <header className="h-16 border-b border-white/10 bg-black flex items-center justify-between px-6">
      <h1 className="text-3xl font-black text-white uppercase tracking-tight">{pageTitle}</h1>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative hover:bg-white/5">
          <Bell className="w-5 h-5 text-white/70" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(252,211,77,0.8)]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/5">
              <Avatar className="border-2 border-primary/50">
                <AvatarImage
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NarVdsZO6GQsZCxUMfpFASjYKM3kQK.png"
                  alt="Admin"
                />
                <AvatarFallback className="bg-primary text-black font-bold">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black border-white/10">
            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-white/70 hover:text-primary hover:bg-white/5">Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-white/70 hover:text-primary hover:bg-white/5">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-white/70 hover:text-primary hover:bg-white/5">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
