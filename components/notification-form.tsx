// components/notification-form.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { History } from "lucide-react";

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
      recipientGroup: formData.get('recipientGroup'), // Get the new field
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
      
      setSuccess("Notification has been successfully saved!");
      (event.target as HTMLFormElement).reset();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
            <CardTitle className="text-white font-black uppercase tracking-wide">Compose Message</CardTitle>
            <CardDescription className="text-gray-400">Select a recipient group and compose your message.</CardDescription>
        </div>
        <Link href="/dashboard/notifications/history">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/10 hover:text-white font-bold">
                <History className="mr-2 h-4 w-4"/>
                View History
            </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
                <label htmlFor="recipientGroup" className="text-sm font-medium text-gray-300">Recipient Group</label>
                <select name="recipientGroup" defaultValue="All Members" required disabled={loading} className="w-full h-9 rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-base text-white">
                    <option>All Members</option>
                    <option>Active Members</option>
                    <option>Expired Members</option>
                </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-300">Title</label>
              <Input name="title" placeholder="e.g., Special Holiday Hours" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
              <Textarea name="message" placeholder="Write your announcement here..." required disabled={loading} className="bg-gray-900 border-gray-700 text-white min-h-[150px]" />
            </div>
          </div>
          
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