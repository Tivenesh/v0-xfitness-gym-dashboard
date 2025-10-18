// File: components/add-class-form.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Trainer {
  id: number;
  name: string;
}

export function AddClassForm() {
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrainers() {
      try {
        const response = await fetch('/api/trainers');
        if (!response.ok) throw new Error('Failed to fetch trainers');
        const data = await response.json();
        setTrainers(data);
      } catch (err: any) {
        console.error("Error fetching trainers:", err);
        // Optionally set an error state here if needed
      }
    }
    fetchTrainers();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const classData = {
      name: formData.get('name'),
      trainer_id: formData.get('trainerId'),
      schedule_time: formData.get('scheduleTime'),
      capacity: formData.get('capacity'),
    };

    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to schedule class');
      }

      alert("Class scheduled successfully!");
      router.push('/dashboard/classes');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Class Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-300">Class Name *</Label>
              <Input name="name" placeholder="e.g., Yoga Flow" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainerId" className="text-sm font-medium text-gray-300">Assign Trainer</Label>
              <select name="trainerId" disabled={loading} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
                <option value="">Unassigned</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>{trainer.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleTime" className="text-sm font-medium text-gray-300">Schedule Date & Time *</Label>
              <Input
                name="scheduleTime"
                type="datetime-local"
                required
                disabled={loading}
                className="bg-gray-900 border-gray-700 text-white"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-sm font-medium text-gray-300">Capacity *</Label>
              <Input name="capacity" type="number" placeholder="e.g., 15" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 pt-4">{error}</p>}

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-primary text-black hover:bg-yellow-500 font-bold" disabled={loading}>
              {loading ? 'Saving...' : 'Schedule Class'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}