"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", members: 1800 },
  { month: "Feb", members: 2100 },
  { month: "Mar", members: 1900 },
  { month: "Apr", members: 2300 },
  { month: "May", members: 2000 },
  { month: "Jun", members: 2400 },
  { month: "Jul", members: 2100 },
  { month: "Aug", members: 2345 },
]

const chartConfig = {
  members: {
    label: "Members",
    color: "hsl(var(--primary))",
  },
}

export function MembershipTrends() {
  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">Membership Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="members"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#fillMembers)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
