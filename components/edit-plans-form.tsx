// File: components/edit-plans-form.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // For editing features
import { Checkbox } from "@/components/ui/checkbox"; // For 'is_popular'
import { createClient } from "@/lib/supabase-browser"; // For role check

interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  duration_months: number;
  monthly_breakdown: string | null;
  features: string[];
  is_popular: boolean;
  bonus_text: string | null;
}

export function EditPlansForm() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const supabase = createClient();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch plans and user role
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch role
        const { data: { session } } = await supabase.auth.getSession();
        const role = session?.user?.app_metadata?.role || null;
        setUserRole(role);

        // Fetch plans only if user is Owner
        if (role === 'Owner') {
          const response = await fetch('/api/plans');
          if (!response.ok) throw new Error('Failed to fetch plans');
          const data = await response.json();
          setPlans(data);
        } else {
            setPlans([]); // Clear plans if not owner
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [supabase]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>, planId: number) => {
    event.preventDefault();
    setUpdatingId(planId);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);
    const featuresString = formData.get(`features-${planId}`) as string;
    // Basic parsing of comma-separated features, trimming whitespace
    const featuresArray = featuresString ? featuresString.split(',').map(f => f.trim()).filter(f => f) : [];

    const updatedData = {
      price: formData.get(`price-${planId}`),
      monthly_breakdown: formData.get(`monthly_breakdown-${planId}`) || null, // Send null if empty
      features: featuresArray,
      is_popular: formData.get(`is_popular-${planId}`) === 'on', // Checkbox value
      bonus_text: formData.get(`bonus_text-${planId}`) || null, // Send null if empty
    };

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update plan');
      }

      setSuccessMessage(`Plan ${planId} updated successfully!`);
      // Optionally re-fetch plans or update local state for immediate feedback
      // fetchPlans(); // Or update the specific plan in the 'plans' state array

    } catch (err: any) {
      setError(`Error updating plan ${planId}: ${err.message}`);
    } finally {
      setUpdatingId(null);
       // Clear success message after a delay
       setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Only render the form if the user is an Owner
  if (userRole !== 'Owner') {
    return null; // Or show a message indicating restricted access
  }

  if (loading) return <div className="text-gray-400">Loading plans...</div>;
  if (error && plans.length === 0) return <div className="text-red-500">Error loading plans: {error}</div>; // Show error only if loading failed

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">Manage Membership Plans</CardTitle>
        <CardDescription className="text-gray-400">Edit the details for each plan. Changes require re-fetching data on the Subscriptions page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        {plans.map((plan) => (
          <form key={plan.id} onSubmit={(e) => handleSave(e, plan.id)} className="space-y-4 border-b border-gray-700 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
            <h3 className="text-xl font-bold text-primary">{plan.name} ({plan.duration_months} Months)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor={`price-${plan.id}`} className="text-sm font-medium text-gray-300">Price (RM)</Label>
                <Input name={`price-${plan.id}`} type="number" step="0.01" defaultValue={plan.price} required disabled={updatingId === plan.id} className="bg-gray-900 border-gray-700 text-white" />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`monthly_breakdown-${plan.id}`} className="text-sm font-medium text-gray-300">Monthly Breakdown (Optional)</Label>
                <Input name={`monthly_breakdown-${plan.id}`} defaultValue={plan.monthly_breakdown ?? ''} disabled={updatingId === plan.id} className="bg-gray-900 border-gray-700 text-white" placeholder="e.g., RM116.3/month"/>
              </div>
               <div className="space-y-1">
                <Label htmlFor={`bonus_text-${plan.id}`} className="text-sm font-medium text-gray-300">Bonus Text (Optional)</Label>
                <Input name={`bonus_text-${plan.id}`} defaultValue={plan.bonus_text ?? ''} disabled={updatingId === plan.id} className="bg-gray-900 border-gray-700 text-white" placeholder="e.g., + 1 MONTH FREE"/>
              </div>
              <div className="space-y-1 md:col-span-2 lg:col-span-3">
                <Label htmlFor={`features-${plan.id}`} className="text-sm font-medium text-gray-300">Features (comma-separated)</Label>
                <Textarea name={`features-${plan.id}`} defaultValue={plan.features.join(', ')} disabled={updatingId === plan.id} className="bg-gray-900 border-gray-700 text-white" rows={2}/>
              </div>
               <div className="flex items-center space-x-2 pt-2">
                 <Checkbox
                    id={`is_popular-${plan.id}`}
                    name={`is_popular-${plan.id}`}
                    defaultChecked={plan.is_popular}
                    disabled={updatingId === plan.id}
                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:text-black"
                 />
                 <Label htmlFor={`is_popular-${plan.id}`} className="text-sm font-medium text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                   Mark as Popular
                 </Label>
               </div>
            </div>
             <div className="flex justify-end">
                <Button type="submit" size="sm" className="bg-primary text-black hover:bg-yellow-500 font-bold" disabled={updatingId === plan.id}>
                    {updatingId === plan.id ? 'Saving...' : 'Save Plan'}
                </Button>
             </div>
          </form>
        ))}
      </CardContent>
    </Card>
  );
}