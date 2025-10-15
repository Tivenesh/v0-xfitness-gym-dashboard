"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function NotificationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const notificationData = {
      title: formData.get('title'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send notification');
      }

      setSuccess("Notification has been successfully saved to the database!");
      (event.target as HTMLFormElement).reset(); // Clear the form on success

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">Compose Message</CardTitle>
        <CardDescription className="text-gray-400">The message will be sent to all active members.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-300">Title</label>
            <Input name="title" placeholder="e.g., Special Holiday Hours" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
            <Textarea name="message" placeholder="Write your announcement here..." required disabled={loading} className="bg-gray-900 border-gray-700 text-white min-h-[150px]" />
          </div>

          {/* Display success or error messages */}
          {success && <p className="text-sm text-green-400">{success}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold" disabled={loading}>
              {loading ? 'Sending...' : 'Send Notification'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}