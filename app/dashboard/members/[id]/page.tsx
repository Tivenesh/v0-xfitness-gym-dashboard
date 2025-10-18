"use client"

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';

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

export default function EditMemberPage() {
    const params = useParams();
    const memberId = params.id as string;
    const router = useRouter();

    const [member, setMember] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [plan, setPlan] = useState('');
    const [startDate, setStartDate] = useState('');
    const [status, setStatus] = useState('Active');

    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [plansLoading, setPlansLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setPlansLoading(true);
            setError(null);
            try {
                const [plansResponse, memberResponse] = await Promise.all([
                    fetch('/api/membership-plans'),
                    memberId ? fetch(`/api/users/${memberId}`) : Promise.resolve(null)
                ]);

                if (!plansResponse.ok) throw new Error('Failed to fetch membership plans');
                const plansData: MembershipPlan[] = await plansResponse.json();
                setPlans(plansData);
                setPlansLoading(false);

                if (memberResponse) {
                    if (!memberResponse.ok) {
                        const errorData = await memberResponse.json();
                        throw new Error(errorData.error || `Member (ID: ${memberId}) not found`);
                    }
                    const data = await memberResponse.json();
                    setMember(data);
                    setFullName(data.full_name || '');
                    setEmail(data.email || '');
                    setPhone(data.phone_number || '');

                    const currentPlanExists = plansData.some(p => p.name === data.plan) || data.plan === 'Walk-in';
                    setPlan(currentPlanExists ? data.plan : (plansData.length > 0 ? plansData[0].name : ''));
                    setStartDate(data.start_date ? data.start_date.split('T')[0] : '');
                    setStatus(data.status || 'Active');
                } else {
                     throw new Error("Member ID not found in URL.");
                }

            } catch (err: any) {
                setError(err.message);
                setPlansLoading(false);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [memberId]);

    const endDateDisplay = useMemo(() => {
        return calculateEndDateClient(startDate, plan, plans);
    }, [startDate, plan, plans]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdating(true); setError(null);
        if (!startDate) { setError("Start Date cannot be empty."); setUpdating(false); return; }
        const updatedData = { full_name: fullName, email, phone_number: phone, plan, start_date: startDate, status };
        try {
            const response = await fetch(`/api/users/${memberId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedData) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to update member'); }
            alert("Member updated successfully!");
            router.push('/dashboard'); router.refresh();
        } catch (err: any) { setError(err.message); }
        finally { setUpdating(false); }
    };

    const handleDelete = async () => {
         if (!window.confirm("Are you sure? This action cannot be undone.")) return;
         setDeleting(true); setError(null);
         try {
             const response = await fetch(`/api/users/${memberId}`, { method: 'DELETE' });
             if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to delete member'); }
             alert("Member deleted successfully!");
             router.push('/dashboard'); router.refresh();
         } catch (err: any) { setError(err.message); setDeleting(false); }
    };

    if (loading || plansLoading) {
        return <div className="text-white text-center p-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary"/> Loading data...</div>;
    }
    if (error && !member) {
        return <div className="text-red-500 text-center p-8">Error: {error}</div>;
    }
     if (!member && !loading && !plansLoading) {
        return <div className="text-gray-500 text-center p-8">Member with ID {memberId} could not be found.</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Edit Member</h1>
            <Card className="bg-black border-2 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">{fullName || `Member ID: ${memberId}`}</CardTitle>
                    <CardDescription className="text-gray-400">Update member details below. End date is calculated automatically.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-sm font-medium text-gray-300">Full Name</label>
                                <Input name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={updating || deleting} className="bg-gray-900 border-gray-700 text-white" />
                            </div>
                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                                <Input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={updating || deleting} className="bg-gray-900 border-gray-700 text-white" />
                            </div>
                            {/* Phone */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone Number</label>
                                <Input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={updating || deleting} className="bg-gray-900 border-gray-700 text-white" />
                            </div>
                            {/* Membership Plan */}
                            <div className="space-y-2">
                                <label htmlFor="plan" className="text-sm font-medium text-gray-300">Membership Plan</label>
                                <select
                                    name="plan" value={plan} onChange={(e) => setPlan(e.target.value)}
                                    disabled={updating || deleting || plansLoading} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white focus:ring-primary focus:border-primary"
                                >
                                    
                                    {plans.map(p => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Start Date */}
                            <div className="space-y-2">
                                <label htmlFor="startDate" className="text-sm font-medium text-gray-300">Start Date *</label>
                                <Input name="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={updating || deleting} className="bg-gray-900 border-gray-700 text-white focus:ring-primary focus:border-primary" required />
                            </div>
                            {/* End Date (Display Only) */}
                            <div className="space-y-2">
                                <label htmlFor="endDateDisplay" className="text-sm font-medium text-gray-300">Calculated End Date</label>
                                <Input name="endDateDisplay" value={endDateDisplay} disabled className="bg-zinc-800 border-gray-700 text-gray-400 cursor-not-allowed" />
                            </div>
                            {/* Status */}
                             <div className="space-y-2">
                                <label htmlFor="status" className="text-sm font-medium text-gray-300">Status</label>
                                <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} disabled={updating || deleting} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white focus:ring-primary focus:border-primary">
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500 pt-4">{error}</p>}
                        <div className="flex justify-between items-center pt-4">
                            <Button type="button" variant="destructive" onClick={handleDelete} disabled={updating || deleting}>
                                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {deleting ? 'Deleting...' : 'Delete Member'}
                            </Button>
                            <Button type="submit" className="bg-primary text-black hover:bg-yellow-500 font-bold" disabled={updating || deleting}>
                                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {updating ? 'Updating...' : 'Update Member'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
