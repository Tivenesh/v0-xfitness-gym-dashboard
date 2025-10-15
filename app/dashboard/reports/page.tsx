import { MembershipTrends } from "@/components/membership-trends"
import { RevenueTrends } from "@/components/revenue-trends"
// import { StatsCards } from "@/components/stats-cards" // Can be added here for a summary at the top if desired

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* <StatsCards /> */} 
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {/* Revenue Report is the key feature on this page */}
          <RevenueTrends />
        </div>
        <div>
          {/* Reusing Membership Trends for a secondary report view */}
          <MembershipTrends />
        </div>
      </div>
      
      {/* Placeholder for more detailed table reports or data exports */}
      <div className="bg-black border-2 border-white/10 rounded-xl p-6 text-white/50 text-center">
        <h3 className="text-xl font-bold text-white uppercase mb-2">Detailed Report Filters</h3>
        <p>In a final version, this section would allow filtering, generating, and downloading detailed reports (CSV/PDF) on member retention and financial performance.</p>
      </div>

    </div>
  )
}