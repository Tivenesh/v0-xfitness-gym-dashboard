"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// We are no longer importing a custom Label component to avoid errors

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      end_date: formData.get('endDate'),
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create member');
      }

      alert("Member created successfully!");
      router.push('/dashboard');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Add New Member</h1>
      
      <Card className="bg-black border border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Member Details</CardTitle>
          <CardDescription className="text-gray-400">Fill out the form to add a new member to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-300">Full Name</label>
                <Input name="fullName" placeholder="e.g., John Doe" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                <Input name="email" type="email" placeholder="e.g., john.doe@email.com" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone Number</label>
                <Input name="phone" placeholder="e.g., 012-3456789" disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
              </div>

              <div className="space-y-2">
                <label htmlFor="plan" className="text-sm font-medium text-gray-300">Membership Plan</label>
                <select name="plan" className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white" disabled={loading}>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium text-gray-300">End Date</label>
                <Input name="endDate" type="date" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <div className="flex justify-end">
              <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500" disabled={loading}>
                {loading ? 'Saving...' : 'Save Member'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}