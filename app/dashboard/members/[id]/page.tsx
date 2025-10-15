"use client"

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function EditMemberPage({ params }: { params: { id: string } }) {
    // Use the 'use' hook to correctly access params in new Next.js versions
    const memberId = use(params).id;
    const router = useRouter();
    
    // State management for the component
    const [member, setMember] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch member data when the component loads or memberId changes
    useEffect(() => {
        if (memberId) {
            const fetchMember = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/api/users/${memberId}`);
                    if (!response.ok) {
                        throw new Error('Member not found');
                    }
                    const data = await response.json();
                    setMember(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchMember();
        }
    }, [memberId]);

    // Handle form submission to update member details
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdating(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const updatedData = {
            full_name: formData.get('fullName'),
            email: formData.get('email'),
            phone_number: formData.get('phone'),
            plan: formData.get('plan'),
            end_date: formData.get('endDate'),
        };

        try {
            const response = await fetch(`/api/users/${memberId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update member');
            }

            alert("Member updated successfully!");
            router.push('/dashboard');
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    // Handle member deletion
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
            return;
        }

        setUpdating(true);
        setError(null);

        try {
            const response = await fetch(`/api/users/${memberId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete member');
            }

            alert("Member deleted successfully!");
            router.push('/dashboard');
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    // UI states for loading and errors
    if (loading) {
        return <div className="text-white text-center p-8">Loading member details...</div>;
    }

    if (error && !member) {
        return <div className="text-red-500 text-center p-8">Error: {error}</div>;
    }

    // Main component render
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Edit Member</h1>
            <Card className="bg-black border border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white">{member?.full_name}</CardTitle>
                    <CardDescription className="text-gray-400">Update member details below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-sm font-medium text-gray-300">Full Name</label>
                                <Input name="fullName" defaultValue={member?.full_name} disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                                <Input name="email" type="email" defaultValue={member?.email} disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone Number</label>
                                <Input name="phone" defaultValue={member?.phone_number} disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="plan" className="text-sm font-medium text-gray-300">Membership Plan</label>
                                <select name="plan" defaultValue={member?.plan} disabled={updating} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
                                    <option value="1 Month">1 Month</option>
                                    <option value="3 Months">3 Months</option>
                                    <option value="6 Months">6 Months</option>
                                    <option value="12 Months">12 Months</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="endDate" className="text-sm font-medium text-gray-300">End Date</label>
                                <Input name="endDate" type="date" defaultValue={member?.end_date} disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <div className="flex justify-between items-center pt-4">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={updating}
                            >
                                {updating ? 'Deleting...' : 'Delete Member'}
                            </Button>
                            <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500" disabled={updating}>
                                {updating ? 'Updating...' : 'Update Member'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
