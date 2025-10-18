// File: app/dashboard/settings/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component
import { createClient } from "@/lib/supabase-browser"; // Use your browser client

// Define a type for the plan data for better type safety
type MembershipPlan = {
  id: number;
  name: string;
  price: number | string; // Allow string temporarily for input state
  monthly_equivalent: number | string | null; // Allow string temporarily for input state
  duration_months: number;
  features: string[]; // Store as array from DB
  is_popular: boolean;
  bonus_offer: string | null;
};

// Type for the plan state used in the form (features as string)
type PlanFormState = Omit<MembershipPlan, 'features'> & { features: string };

export default function SettingsPage() {
  const [plans, setPlans] = useState<PlanFormState[]>([]); // State uses PlanFormState
  const [loading, setLoading] = useState(false); // General loading for fetching
  const [savingPlanId, setSavingPlanId] = useState<number | null>(null); // Track which plan is saving
  const [error, setError] = useState<{ [key: number]: string | null }>({}); // Error per plan ID
  const [success, setSuccess] = useState<{ [key: number]: string | null }>({}); // Success per plan ID
  const [isOwner, setIsOwner] = useState(false); // State for user role check

  const supabase = createClient();

  // --- Fetch User Role ---
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const role = session?.user?.app_metadata?.role;
      setIsOwner(role === 'Owner');
    };
    checkUserRole();
    // Re-check on auth state change if needed
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        const role = session?.user?.app_metadata?.role;
        setIsOwner(role === 'Owner');
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, [supabase]);


  // --- Fetch Plans ---
  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      setError({});
      setSuccess({});
      try {
        const response = await fetch('/api/membership-plans');
        if (!response.ok) throw new Error('Failed to fetch plans');
        const data: MembershipPlan[] = await response.json();
        // Convert features array to newline-separated string for Textarea
        const formattedData = data.map(plan => ({
          ...plan,
          features: (plan.features || []).join('\n') // Handle potential null/undefined features
        }));
        setPlans(formattedData);
      } catch (err: any) {
        setError({ general: err.message }); // Set a general error
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []); // Run only on component mount


  // Function to handle input changes for a specific plan
  const handlePlanChange = (planId: number, field: keyof PlanFormState, value: string | boolean) => {
    setPlans(currentPlans =>
      currentPlans.map(plan =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
     // Clear previous success/error message for this plan on edit
     setSuccess(prev => ({ ...prev, [planId]: null }));
     setError(prev => ({ ...prev, [planId]: null }));
  };


  // --- Save Plan Changes ---
  const handleSaveChanges = async (planId: number) => {
      if (!isOwner) {
          setError({ [planId]: "Only Owners can modify plans." });
          return;
      }
      setSavingPlanId(planId);
      setError(prev => ({ ...prev, [planId]: null }));
      setSuccess(prev => ({ ...prev, [planId]: null }));

      const planToSave = plans.find(p => p.id === planId);

      if (!planToSave) {
        setError({ [planId]: "Plan not found." });
        setSavingPlanId(null);
        return;
      }

      // Convert features string back to array and prepare data
      const featuresArray = planToSave.features.split('\n').map(f => f.trim()).filter(f => f); // Trim whitespace and remove empty lines
      const payload = {
          ...planToSave,
          price: parseFloat(String(planToSave.price)), // Ensure price is a number
          monthly_equivalent: planToSave.monthly_equivalent ? parseFloat(String(planToSave.monthly_equivalent)) : null, // Ensure number or null
          features: featuresArray, // Send as array
      };

      console.log("Attempting to save:", payload); // Log the data to be sent

      try {
          const response = await fetch(`/api/membership-plans/${planId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }

          const updatedPlan = await response.json();
          // Optionally update state with the exact response data if needed
          setSuccess({ [planId]: `Plan "${planToSave.name}" updated successfully!` });
          console.log("Save successful for plan ID:", planId, updatedPlan);

      } catch (err: any) {
          setError({ [planId]: `Failed to update plan "${planToSave.name}": ${err.message}` });
          console.error("Save failed:", err);
      } finally {
          setSavingPlanId(null);
      }
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage gym information, admin account, and membership plans.
        </p>
      </div>

      {/* Gym Information Card (Existing) */}
      <Card className="bg-black border-2 border-white/10">
         {/* ... existing content ... */}
         <CardHeader>
           <CardTitle className="text-white">Gym Information</CardTitle>
           <CardDescription className="text-gray-400">Update your gym's public details.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           {/* ... existing form content ... */}
         </CardContent>
      </Card>

      {/* Admin Account Card (Existing) */}
      <Card className="bg-black border-2 border-white/10">
        {/* ... existing content ... */}
        <CardHeader>
          <CardTitle className="text-white">Admin Account</CardTitle>
          <CardDescription className="text-gray-400">Manage your login credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {/* ... existing form content ... */}
        </CardContent>
      </Card>

      {/* --- Membership Plan Settings Card --- */}
      <Card className="bg-black border-2 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Membership Plan Settings</CardTitle>
          <CardDescription className="text-gray-400">
            {isOwner ? "Update details for each membership plan." : "View membership plan details. (Owner role required to edit)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error.general && <p className="text-sm text-red-500">{error.general}</p>} {/* General Fetch Error */}
          {loading && !plans.length ? <p className="text-gray-400">Loading plans...</p> : (
            plans.map((plan) => (
              <div key={plan.id} className="space-y-4 border-b border-gray-800 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-yellow-400">{plan.name}</h3>
                {/* Display specific error/success message for this plan */}
                 {error[plan.id] && <p className="text-sm text-red-500">{error[plan.id]}</p>}
                 {success[plan.id] && <p className="text-sm text-green-400">{success[plan.id]}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                  {/* Price */}
                  <div className="space-y-1">
                    <label htmlFor={`price-${plan.id}`} className="text-xs font-medium text-gray-400">Price (RM)</label>
                    <Input
                      id={`price-${plan.id}`}
                      value={plan.price}
                      onChange={(e) => handlePlanChange(plan.id, 'price', e.target.value)}
                      disabled={loading || savingPlanId !== null || !isOwner}
                      className="bg-gray-900 border-gray-700 text-white disabled:opacity-70"
                      type="number"
                      step="0.01"
                      required
                    />
                  </div>
                   {/* Monthly Price (Optional) */}
                   <div className="space-y-1">
                     <label htmlFor={`monthly_equivalent-${plan.id}`} className="text-xs font-medium text-gray-400">Per Month Price (RM, optional)</label>
                     <Input
                       id={`monthly_equivalent-${plan.id}`}
                       value={plan.monthly_equivalent || ''}
                       onChange={(e) => handlePlanChange(plan.id, 'monthly_equivalent', e.target.value)}
                       disabled={loading || savingPlanId !== null || !isOwner}
                       className="bg-gray-900 border-gray-700 text-white disabled:opacity-70"
                        placeholder="e.g., 99.9"
                       type="number"
                       step="0.01"
                     />
                   </div>
                   {/* Bonus Text (Optional) */}
                   <div className="space-y-1">
                     <label htmlFor={`bonus_offer-${plan.id}`} className="text-xs font-medium text-gray-400">Bonus Text (optional)</label>
                     <Input
                       id={`bonus_offer-${plan.id}`}
                       value={plan.bonus_offer || ''}
                       onChange={(e) => handlePlanChange(plan.id, 'bonus_offer', e.target.value)}
                       disabled={loading || savingPlanId !== null || !isOwner}
                       className="bg-gray-900 border-gray-700 text-white disabled:opacity-70"
                       placeholder="e.g., + 1 MONTH FREE"
                     />
                   </div>
                   {/* Is Popular Checkbox */}
                   <div className="flex items-center space-x-2 pt-5">
                       <Checkbox
                           id={`is_popular-${plan.id}`}
                           checked={plan.is_popular}
                           onCheckedChange={(checked) => handlePlanChange(plan.id, 'is_popular', !!checked)} // !! ensures boolean
                           disabled={loading || savingPlanId !== null || !isOwner}
                           className="border-gray-700 data-[state=checked]:bg-primary data-[state=checked]:text-black disabled:opacity-70"
                       />
                       <label
                           htmlFor={`is_popular-${plan.id}`}
                           className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                       >
                           Mark as Popular
                       </label>
                   </div>
                    {/* Features (Textarea) */}
                    <div className="space-y-1 md:col-span-2 lg:col-span-3">
                      <label htmlFor={`features-${plan.id}`} className="text-xs font-medium text-gray-400">Features (one per line)</label>
                      <Textarea
                        id={`features-${plan.id}`}
                        value={plan.features}
                        onChange={(e) => handlePlanChange(plan.id, 'features', e.target.value)}
                        disabled={loading || savingPlanId !== null || !isOwner}
                        className="bg-gray-900 border-gray-700 text-white min-h-[80px] disabled:opacity-70"
                        rows={3}
                      />
                    </div>
                </div>
                <div className="flex justify-end">
                  {isOwner && ( // Only show save button for Owner
                    <Button
                      onClick={() => handleSaveChanges(plan.id)}
                      disabled={loading || savingPlanId !== null}
                      className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold text-sm h-8 px-3"
                    >
                      {savingPlanId === plan.id ? 'Saving...' : 'Save Plan'}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}