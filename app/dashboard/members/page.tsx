"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

// Interface for fetched plan data
interface MembershipPlan {
  id: number;
  name: string;
  duration_months: number;
}

// Client-side helper function to calculate end date
function calculateEndDateClient(
  startDateStr: string | null | undefined,
  planName: string | null | undefined,
  plansData: MembershipPlan[]
): string {
  if (!startDateStr || !planName) return 'Select Plan & Start Date';

  try {
    // Treat the date string as UTC to prevent timezone shifts
    const startDate = new Date(startDateStr + 'T12:00:00Z');
    if (isNaN(startDate.getTime())) return 'Invalid Start Date';

    let endDate = new Date(startDate);

    if (planName === 'Walk-in') {
      endDate.setUTCDate(startDate.getUTCDate() + 1);
    } else {
      const selectedPlan = plansData.find(p => p.name === planName);
      if (selectedPlan) {
        endDate.setUTCMonth(startDate.getUTCMonth() + selectedPlan.duration_months);
      } else {
        return 'Plan duration unknown';
      }
    }
    return endDate.toISOString().split('T')[0];
  } catch (e) {
    console.error("Error calculating end date:", e);
    return 'Calculation Error';
  }
}

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  // Form states for dynamic end date calculation
  const [selectedPlan, setSelectedPlan] = useState<string>('Walk-in');
  const [selectedStartDate, setSelectedStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Fetch membership plans for the dropdown
  useEffect(() => {
    async function fetchPlans() {
      setPlansLoading(true);
      try {
        const response = await fetch('/api/membership-plans');
        if (!response.ok) throw new Error('Failed to fetch membership plans');
        const data: MembershipPlan[] = await response.json();
        setPlans(data);
      } catch (err: any) {
        setError(`Error loading plans: ${err.message}`);
      } finally {
        setPlansLoading(false);
      }
    }
    fetchPlans();
  }, []);

  // Calculate end date display reactively
  const endDateDisplay = useMemo(() => {
    return calculateEndDateClient(selectedStartDate, selectedPlan, plans);
  }, [selectedStartDate, selectedPlan, plans]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const memberData = {
      full_name: formData.get('fullName'),
      email: formData.get('email'),
      phone_number: formData.get('phone'),
      plan: formData.get('plan'),
      start_date: formData.get('startDate'),
    };

    if (!memberData.full_name || !memberData.plan || !memberData.start_date) {
        setError("Full Name, Plan, and Start Date are required.");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to create member'); }
      alert("Member created successfully!");
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Add New Member</h1>

      <Card className="bg-black border-2 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Member Details</CardTitle>
          <CardDescription className="text-gray-400">Fill out the form. End date is calculated automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-300">Full Name *</label>
                <Input name="fullName" placeholder="e.g., John Doe" required disabled={loading || plansLoading} className="bg-gray-900 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                <Input name="email" type="email" placeholder="e.g., john.doe@email.com" disabled={loading || plansLoading} className="bg-gray-900 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone Number</label>
                <Input name="phone" placeholder="e.g., 012-3456789" disabled={loading || plansLoading} className="bg-gray-900 border-gray-700 text-white" />
              </div>

              <div className="space-y-2">
                <label htmlFor="plan" className="text-sm font-medium text-gray-300">Membership Plan *</label>
                <select
                    name="plan" required
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white focus:ring-primary focus:border-primary"
                    disabled={loading || plansLoading}
                >
                  
                  {plansLoading ? ( <option disabled>Loading plans...</option> ) : (
                      plans.map(p => ( <option key={p.id} value={p.name}>{p.name}</option> ))
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-gray-300">Start Date *</label>
                <Input
                    name="startDate" type="date" required
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                    disabled={loading || plansLoading}
                    className="bg-gray-900 border-gray-700 text-white focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endDateDisplay" className="text-sm font-medium text-gray-300">Calculated End Date</label>
                <Input
                    name="endDateDisplay" value={endDateDisplay} disabled
                    className="bg-zinc-800 border-gray-700 text-gray-400 cursor-not-allowed"
                />
              </div>

            </div>

            {error && <p className="text-sm text-red-500 pt-4">{error}</p>}

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary text-black hover:bg-yellow-500 font-bold" disabled={loading || plansLoading}>
                 {(loading || plansLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Saving...' : (plansLoading ? 'Loading Plans...' : 'Save Member')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
