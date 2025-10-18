"use client"

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts" // Added YAxis import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  revenue: { label: "Revenue (RM)", color: "#facc15" }, // Updated label
};

export function RevenueChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRevenue() {
      setLoading(true);
      try {
        const response = await fetch('/api/reports/revenue');
        if (!response.ok) {
          throw new Error('Failed to fetch revenue data');
        }
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchRevenue();
  }, []);

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Monthly Revenue</CardTitle>
        <CardDescription className="text-gray-400">Total successful revenue for the current year</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-400">Loading chart data...</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tick={{ fill: '#facc15' }} />
              {/* Added YAxis for clarity */}
              <YAxis tick={{ fill: '#facc15' }} tickFormatter={(value) => `RM ${value / 1000}k`} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" labelKey="revenue" />}
              />
              <Bar dataKey="revenue" fill="#facc15" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}