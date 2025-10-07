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
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Signups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSignups.map((signup) => (
            <div key={signup.name} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={signup.avatar || "/placeholder.svg"} alt={signup.name} />
                <AvatarFallback>{signup.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{signup.name}</p>
                <p className="text-xs text-muted-foreground">{signup.plan}</p>
              </div>
              <Badge
                variant={signup.status === "Active" ? "default" : "destructive"}
                className={
                  signup.status === "Active"
                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                    : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
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
