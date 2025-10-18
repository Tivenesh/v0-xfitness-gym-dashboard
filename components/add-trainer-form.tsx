// File: components/add-trainer-form.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Assuming you have this ShadCN component

export function AddTrainerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const trainerData = {
      name: formData.get('name'),
      email: formData.get('email'),
      specialization: formData.get('specialization'),
      status: formData.get('status'),
      avatar_url: formData.get('avatarUrl') // Optional field
    };

    try {
      const response = await fetch('/api/trainers', { // POST to the collection endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add trainer');
      }

      alert("Trainer added successfully!");
      router.push('/dashboard/trainers'); // Navigate back to the trainers list
      router.refresh(); // Refresh data on the trainers page

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Trainer Details</CardTitle>
        <CardDescription className="text-gray-400">Fill in the trainer's information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name *</Label>
              <Input name="name" placeholder="e.g., Alex Johnson" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</Label>
              <Input name="email" type="email" placeholder="e.g., alex@xfitness.com" disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium text-gray-300">Specialization</Label>
              <Input name="specialization" placeholder="e.g., Strength & Conditioning" disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-300">Status</Label>
              <select name="status" defaultValue="Active" required disabled={loading} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
                <option>Active</option>
                <option>On Leave</option>
                {/* Add other relevant statuses */}
              </select>
            </div>
             <div className="space-y-2 md:col-span-2">
              <Label htmlFor="avatarUrl" className="text-sm font-medium text-gray-300">Avatar Image URL (Optional)</Label>
              <Input name="avatarUrl" placeholder="https://..." disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
              <p className="text-xs text-gray-500">You can use a service like DiceBear or upload an image elsewhere and paste the link.</p>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 pt-4">{error}</p>}

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-primary text-black hover:bg-yellow-500 font-bold" disabled={loading}>
              {loading ? 'Saving...' : 'Add Trainer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}