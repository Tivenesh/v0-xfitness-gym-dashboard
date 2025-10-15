// File: components/dashboard-header.tsx

"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation" 
import Link from "next/link" // Link is imported
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This maps URL paths to the title displayed in the header
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/trainers": "Trainers",
  "/dashboard/classes": "Classes",
  "/dashboard/subscriptions": "Subscriptions",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
  "/dashboard/profile": "Profile",
  "/dashboard/payments": "Payments",
  "/dashboard/notifications": "Notifications",
  "/dashboard/logs": "Access Logs",
  "/dashboard/members": "Members", // Covers both Add and Edit Member pages
}

export function DashboardHeader() {
  const pathname = usePathname()
  
  // Find the title that best matches the start of the current path
  const pageTitle = Object.keys(pageTitles).find(key => pathname.startsWith(key) && key !== "/dashboard")
    ? pageTitles[Object.keys(pageTitles).find(key => pathname.startsWith(key) && key !== "/dashboard")!]
    : "Dashboard";

  // Correct logout function that calls the API
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      window.location.href = "/login";
    }
  };

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
            
            {/* INTEGRATED LINK TO PROFILE PAGE */}
            <Link href="/dashboard/profile" passHref>
              <DropdownMenuItem className="text-white/70 hover:text-primary hover:bg-white/5 cursor-pointer">
                Profile
              </DropdownMenuItem>
            </Link>
            {/* END OF INTEGRATION */}

            <DropdownMenuItem className="text-white/70 hover:text-primary hover:bg-white/5 cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-white/70 hover:text-primary hover:bg-white/5 cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
            
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}