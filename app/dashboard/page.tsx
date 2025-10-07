import { StatsCards } from "@/components/stats-cards"
import { MembershipTrends } from "@/components/membership-trends"
import { RecentSignups } from "@/components/recent-signups"
import { AllMembersTable } from "@/components/all-members-table"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
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
