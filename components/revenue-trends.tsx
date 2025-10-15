"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", revenue: 40000 },
  { month: "Feb", revenue: 45000 },
  { month: "Mar", revenue: 43000 },
  { month: "Apr", revenue: 50000 },
  { month: "May", "revenue": 48000 },
  { month: "Jun", revenue: 55000 },
  { month: "Jul", revenue: 52000 },
  { month: "Aug", revenue: 54000 },
]

const chartConfig = {
  revenue: {
    label: "Revenue (RM)",
    // FIX: Use explicit hex code for the chart configuration
    color: "#facc15", 
  },
}

export function RevenueTrends() {
  return (
    <Card 
        className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-xl"
    >
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data}>
            {/* Grid/Axes: Set to visible light gray */}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" /> 
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `RM ${value / 1000}k`}
            />
            <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    indicator="dot" 
                    labelClassName="text-white"
                  />
                } 
            />
            <Bar
              dataKey="revenue"
              // Fill will now use the explicit hex code defined in chartConfig via var(--color-revenue)
              fill="var(--color-revenue)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}