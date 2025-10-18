// File: app/dashboard/settings/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase-browser";
import { PlusCircle, Trash2, XCircle, Mail, MapPin, Settings as SettingsIcon } from "lucide-react"; // Import necessary icons
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import Link from "next/link"; // Import Link for profile redirect

// ... (Keep the existing types: MembershipPlan, PlanFormState) ...
type MembershipPlan = {
  id: number;
  name: string;
  price: number | string;
  monthly_equivalent: number | string | null;
  duration_months: number;
  features: string[];
  is_popular: boolean;
  bonus_offer: string | null;
};

type PlanFormState = Omit<MembershipPlan, 'features' | 'id'> & { id?: number; features: string };

const initialNewPlanState: PlanFormState = {
    name: "",
    price: "",
    monthly_equivalent: "",
    duration_months: 1,
    features: "Full Gym Access\n",
    is_popular: false,
    bonus_offer: ""
};


export default function SettingsPage() {
  const [plans, setPlans] = useState<PlanFormState[]>([]);
  const [loading, setLoading] = useState(true); // Combined loading state
  const [savingPlanId, setSavingPlanId] = useState<number | null | 'new'>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);
  const [error, setError] = useState<{ [key: string]: string | null; general?: string }>({});
  const [success, setSuccess] = useState<{ [key: string]: string | null }>({});
  const [isOwner, setIsOwner] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlan, setNewPlan] = useState<PlanFormState>(initialNewPlanState);
  const [userEmail, setUserEmail] = useState<string | null>(null); // State for user email
  const [userName, setUserName] = useState<string>('Admin User'); // State for user name (can make dynamic later if needed)

  const supabase = createClient();

  // --- Fetch User Role & Email ---
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true); // Start loading when checking user
      const { data: { session } } = await supabase.auth.getSession();
      const role = session?.user?.app_metadata?.role;
      const email = session?.user?.email;
      setIsOwner(role === 'Owner');
      setUserEmail(email || null);
       // You might fetch the user's name from a 'profiles' table here if you have one
      // setUserName(fetchedName || 'Admin User');
      setLoading(false); // Stop loading after checking user
    };
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        const role = session?.user?.app_metadata?.role;
        const email = session?.user?.email;
        setIsOwner(role === 'Owner');
        setUserEmail(email || null);
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, [supabase]);


  // --- Fetch Plans (only if owner) ---
  const fetchPlans = async () => {
    setLoading(true); // Start loading for plans
    setError({});
    try {
      if (isOwner) { // Only fetch if owner
          const response = await fetch('/api/membership-plans');
          if (!response.ok) throw new Error('Failed to fetch plans');
          const data: MembershipPlan[] = await response.json();
          const formattedData = data.map(plan => ({
            ...plan,
            features: (plan.features || []).join('\n')
          }));
          setPlans(formattedData);
      } else {
          setPlans([]); // Clear plans if not owner
      }
    } catch (err: any) {
      setError({ general: `Failed to load plans: ${err.message}` });
      setSuccess({});
    } finally {
      setLoading(false); // Stop loading after fetching plans
    }
  };

  // Fetch plans initially and whenever the user role changes to Owner
  useEffect(() => {
    if (isOwner) {
        fetchPlans();
    } else {
        setPlans([]); // Clear plans if user is not owner
        setLoading(false); // Ensure loading stops if not fetching
    }
  }, [isOwner]); // Re-run when isOwner changes


  // --- Input Handlers (Keep existing handlers) ---
    const handlePlanChange = (planId: number, field: keyof PlanFormState, value: string | boolean | number) => {
        setPlans(currentPlans =>
        currentPlans.map(plan =>
            plan.id === planId ? { ...plan, [field]: value } : plan
        )
        );
        setSuccess(prev => ({ ...prev, [String(planId)]: null }));
        setError(prev => ({ ...prev, [String(planId)]: null, general: null }));
    };

    const handleNewPlanChange = (field: keyof PlanFormState, value: string | boolean | number) => {
        setNewPlan(prev => ({ ...prev, [field]: value }));
        setError(prev => ({ ...prev, new: null, general: null }));
        setSuccess(prev => ({ ...prev, new: null}));
    };

  // --- API Call Functions (Keep existing handlers) ---
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

        if (!payload.name || isNaN(payload.price) || isNaN(payload.duration_months)) {
            setError({ [String(planId)]: "Name, Price, and Duration are required and must be valid numbers." });
            setSavingPlanId(null);
            return;
          }

        try {
            const response = await fetch(`/api/membership-plans/${planId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || `HTTP error! status: ${response.status}`); }
            setSuccess({ [String(planId)]: `Plan "${planToSave.name}" updated successfully!` });
            // Update local state immediately for better UX
            setPlans(currentPlans => currentPlans.map(p => p.id === planId ? planToSave : p));
        } catch (err: any) { setError({ [String(planId)]: `Update failed: ${err.message}` }); }
        finally {
            setSavingPlanId(null);
            setTimeout(() => setSuccess(prev => ({ ...prev, [String(planId)]: null })), 3000); // Clear success after 3s
        }
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

        if (!payload.name || isNaN(payload.price) || isNaN(payload.duration_months)) {
            setError({ new: "Name, Price, and Duration are required and must be valid numbers." });
            setSavingPlanId(null);
            return;
        }

        try {
            const response = await fetch(`/api/membership-plans`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || `HTTP error! status: ${response.status}`); }
            setSuccess({ new: `Plan "${newPlan.name}" created successfully!` });
            setNewPlan(initialNewPlanState);
            setShowAddForm(false);
            await fetchPlans(); // Refresh list after successful creation
        } catch (err: any) { setError({ new: `Create failed: ${err.message}` }); }
        finally {
             setSavingPlanId(null);
             setTimeout(() => setSuccess(prev => ({ ...prev, new: null })), 3000); // Clear success after 3s
        }
    };

    const handleDeletePlan = async (planId: number) => {
        if (!isOwner) return;
        const planToDelete = plans.find(p => p.id === planId);
        if (!planToDelete) return;

        if (!window.confirm(`Are you sure you want to delete the "${planToDelete.name}" plan? This cannot be undone.`)) {
        return;
        }

        setDeletingPlanId(planId);
        setError(prev => ({ ...prev, [String(planId)]: null, general: null }));
        setSuccess(prev => ({ ...prev, [String(planId)]: null }));

        try {
            const response = await fetch(`/api/membership-plans/${planId}`, { method: 'DELETE' });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || `HTTP error! status: ${response.status}`); }
            // Success: Remove plan from local state immediately
            setPlans(currentPlans => currentPlans.filter(p => p.id !== planId));
        } catch (err: any) { setError({ general: `Delete failed: ${err.message}` }); }
        finally { setDeletingPlanId(null); }
    };

  // --- Helper Function RenderPlanFormFields (Keep existing function) ---
    const renderPlanFormFields = (
        plan: PlanFormState,
        onChangeHandler: (field: keyof PlanFormState, value: string | boolean | number) => void,
        idPrefix: string | number,
        isDisabled: boolean
    ) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
             <div className="space-y-1 lg:col-span-1">
                 <label htmlFor={`name-${idPrefix}`} className="text-xs font-medium text-gray-400">Plan Name *</label>
                 <Input id={`name-${idPrefix}`} value={plan.name} onChange={(e) => onChangeHandler('name', e.target.value)} disabled={isDisabled || plan.id !== undefined} className="bg-gray-900 border-gray-700 text-white disabled:opacity-70 disabled:cursor-not-allowed" required />
             </div>
             <div className="space-y-1">
                 <label htmlFor={`price-${idPrefix}`} className="text-xs font-medium text-gray-400">Price (RM) *</label>
                 <Input id={`price-${idPrefix}`} value={plan.price} onChange={(e) => onChangeHandler('price', e.target.value)} disabled={isDisabled} className="bg-gray-900 border-gray-700 text-white disabled:opacity-70" type="number" step="0.01" required />
             </div>
             <div className="space-y-1">
                 <label htmlFor={`monthly_equivalent-${idPrefix}`} className="text-xs font-medium text-gray-400">Per Month (RM, optional)</label>
                 <Input id={`monthly_equivalent-${idPrefix}`} value={plan.monthly_equivalent || ''} onChange={(e) => onChangeHandler('monthly_equivalent', e.target.value)} disabled={isDisabled} className="bg-gray-900 border-gray-700 text-white disabled:opacity-70" placeholder="e.g., 99.9" type="number" step="0.01" />
             </div>
             <div className="space-y-1">
                 <label htmlFor={`duration_months-${idPrefix}`} className="text-xs font-medium text-gray-400">Duration (Months) *</label>
                 <Input id={`duration_months-${idPrefix}`} value={plan.duration_months} onChange={(e) => onChangeHandler('duration_months', parseInt(e.target.value, 10) || 0)} disabled={isDisabled} className="bg-gray-900 border-gray-700 text-white disabled:opacity-70" type="number" step="0" min="0" required />
             </div>
             <div className="space-y-1">
                 <label htmlFor={`bonus_offer-${idPrefix}`} className="text-xs font-medium text-gray-400">Bonus Text (optional)</label>
                 <Input id={`bonus_offer-${idPrefix}`} value={plan.bonus_offer || ''} onChange={(e) => onChangeHandler('bonus_offer', e.target.value)} disabled={isDisabled} className="bg-gray-900 border-gray-700 text-white disabled:opacity-70" placeholder="e.g., + 1 MONTH FREE" />
             </div>
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
             <div className="space-y-1 md:col-span-2 lg:col-span-4">
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

   // --- Placeholder Save Function ---
   const handleGenericSave = (section: string) => {
    // In a real app, you'd gather data from the specific form section
    // and make an API call to save it.
    alert(`${section} settings saved! (Placeholder - no data actually saved)`);
   }

  // --- Main Render ---
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white"></h1>
        <p className="text-gray-400 mt-1">
          Manage gym information, admin account, and membership plans.
        </p>
      </div>

      {/* --- Gym Information Card --- */}
      <Card className="bg-black border-2 border-white/10">
         <CardHeader>
           <CardTitle className="text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Gym Information</CardTitle>
           <CardDescription className="text-gray-400">Update your gym's public details (Contact, Location, Hours).</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label htmlFor="gymLocation" className="text-xs font-medium text-gray-400">Location</label>
                    <Input id="gymLocation" defaultValue="33A, 33B, Jalan Bestari 12/2, Taman Nusa Bestari" className="bg-gray-900 border-gray-700 text-white" />
                </div>
                <div className="space-y-1">
                    <label htmlFor="gymContact" className="text-xs font-medium text-gray-400">Contact Phone</label>
                    <Input id="gymContact" defaultValue="011-7260 3994" className="bg-gray-900 border-gray-700 text-white" />
                </div>
                <div className="space-y-1 md:col-span-2">
                    <label htmlFor="gymHours" className="text-xs font-medium text-gray-400">Operating Hours</label>
                    <Input id="gymHours" defaultValue="Everyday | 6 AM - 1 AM" className="bg-gray-900 border-gray-700 text-white" />
                </div>
            </div>
             <div className="flex justify-end">
                <Button onClick={() => handleGenericSave('Gym Info')} className="bg-primary text-black hover:bg-yellow-500 font-bold text-sm h-8 px-3">
                    Save Gym Details
                </Button>
            </div>
         </CardContent>
      </Card>

      {/* --- Admin Account Card --- */}
      <Card className="bg-black border-2 border-white/10">
         <CardHeader>
           <CardTitle className="text-white flex items-center gap-2"><Mail className="w-5 h-5 text-primary"/> Admin Account</CardTitle>
           <CardDescription className="text-gray-400">View your account details. Password changes are handled on the Profile page.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="flex items-center gap-4">
                 <Avatar className="h-12 w-12 border-2 border-primary/50">
                    {/* Placeholder Avatar */}
                    <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NarVdsZO6GQsZCxUMfpFASjYKM3kQK.png" alt={userName} />
                    <AvatarFallback className="bg-primary text-black font-bold">
                        {userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-lg font-semibold text-white">{userName}</p>
                    <p className="text-sm text-gray-400">{userEmail || 'Loading email...'}</p>
                </div>
            </div>
             <div className="flex justify-end">
                 <Link href="/dashboard/profile">
                    <Button variant="outline" className="text-primary border-primary hover:bg-primary/10 hover:text-white font-bold text-sm h-8 px-3">
                        Go to Profile (Change Password)
                    </Button>
                 </Link>
            </div>
         </CardContent>
      </Card>

      {/* --- Membership Plan Settings Card (Only visible to Owner) --- */}
      {isOwner && (
        <Card className="bg-black border-2 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-primary"/> Membership Plan Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Create, update, or delete membership plans.
              </CardDescription>
            </div>
            {!showAddForm && (
              <Button onClick={() => { setShowAddForm(true); setNewPlan(initialNewPlanState); setError({}); setSuccess({}); }} className="bg-primary text-black hover:bg-yellow-500 font-bold">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Plan
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {error.general && <p className="text-sm text-red-500">{error.general}</p>}

            {/* Add New Plan Form */}
            {showAddForm && (
              <div className="space-y-4 border-b-2 border-primary pb-6 mb-6">
                  {/* ... (renderPlanFormFields for newPlan) ... */}
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

            {/* Existing Plans List */}
            {loading && !plans.length ? (
               <div className="flex justify-center items-center h-20"><div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div></div>
            ) : plans.length === 0 && !loading ? (
               <p className="text-center text-gray-500">No membership plans found. Add one to get started!</p>
            ) : (
              plans.map((plan) => {
                const currentPlanId = plan.id!;
                const isDisabled = !isOwner || savingPlanId !== null || deletingPlanId === currentPlanId;
                const isSavingThis = savingPlanId === currentPlanId;
                const isDeletingThis = deletingPlanId === currentPlanId;

                return (
                  <div key={currentPlanId} className="space-y-4 border-b border-gray-800 pb-6 last:border-b-0 last:pb-0">
                     {/* ... (renderPlanFormFields for existing plan) ... */}
                      <div className="flex justify-between items-center">
                        {/* Display existing plan name or input for new plan */}
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
      )}

      {/* Message for non-owners regarding plan settings */}
      {!isOwner && !loading && (
           <Card className="bg-black border-2 border-white/10">
             <CardHeader>
                <CardTitle className="text-white flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-primary"/> Membership Plan Settings</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-gray-400">Viewing membership plans is restricted. Owner permissions required to manage plans.</p>
            </CardContent>
           </Card>
      )}

    </div>
  );
}