// File: app/dashboard/settings/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase-browser";
import { PlusCircle, Trash2, XCircle } from "lucide-react"; // Import icons

// Define types
type MembershipPlan = {
  id: number;
  name: string;
  price: number | string;
  monthly_equivalent: number | string | null;
  duration_months: number; // Added duration_months
  features: string[];
  is_popular: boolean;
  bonus_offer: string | null;
};

type PlanFormState = Omit<MembershipPlan, 'features' | 'id'> & { id?: number; features: string }; // id is optional for new plans

// Initial state for a new plan form
const initialNewPlanState: PlanFormState = {
    name: "",
    price: "",
    monthly_equivalent: "",
    duration_months: 1, // Default duration
    features: "Full Gym Access\n", // Default feature
    is_popular: false,
    bonus_offer: ""
};

export default function SettingsPage() {
  const [plans, setPlans] = useState<PlanFormState[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState<number | null | 'new'>(null); // Track saving state (number for update, 'new' for create)
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null); // Track deleting state
  const [error, setError] = useState<{ [key: string]: string | null; general?: string }>({}); // Use string key for 'new' and 'general'
  const [success, setSuccess] = useState<{ [key: string]: string | null }>({});
  const [isOwner, setIsOwner] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle add form
  const [newPlan, setNewPlan] = useState<PlanFormState>(initialNewPlanState); // State for the new plan form

  const supabase = createClient();

  // --- Fetch User Role ---
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const role = session?.user?.app_metadata?.role;
      setIsOwner(role === 'Owner');
    };
    checkUserRole();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        const role = session?.user?.app_metadata?.role;
        setIsOwner(role === 'Owner');
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, [supabase]);


  // --- Fetch Plans ---
  const fetchPlans = async () => { // Make fetchPlans reusable
    setLoading(true);
    setError({});
    // Keep success messages unless fetching fails
    // setSuccess({});
    try {
      const response = await fetch('/api/membership-plans'); //
      if (!response.ok) throw new Error('Failed to fetch plans');
      const data: MembershipPlan[] = await response.json();
      const formattedData = data.map(plan => ({
        ...plan,
        features: (plan.features || []).join('\n')
      }));
      setPlans(formattedData);
    } catch (err: any) {
      setError({ general: err.message });
      setSuccess({}); // Clear success messages on fetch error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(); // Initial fetch
  }, []);


  // --- Input Handlers ---
  const handlePlanChange = (planId: number, field: keyof PlanFormState, value: string | boolean | number) => {
    setPlans(currentPlans =>
      currentPlans.map(plan =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
     // Clear previous success/error message for this plan on edit
     setSuccess(prev => ({ ...prev, [String(planId)]: null }));
     setError(prev => ({ ...prev, [String(planId)]: null, general: null })); // Also clear general error
  };

  const handleNewPlanChange = (field: keyof PlanFormState, value: string | boolean | number) => {
    setNewPlan(prev => ({ ...prev, [field]: value }));
    setError(prev => ({ ...prev, new: null, general: null })); // Clear 'new' and general errors on edit
    setSuccess(prev => ({ ...prev, new: null}));
  };

  // --- API Call Functions ---
  const handleSaveChanges = async (planId: number) => {
      if (!isOwner) return;
      setSavingPlanId(planId);
      setError(prev => ({ ...prev, [String(planId)]: null, general: null }));
      setSuccess(prev => ({ ...prev, [String(planId)]: null }));
      const planToSave = plans.find(p => p.id === planId);

      if (!planToSave) {
        setError({ [String(planId)]: "Plan not found." });
        setSavingPlanId(null);
        return;
      }

      const featuresArray = planToSave.features.split('\n').map(f => f.trim()).filter(f => f);
      const payload = {
          ...planToSave,
          price: parseFloat(String(planToSave.price)),
          monthly_equivalent: planToSave.monthly_equivalent ? parseFloat(String(planToSave.monthly_equivalent)) : null,
          duration_months: parseInt(String(planToSave.duration_months), 10),
          features: featuresArray,
          is_popular: !!planToSave.is_popular,
          bonus_offer: planToSave.bonus_offer || null
      };

      // Validation
      if (!payload.name || !payload.price || !payload.duration_months) {
        setError({ [String(planId)]: "Name, Price, and Duration are required." });
        setSavingPlanId(null);
        return;
      }

      try {
          const response = await fetch(`/api/membership-plans/${planId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); ///route.ts]
          if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || `HTTP error! status: ${response.status}`); }
          setSuccess({ [String(planId)]: `Plan "${planToSave.name}" updated successfully!` });
          // Optionally re-fetch for absolute consistency, or rely on state update
          // await fetchPlans();
      } catch (err: any) { setError({ [String(planId)]: `Update failed: ${err.message}` }); }
      finally { setSavingPlanId(null); }
  };

  const handleCreatePlan = async () => {
    if (!isOwner) return;
    setSavingPlanId('new');
    setError(prev => ({ ...prev, new: null, general: null }));
    setSuccess(prev => ({ ...prev, new: null }));

    const featuresArray = newPlan.features.split('\n').map(f => f.trim()).filter(f => f);
    const payload = {
      ...newPlan,
      price: parseFloat(String(newPlan.price)),
      monthly_equivalent: newPlan.monthly_equivalent ? parseFloat(String(newPlan.monthly_equivalent)) : null,
      duration_months: parseInt(String(newPlan.duration_months), 10),
      features: featuresArray,
      is_popular: !!newPlan.is_popular,
      bonus_offer: newPlan.bonus_offer || null
    };

    if (!payload.name || !payload.price || !payload.duration_months) {
        setError({ new: "Name, Price, and Duration are required." });
        setSavingPlanId(null);
        return;
    }

    try {
        const response = await fetch(`/api/membership-plans`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); //
        if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || `HTTP error! status: ${response.status}`); }
        setSuccess({ new: `Plan "${newPlan.name}" created successfully!` });
        setNewPlan(initialNewPlanState); // Reset form
        setShowAddForm(false); // Hide form
        await fetchPlans(); // Refresh list
    } catch (err: any) { setError({ new: `Create failed: ${err.message}` }); }
    finally { setSavingPlanId(null); }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!isOwner) return;
    const planToDelete = plans.find(p => p.id === planId);
    if (!planToDelete) return;

    if (!window.confirm(`Are you sure you want to delete the "${planToDelete.name}" plan? This cannot be undone.`)) {
      return;
    }

    setDeletingPlanId(planId);
    setError(prev => ({ ...prev, [String(planId)]: null, general: null })); // Clear errors related to this plan and general errors
    setSuccess(prev => ({ ...prev, [String(planId)]: null })); // Clear success related to this plan

    try {
        const response = await fetch(`/api/membership-plans/${planId}`, { method: 'DELETE' }); ///route.ts]
        if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || `HTTP error! status: ${response.status}`); }
        // Success: No message needed, just refresh
        await fetchPlans(); // Refresh list
    } catch (err: any) { setError({ general: `Delete failed: ${err.message}` }); } // Show delete errors generally
    finally { setDeletingPlanId(null); }
  };


  // --- Helper Function to Render Plan Form Fields ---
  const renderPlanFormFields = (
    plan: PlanFormState,
    onChangeHandler: (field: keyof PlanFormState, value: string | boolean | number) => void,
    idPrefix: string | number,
    isDisabled: boolean
  ) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
           {/* Name */}
            <div className="space-y-1 lg:col-span-1">
                <label htmlFor={`name-${idPrefix}`} className="text-xs font-medium text-gray-400">Plan Name *</label>
                <Input id={`name-${idPrefix}`} value={plan.name} onChange={(e) => onChangeHandler('name', e.target.value)} disabled={isDisabled} className="bg-gray-900 border-gray-700 text-white disabled:opacity-70" required />
            </div>
            {/* Price */}
            <div className="space-y-1">
                <label htmlFor={`price-${idPrefix}`} className="text-xs font-medium text-gray-400">Price (RM) *</label>
                <Input id={`price-${idPrefix}`} value={plan.price} onChange={(e) => onChangeHandler('price', e.target.value)} disabled={isDisabled} className="bg-gray-900 border-gray-700 text-white disabled:opacity-70" type="number" step="0.01" required />
            </div>
            {/* Monthly Equivalent */}
            <div className="space-y-1">
                <label htmlFor={`monthly_equivalent-${idPrefix}`} className="text-xs font-medium text-gray-400">Per Month (RM, optional)</label>
                <Input id={`monthly_equivalent-${idPrefix}`} value={plan.monthly_equivalent || ''} onChange={(e) => onChangeHandler('monthly_equivalent', e.target.value)} disabled={isDisabled} className="bg-gray-900 border-gray-700 text-white disabled:opacity-70" placeholder="e.g., 99.9" type="number" step="0.01" />
            </div>
             {/* Duration */}
            <div className="space-y-1">
                <label htmlFor={`duration_months-${idPrefix}`} className="text-xs font-medium text-gray-400">Duration (Months) *</label>
                <Input id={`duration_months-${idPrefix}`} value={plan.duration_months} onChange={(e) => onChangeHandler('duration_months', parseInt(e.target.value, 10) || 1)} disabled={isDisabled} className="bg-gray-900 border-gray-700 text-white disabled:opacity-70" type="number" step="1" min="1" required />
            </div>
            {/* Bonus Text */}
            <div className="space-y-1">
                <label htmlFor={`bonus_offer-${idPrefix}`} className="text-xs font-medium text-gray-400">Bonus Text (optional)</label>
                <Input id={`bonus_offer-${idPrefix}`} value={plan.bonus_offer || ''} onChange={(e) => onChangeHandler('bonus_offer', e.target.value)} disabled={isDisabled} className="bg-gray-900 border-gray-700 text-white disabled:opacity-70" placeholder="e.g., + 1 MONTH FREE" />
            </div>
            {/* Is Popular Checkbox */}
            <div className="flex items-center space-x-2 pt-5">
                <Checkbox
                    id={`is_popular-${idPrefix}`}
                    checked={plan.is_popular}
                    onCheckedChange={(checked) => onChangeHandler('is_popular', !!checked)}
                    disabled={isDisabled}
                    className="border-gray-700 data-[state=checked]:bg-primary data-[state=checked]:text-black disabled:opacity-70"
                />
                <label htmlFor={`is_popular-${idPrefix}`} className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Mark as Popular
                </label>
            </div>
            {/* Features (Textarea) */}
            <div className="space-y-1 md:col-span-2 lg:col-span-4"> {/* Changed col-span to 4 */}
                <label htmlFor={`features-${idPrefix}`} className="text-xs font-medium text-gray-400">Features (one per line)</label>
                <Textarea
                    id={`features-${idPrefix}`}
                    value={plan.features}
                    onChange={(e) => onChangeHandler('features', e.target.value)}
                    disabled={isDisabled}
                    className="bg-gray-900 border-gray-700 text-white min-h-[80px] disabled:opacity-70"
                    rows={3}
                />
            </div>
      </div>
  );


  // --- Main Render ---
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage gym information, admin account, and membership plans.
        </p>
      </div>

      {/* --- Gym Information & Admin Account Cards (Existing - Keep as is) --- */}
      <Card className="bg-black border-2 border-white/10">
         {/* ... Gym Info Content ... */}
         <CardHeader>
           <CardTitle className="text-white">Gym Information</CardTitle>
           <CardDescription className="text-gray-400">Update your gym's public details.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           {/* ... existing form content ... */}
         </CardContent>
      </Card>
      <Card className="bg-black border-2 border-white/10">
         {/* ... Admin Account Content ... */}
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Membership Plan Settings</CardTitle>
            <CardDescription className="text-gray-400">
              {isOwner ? "Create, update, or delete membership plans." : "View membership plan details. (Owner role required to edit)"}
            </CardDescription>
          </div>
          {isOwner && !showAddForm && (
            <Button onClick={() => { setShowAddForm(true); setNewPlan(initialNewPlanState); setError({}); setSuccess({}); }} className="bg-primary text-black hover:bg-yellow-500 font-bold">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Plan
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {error.general && <p className="text-sm text-red-500">{error.general}</p>}

          {/* --- Add New Plan Form Section --- */}
          {showAddForm && isOwner && (
            <div className="space-y-4 border-b-2 border-primary pb-6 mb-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-primary">Create New Plan</h3>
                    <Button variant="ghost" size="icon" onClick={() => { setShowAddForm(false); setError(prev => ({...prev, new: null})); setSuccess(prev => ({...prev, new: null})); }} className="text-gray-400 hover:text-white">
                        <XCircle className="h-5 w-5" />
                    </Button>
                </div>
                {error.new && <p className="text-sm text-red-500">{error.new}</p>}
                {success.new && <p className="text-sm text-green-400">{success.new}</p>}
                
                {renderPlanFormFields(newPlan, handleNewPlanChange, 'new', savingPlanId === 'new')}

                <div className="flex justify-end pt-2">
                    <Button onClick={handleCreatePlan} disabled={savingPlanId === 'new'} className="bg-green-600 text-white hover:bg-green-700 font-bold text-sm h-8 px-3">
                        {savingPlanId === 'new' ? 'Saving...' : 'Create Plan'}
                    </Button>
                </div>
            </div>
          )}

          {/* --- Existing Plans List --- */}
          {loading && !plans.length ? (
            <div className="flex justify-center items-center h-20">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          ) : plans.length === 0 && !loading ? (
             <p className="text-center text-gray-500">No membership plans found. Add one to get started!</p>
          ) : (
            plans.map((plan) => {
              const currentPlanId = plan.id!; // Assert id exists for existing plans
              const isDisabled = !isOwner || savingPlanId !== null || deletingPlanId === currentPlanId;
              const isSavingThis = savingPlanId === currentPlanId;
              const isDeletingThis = deletingPlanId === currentPlanId;

              return (
                <div key={currentPlanId} className="space-y-4 border-b border-gray-800 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-yellow-400">{plan.name}</h3>
                    {isOwner && (
                       <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(currentPlanId)} disabled={isDisabled} className="text-gray-500 hover:text-red-500 disabled:opacity-50">
                           {isDeletingThis ? (
                               <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                           ) : (
                               <Trash2 className="h-4 w-4" />
                           )}
                       </Button>
                    )}
                  </div>

                   {error[String(currentPlanId)] && <p className="text-sm text-red-500">{error[String(currentPlanId)]}</p>}
                   {success[String(currentPlanId)] && <p className="text-sm text-green-400">{success[String(currentPlanId)]}</p>}

                  {renderPlanFormFields(plan, (field, value) => handlePlanChange(currentPlanId, field, value), currentPlanId, isDisabled)}

                  <div className="flex justify-end">
                    {isOwner && (
                      <Button
                        onClick={() => handleSaveChanges(currentPlanId)}
                        disabled={isDisabled || isSavingThis}
                        className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold text-sm h-8 px-3"
                      >
                        {isSavingThis ? 'Saving...' : 'Save Plan'}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}