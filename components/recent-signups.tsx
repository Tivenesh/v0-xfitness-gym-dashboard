import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const recentSignups = [
  {
    name: "Ethan Harper",
    plan: "Premium",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
  },
  {
    name: "Olivia Bennett",
    plan: "Standard",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
  },
  {
    name: "Noah Carter",
    plan: "Basic",
    status: "Inactive",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
  },
  {
    name: "Ava Reynolds",
    plan: "Premium",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
  },
]

export function RecentSignups() {
  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">Recent Signups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSignups.map((signup) => (
            <div
              key={signup.name}
              className="flex items-center gap-3 p-2 hover:bg-white/5 transition-colors rounded-none"
            >
              <Avatar className="h-10 w-10 border-2 border-primary/30">
                <AvatarImage src={signup.avatar || "/placeholder.svg"} alt={signup.name} />
                <AvatarFallback className="bg-primary text-black font-bold">{signup.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{signup.name}</p>
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
