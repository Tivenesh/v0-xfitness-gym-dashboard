// File: app/dashboard/payments/edit/[id]/page.tsx

import { EditPaymentForm } from "@/components/edit-payment-form"; // We'll create this next

// This component receives the payment ID from the URL
export default function EditPaymentPage({ params }: { params: { id: string } }) {
  const paymentId = params.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Edit Payment Record</h1>
        <p className="text-gray-400 mt-1">
          Modify the details of this payment transaction.
        </p>
      </div>
      {/* Pass the paymentId to the form component */}
      <EditPaymentForm paymentId={paymentId} />
    </div>
  );
}