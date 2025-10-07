import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, DollarSign, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Active Members",
    value: "2,345",
    change: "+12% from last month",
    trend: "up",
    icon: Users,
  },
  {
    title: "New Signups",
    value: "123",
    change: "+5% from last month",
    trend: "up",
    icon: UserPlus,
  },
  {
    title: "Revenue",
    value: "$45,678",
    change: "+8% from last month",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Class Attendance",
    value: "87%",
    change: "-2% from last month",
    trend: "down",
    icon: TrendingUp,
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs mt-1 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
