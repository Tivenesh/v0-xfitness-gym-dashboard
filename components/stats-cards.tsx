"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, DollarSign, TrendingUp } from "lucide-react"

export function StatsCards() {
  const [stats, setStats] = useState({
    activeMembers: 0,
    newSignups: 0,
    revenue: 0,
    classAttendance: '87%', // This remains hardcoded for now
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);

      // 1. Get Active Members count
      const { count: activeMembersCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Active');

      // 2. Get New Signups count (in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: newSignupsCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('join_date', thirtyDaysAgo.toISOString());

      // 3. Get total revenue from successful payments
      const { data: revenueData, error: revenueError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'Success');

      let totalRevenue = 0;
      if (revenueData) {
        totalRevenue = revenueData.reduce((sum, payment) => sum + payment.amount, 0);
      }

      setStats(prevStats => ({
        ...prevStats,
        activeMembers: activeMembersCount ?? 0,
        newSignups: newSignupsCount ?? 0,
        revenue: totalRevenue,
      }));

      setLoading(false);
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Active Members"
        value={loading ? "..." : stats.activeMembers.toLocaleString()}
        change="+12% from last month"
        icon={Users}
        trend="up"
      />
      <StatCard
        title="New Signups"
        value={loading ? "..." : stats.newSignups.toLocaleString()}
        change="+5% from last month"
        icon={UserPlus}
        trend="up"
      />
      <StatCard
        title="Revenue"
        value={loading ? "..." : `$${stats.revenue.toLocaleString()}`}
        change="+8% from last month"
        icon={DollarSign}
        trend="up"
      />
      <StatCard
        title="Class Attendance"
        value={stats.classAttendance}
        change="-2% from last month"
        icon={TrendingUp}
        trend="down"
      />
    </div>
  );
}

// Helper component to avoid repetition
function StatCard({ title, value, change, icon: Icon, trend }: any) {
  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(252,211,77,0.2)] rounded-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-wide text-white/70">{title}</CardTitle>
        <Icon className="w-5 h-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-white">{value}</div>
        <p className={`text-xs mt-1 font-bold ${trend === "up" ? "text-primary" : "text-red-500"}`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}