// File: app/dashboard/payments/add/page.tsx

import { ManualPaymentForm } from "@/components/manual-payment-form";

export default function AddManualPaymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Add Manual Payment</h1>
        <p className="text-gray-400 mt-1">
          Record a new payment made via cash or bank transfer.
        </p>
      </div>
      <ManualPaymentForm />
    </div>
  );
}