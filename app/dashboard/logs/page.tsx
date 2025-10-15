// app/dashboard/logs/page.tsx

import { AccessLogsTable } from "@/components/access-logs-table";

export default function AccessLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Access Logs</h1>
        <p className="text-gray-400 mt-1">
          Review all gym entry activity.
        </p>
      </div>
      <AccessLogsTable />
    </div>
  );
}