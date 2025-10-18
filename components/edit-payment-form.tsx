// File: components/edit-payment-form.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase-browser"; // Import Supabase client

interface PaymentData {
    id: number;
    member_id: string;
    plan_name: string;
    amount: number;
    payment_method: string;
    transaction_date: string;
    status: 'Pending' | 'Success' | 'Failed';
    members: { full_name: string };
}

export function EditPaymentForm({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // State for user role
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch user role
        const { data: { session } } = await supabase.auth.getSession();
        setUserRole(session?.user?.app_metadata?.role || null);

        // Fetch payment details
        const response = await fetch(`/api/payments/${paymentId}`);
        if (!response.ok) throw new Error('Failed to fetch payment details');
        const data: PaymentData = await response.json();
        setPayment(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [paymentId, supabase]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpdating(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const updatedData = {
      plan_name: formData.get('planName'),
      amount: formData.get('amount'),
      payment_method: formData.get('paymentMethod'),
      status: 'Pending', // <-- KEY CHANGE: Always set status to Pending on edit
    };

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update payment');
      }

      alert("Payment updated and set to Pending for re-approval.");
      router.push('/dashboard/payments');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
      if (!window.confirm("Are you sure you want to permanently delete this payment record? This action cannot be undone.")) {
          return;
      }
      setUpdating(true);
      setError(null);

      try {
          const response = await fetch(`/api/payments/${paymentId}`, {
              method: 'DELETE',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to delete payment');
          }

          alert("Payment deleted successfully!");
          router.push('/dashboard/payments');
          router.refresh();
      } catch (err: any) {
          setError(err.message);
      } finally {
          setUpdating(false);
      }
  };

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!payment) return <div className="text-center text-gray-500">Payment not found.</div>;

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Edit Payment ID: {payment.id}</CardTitle>
        <CardDescription className="text-gray-400">Member: {payment.members?.full_name ?? 'N/A'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="planName" className="text-sm font-medium text-gray-300">Membership Plan</label>
              <select name="planName" defaultValue={payment.plan_name} required disabled={updating} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="12 Months">12 Months</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-gray-300">Amount (RM)</label>
              <Input name="amount" type="number" step="0.01" defaultValue={payment.amount} required disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-300">Payment Method</label>
              <select name="paymentMethod" defaultValue={payment.payment_method} required disabled={updating} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
                 <option>FPX</option>
                 <option>Cash</option>
                 <option>Bank Transfer</option>
                 <option>Manual</option>
              </select>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">Transaction Date</label>
               <Input value={new Date(payment.transaction_date).toLocaleDateString()} disabled className="bg-zinc-800 border-gray-700 text-gray-400" />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 pt-4">{error}</p>}
          <div className="flex justify-between items-center pt-4">
            {/* NEW: Conditional Delete Button for Owners */}
            <div>
                {userRole === 'Owner' && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={updating}
                    >
                        {updating ? 'Deleting...' : 'Delete Payment'}
                    </Button>
                )}
            </div>
            <Button type="submit" className="bg-primary text-black hover:bg-yellow-500 font-bold" disabled={updating}>
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}