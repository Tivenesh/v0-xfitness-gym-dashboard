// app/dashboard/payments/page.tsx

import { PaymentsTable } from "@/components/payments-table";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Payment Transactions</h1>
        <p className="text-gray-400 mt-1">
          Review and manage all membership transactions.
        </p>
      </div>
      <PaymentsTable />
    </div>
  );
}