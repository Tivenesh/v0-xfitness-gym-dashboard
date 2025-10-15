// File: components/profile-form.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase-browser"; // We'll reuse our browser client

export function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccess("Your password has been updated successfully!");
      (event.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black border-2 border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white font-black uppercase tracking-wide">
            My Profile
          </CardTitle>
          <CardDescription className="text-gray-400">
            View your account details and update your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
              <Input id="email" value={user?.email || ''} disabled className="bg-zinc-900 border-white/20 text-white/90" />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-300">Role</label>
              <Input id="role" value={user?.app_metadata?.role || 'No Role Assigned'} disabled className="bg-zinc-900 border-white/20 text-white/90" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-2 border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white font-black uppercase tracking-wide">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-300">New Password</label>
                <Input name="newPassword" type="password" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirm New Password</label>
                <Input name="confirmPassword" type="password" required disabled={loading} className="bg-gray-900 border-gray-700 text-white" />
              </div>
            </div>

            {success && <p className="text-sm text-green-400">{success}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end">
              <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}