import { TrainersTable } from "@/components/trainers-table"

// This default export is what Next.js looks for at the /dashboard/trainers route
export default function TrainersPage() {
  return (
    <div className="space-y-6">
      <TrainersTable />
    </div>
  )
}