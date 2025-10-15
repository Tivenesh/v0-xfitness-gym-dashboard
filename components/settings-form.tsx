"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label" // Assuming this is imported via global package.json
import { Separator } from "@radix-ui/react-separator" 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Settings as SettingsIcon } from "lucide-react"

export function SettingsForm() {
  const handleSave = () => {
    alert("Settings saved! (Simulated functionality)");
  }

  return (
    <div className="space-y-6">
      {/* 1. Account Settings Card */}
      <Card className="bg-black border-2 border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white font-black uppercase tracking-wide flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            My Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/50">
                    <AvatarImage
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NarVdsZO6GQsZCxUMfpFASjYKM3kQK.png"
                        alt="Admin"
                    />
                    <AvatarFallback className="bg-primary text-black font-bold text-xl">AD</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-xl font-bold text-white">Admin Dashboard User</h3>
                    <p className="text-sm text-white/70">Change profile picture or update personal details.</p>
                </div>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/70 text-sm font-medium">Full Name</Label>
                    <Input id="name" defaultValue="Admin User" className="bg-zinc-900 border-white/20 text-white/90" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70 text-sm font-medium">Email</Label>
                    <Input id="email" defaultValue="admin@xfitness.com" type="email" className="bg-zinc-900 border-white/20 text-white/90" />
                </div>
            </div>
            <Button onClick={handleSave} className="bg-primary text-black hover:bg-yellow-500 font-bold uppercase rounded-none">
                Update Profile
            </Button>
        </CardContent>
      </Card>

      {/* 2. Gym Details Card */}
      <Card className="bg-black border-2 border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white font-black uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Gym Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="location" className="text-white/70 text-sm font-medium">Location</Label>
                    <Input id="location" defaultValue="Skudai, Johor Bahru" className="bg-zinc-900 border-white/20 text-white/90" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact" className="text-white/70 text-sm font-medium">Contact Phone</Label>
                    <Input id="contact" defaultValue="011-7260 3994" className="bg-zinc-900 border-white/20 text-white/90" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hours" className="text-white/70 text-sm font-medium">Operating Hours</Label>
                    <Input id="hours" defaultValue="Everyday | 6 AM - 1 AM" className="bg-zinc-900 border-white/20 text-white/90" />
                </div>
            </div>
            <Button onClick={handleSave} className="bg-primary text-black hover:bg-yellow-500 font-bold uppercase rounded-none">
                Save Details
            </Button>
        </CardContent>
      </Card>
      
      {/* 3. System Card (General Settings Placeholder) */}
      <Card className="bg-black border-2 border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white font-black uppercase tracking-wide flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            System & Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-white/70">Configure payment gateways, third-party services, and user roles.</p>
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/20 hover:text-white font-bold uppercase rounded-none">
                Manage Roles
            </Button>
        </CardContent>
      </Card>
    </div>
  )
}