"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  members: {
    label: "New Members",
    color: "#facc15",
  },
}

export function MembershipTrends() {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMembershipTrends() {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_monthly_signups');

      if (error) {
        console.error("Error fetching membership trends:", error);
      } else {
        setChartData(data);
      }
      
      setLoading(false);
    }

    fetchMembershipTrends();
  }, [])

  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">Monthly Signup Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <p className="text-white/50">Loading chart data...</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#facc15" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              
              {/* --- THIS IS THE CHANGE --- */}
              <XAxis 
                dataKey="month" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#facc15' }} // Explicitly sets the text color
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                allowDecimals={false}
                tick={{ fill: '#facc15' }} // Explicitly sets the text color
              />
              {/* ------------------------- */}

              <ChartTooltip
                cursor={{ fill: "rgba(250, 204, 21, 0.1)" }}
                content={<ChartTooltipContent />} 
              />
              <Area
                type="monotone"
                dataKey="members"
                stroke="#facc15"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#fillMembers)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}