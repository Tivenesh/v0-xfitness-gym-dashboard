// File: components/edit-class-form.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase-browser";

interface ClassData {
  id: number;
  name: string;
  trainer_id: number | null;
  schedule_time: string;
  capacity: number;
}
interface Trainer {
  id: number;
  name: string;
}

export function EditClassForm({ classId }: { classId: string }) {
  const router = useRouter();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUserRole(session?.user?.app_metadata?.role || null);

        const trainersRes = await fetch('/api/trainers');
        if (!trainersRes.ok) throw new Error('Failed to fetch trainers');
        setTrainers(await trainersRes.json());

        const classRes = await fetch(`/api/classes/${classId}`);
        if (!classRes.ok) throw new Error('Failed to fetch class details');
        setClassData(await classRes.json());

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [classId, supabase]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpdating(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const updatedData = {
      name: formData.get('name'),
      trainer_id: formData.get('trainerId'),
      schedule_time: formData.get('scheduleTime'),
      capacity: formData.get('capacity'),
    };

    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update class');
      }
      
      alert("Class updated successfully!");
      router.push('/dashboard/classes');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (userRole !== 'Owner') {
        alert("You are not authorized to perform this action.");
        return;
    }
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete class');
      }

      alert("Class deleted successfully!");
      router.push('/dashboard/classes');
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
      setUpdating(false);
    }
  };

   const formatDateTimeLocal = (isoString: string | null): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const timezoneOffset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - timezoneOffset);
      return localDate.toISOString().slice(0, 16);
    } catch (e) {
      console.error("Error formatting date:", e);
      return '';
    }
  };


  if (loading) return <div className="text-center text-gray-400">Loading class details...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!classData) return <div className="text-center text-gray-500">Class not found.</div>;

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Editing: {classData.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-300">Class Name *</Label>
              <Input name="name" defaultValue={classData.name} required disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainerId" className="text-sm font-medium text-gray-300">Assign Trainer</Label>
              <select name="trainerId" defaultValue={classData.trainer_id ?? ''} disabled={updating} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
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
                defaultValue={formatDateTimeLocal(classData.schedule_time)}
                required
                disabled={updating}
                className="bg-gray-900 border-gray-700 text-white"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-sm font-medium text-gray-300">Capacity *</Label>
              <Input name="capacity" type="number" defaultValue={classData.capacity} required disabled={updating} className="bg-gray-900 border-gray-700 text-white" />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 pt-4">{error}</p>}
          <div className="flex justify-between items-center pt-4">
            <div>
              {userRole === 'Owner' && (
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={updating}>
                  {updating ? 'Deleting...' : 'Delete Class'}
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