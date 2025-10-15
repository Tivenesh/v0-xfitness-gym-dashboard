import { StatsCards } from "@/components/stats-cards"
import { MembershipTrends } from "@/components/membership-trends"
import { RecentSignups } from "@/components/recent-signups"
import { AllMembersTable } from "@/components/all-members-table"
import Link from "next/link" // <-- 1. IMPORTED
import { Button } from "@/components/ui/button" // <-- 2. IMPORTED
import { UserPlus } from "lucide-react" // <-- 3. IMPORTED

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 4. ADDED THIS NEW SECTION */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <Link href="/dashboard/members">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Member
          </Button>
        </Link>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MembershipTrends />
        </div>
        <div>
          <RecentSignups />
        </div>
      </div>

      <AllMembersTable />
    </div>
  )
}