"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentSignups() {
  const [signups, setSignups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentSignups() {
      setLoading(true)
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('join_date', { ascending: false }) // Get newest members first
        .limit(4) // Limit to 4 results

      if (error) {
        console.error('Error fetching recent signups:', error)
      } else if (data) {
        setSignups(data)
      }
      setLoading(false)
    }

    fetchRecentSignups()
  }, [])

  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">Recent Signups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && <p className="text-center text-sm text-white/50">Loading...</p>}
          
          {!loading && signups.map((signup) => (
            <div
              key={signup.id}
              className="flex items-center gap-3 p-2 hover:bg-white/5 transition-colors rounded-none"
            >
              <Avatar className="h-10 w-10 border-2 border-primary/30">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${signup.full_name}`} alt={signup.full_name} />
                <AvatarFallback className="bg-primary text-black font-bold">
                  {signup.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{signup.full_name}</p>
                <p className="text-xs text-white/50">{signup.plan}</p>
              </div>
              <Badge
                variant={signup.status === "Active" ? "default" : "destructive"}
                className={
                  signup.status === "Active"
                    ? "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 rounded-none font-bold"
                    : "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 rounded-none font-bold"
                }
              >
                {signup.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}