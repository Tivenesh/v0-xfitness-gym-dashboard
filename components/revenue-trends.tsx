// In file: components/revenue-trends.tsx

"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue (RM)",
    color: "#facc15",
  },
};

export function RevenueTrends() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRevenue() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/reports/revenue');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Add a console log to see what data the component receives
        console.log("Fetched Revenue Data:", data);

        const formattedData = data.map((item: any) => ({
          month: item.month,
          revenue: item.total_revenue, // Ensure this matches the API output
        }));
        setRevenueData(formattedData);
      } catch (error: any) {
        setError(error.message);
        console.error("Failed to fetch revenue trends:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRevenue();
  }, []);

  const chartHasData = revenueData && revenueData.some((d: any) => d.revenue > 0);

  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-xl">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Loading chart data...</p>
            </div>
          )}
          {error && (
             <div className="flex items-center justify-center h-full">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}
          {!loading && !error && !chartHasData && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No revenue data for the current year yet.</p>
            </div>
          )}
          {!loading && !error && chartHasData && (
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart data={revenueData} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `RM${value / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" labelClassName="text-white" />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}