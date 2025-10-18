// File: components/edit-trainer-form.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase-browser"; // For fetching user role

// Define the structure of the trainer data
interface Trainer {
  id: number;
  name: string;
  email: string | null;
  specialization: string | null;
  status: string;
  avatar_url: string | null;
}

export function EditTrainerForm({ trainerId }: { trainerId: string }) {
  const router = useRouter();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // Used for both update and delete actions
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // State for user role
  const supabase = createClient();

  // Fetch initial data (trainer details and user role)
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch the current user's role first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error('Could not fetch user session.');
        setUserRole(session?.user?.app_metadata?.role || null);

        // Fetch the specific trainer's details
        const response = await fetch(`/api/trainers/${trainerId}`);
        if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.error || 'Failed to fetch trainer details');
        }
        const data: Trainer = await response.json();
        setTrainer(data);

      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [trainerId, supabase]);

  // Handle form submission for UPDATING trainer details
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpdating(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const updatedData = {
      name: formData.get('name'),
      email: formData.get('email'),
      specialization: formData.get('specialization'),
      status: formData.get('status'),
      avatar_url: formData.get('avatarUrl')
    };

    try {
      const response = await fetch(`/api/trainers/${trainerId}`, { // PUT request
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update trainer');
      }

      alert("Trainer updated successfully!");
      router.push('/dashboard/trainers');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setUpdating(false); // Re-enable buttons on error
    }
    // No finally setLoading(false) here, as navigation happens on success
  };

  // Handle DELETING the trainer
  const handleDelete = async () => {
    // Double-check role just before deleting, although API does it too
    if (userRole !== 'Owner') {
        setError("You are not authorized to delete trainers.");
        return;
    }
    if (!window.confirm("Are you sure you want to permanently delete this trainer? This action cannot be undone.")) {
      return;
    }
    setUpdating(true); // Reuse updating state to disable buttons
    setError(null);

    try {
      const response = await fetch(`/api/trainers/${trainerId}`, { // DELETE request
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete trainer');
      }

      alert("Trainer deleted successfully!");
      router.push('/dashboard/trainers');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setUpdating(false); // Re-enable buttons on error
    }
     // No finally setLoading(false) here, as navigation happens on success
  };

  // --- Render logic ---
  if (loading) return <div className="text-center text-gray-400">Loading trainer...</div>;
  if (error && !trainer) return <div className="text-center text-red-500">Error: {error}</div>; // Show error only if trainer data failed to load
  if (!trainer) return <div className="text-center text-gray-500">Trainer not found.</div>;

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Editing: {trainer.name}</CardTitle>
        <CardDescription className="text-gray-400">Modify the trainer's information below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields (same as before) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name *</Label>
              <Input name="name" defaultValue={trainer.name} required disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</Label>
              <Input name="email" type="email" defaultValue={trainer.email ?? ''} disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium text-gray-300">Specialization</Label>
              <Input name="specialization" defaultValue={trainer.specialization ?? ''} disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-300">Status</Label>
              <select name="status" defaultValue={trainer.status} required disabled={updating} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
                <option>Active</option>
                <option>On Leave</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="avatarUrl" className="text-sm font-medium text-gray-300">Avatar Image URL (Optional)</Label>
              <Input name="avatarUrl" defaultValue={trainer.avatar_url ?? ''} disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
            </div>
          </div>

          {/* Error display */}
          {error && <p className="text-sm text-red-500 pt-4">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <div>
              {/* Conditionally render Delete button only for Owners */}
              {userRole === 'Owner' && (
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={updating}>
                  {updating ? 'Deleting...' : 'Delete Trainer'}
                </Button>
              )}
            </div>
            <Button type="submit" className="bg-primary text-black hover:bg-yellow-500 font-bold" disabled={updating}>
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}