// File: components/manual-payment-form.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ManualPaymentForm() {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch members to populate the dropdown
  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        setMembers(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchMembers();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const paymentData = {
      member_id: formData.get('memberId'),
      plan_name: formData.get('planName'),
      amount: formData.get('amount'),
      payment_method: formData.get('paymentMethod'),
    };

    if (!paymentData.member_id) {
        setError("Please select a member.");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/payments/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      alert("Manual payment recorded successfully!");
      router.push('/dashboard/payments');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Payment Details</CardTitle>
        <CardDescription className="text-gray-400">This will create a 'Success' payment record and update the member's subscription.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="memberId" className="text-sm font-medium text-gray-300">Member</label>
              <select name="memberId" required disabled={loading} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
                <option value="">Select a member...</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.full_name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="planName" className="text-sm font-medium text-gray-300">Membership Plan</label>
              <select name="planName" defaultValue="1 Month" required disabled={loading} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="12 Months">12 Months</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-gray-300">Amount (RM)</label>
              <Input name="amount" type="number" step="0.01" placeholder="e.g., 139.00" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
            </div>

            <div className="space-y-2">
              <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-300">Payment Method</label>
              <select name="paymentMethod" defaultValue="Cash" required disabled={loading} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
                <option>Cash</option>
                <option>Bank Transfer</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 pt-4">{error}</p>}
          
          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-primary text-black hover:bg-yellow-500 font-bold" disabled={loading}>
              {loading ? 'Saving...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}