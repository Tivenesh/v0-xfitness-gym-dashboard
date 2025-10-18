// File: components/profile-form.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase-browser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ShieldCheck, ShieldOff, History } from "lucide-react"; // Added History icon
import { formatDistanceToNow } from 'date-fns'; // For relative time formatting

// Interface for MFA factor data from API
interface MfaFactor {
    id: string;
    status: string; // 'unverified', 'verified'
    type: string; // 'totp'
}

// Interface for enroll data from API
interface EnrollData {
    id: string;
    secret: string;
    qr_code: string; // data:image/svg+xml;base64,...
    uri: string; // otpauth://...
}

// Interface for Activity Log
interface ActivityLog {
    id: number;
    action_description: string;
    target_resource_type?: string;
    target_resource_id?: string;
    timestamp: string;
    details?: any; // JSONB comes as any
}

export function ProfileForm() {
  // Password Update State
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Profile Info State
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // User & Profile Data State
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // MFA States
  const [mfaFactors, setMfaFactors] = useState<MfaFactor[]>([]);
  const [mfaLoading, setMfaLoading] = useState(true);
  const [mfaActionLoading, setMfaActionLoading] = useState(false);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [mfaSuccess, setMfaSuccess] = useState<string | null>(null);
  const [enrollData, setEnrollData] = useState<EnrollData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);

  // Password Reset State
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // Activity Log State
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [logLoading, setLogLoading] = useState(true);
  const [logError, setLogError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch initial user, profile, MFA, and activity log data
  useEffect(() => {
    const fetchInitialData = async () => {
      setProfileLoading(true);
      setMfaLoading(true);
      setLogLoading(true);
      setProfileError(null);
      setMfaError(null);
      setLogError(null);

      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        setUser(authUser);

        if (authUser) {
          // Fetch profile, MFA, and logs in parallel for speed
          const [profileResponse, mfaResponse, logResponse] = await Promise.all([
            fetch('/api/profile'),
            fetch('/api/profile/mfa'),
            fetch('/api/profile/activity')
          ]);

          // Check profile response
          if (!profileResponse.ok) throw new Error('Failed to fetch profile data');
          const profileData = await profileResponse.json();
          setFullName(profileData.full_name || '');
          setAvatarUrl(profileData.avatar_url || '');

          // Check MFA response
          if (!mfaResponse.ok) throw new Error('Failed to fetch MFA status');
          const mfaData = await mfaResponse.json();
          setMfaFactors(mfaData.factors || []);

          // Check log response
          if (!logResponse.ok) throw new Error('Failed to fetch activity log');
          const logData = await logResponse.json();
          setActivityLog(logData || []);

        } else {
            setMfaFactors([]);
            setActivityLog([]); // Clear if no user
        }
      } catch (err: any) {
        const errMsg = `Failed to load data: ${err.message}`;
        setProfileError(errMsg);
        setMfaError(errMsg);
        setLogError(errMsg);
        console.error("Initial data fetch error:", err);
      } finally {
        setProfileLoading(false);
        setMfaLoading(false);
        setLogLoading(false);
      }
    };
    fetchInitialData();
  }, [supabase]);

  // Handle Profile Update Submission
  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileSaving(true); setProfileError(null); setProfileSuccess(null);
    try {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: fullName, avatar_url: avatarUrl }),
        });
        if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to update profile'); }
        const updatedData = await response.json();
        setFullName(updatedData.full_name || '');
        setAvatarUrl(updatedData.avatar_url || '');
        setProfileSuccess("Profile updated successfully!");
    } catch (err: any) { setProfileError(err.message); }
    finally { setProfileSaving(false); setTimeout(() => setProfileSuccess(null), 3000); }
  };

  // Handle Password Update Submission
  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordLoading(true); setPasswordError(null); setPasswordSuccess(null);
    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    if (newPassword !== confirmPassword) { setPasswordError("New passwords do not match."); setPasswordLoading(false); return; }
    if (!newPassword || newPassword.length < 6) { setPasswordError("Password cannot be empty and must be at least 6 characters long."); setPasswordLoading(false); return; }
    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        setPasswordSuccess("Your password has been updated successfully!");
        (event.target as HTMLFormElement).reset();
    } catch (err: any) { setPasswordError(err.message); }
    finally { setPasswordLoading(false); setTimeout(() => { setPasswordSuccess(null); setPasswordError(null); }, 3000); }
  };

   // --- MFA Action Handlers ---
  const handleEnrollMfa = async () => {
    setMfaActionLoading(true); setMfaError(null); setMfaSuccess(null); setEnrollData(null); setChallengeId(null); setVerificationCode('');
    try {
        const response = await fetch('/api/profile/mfa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'enroll' }), });
        if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Enrollment failed'); }
        const data: EnrollData = await response.json();
        setEnrollData(data);
    } catch (err: any) { setMfaError(err.message); }
    finally { setMfaActionLoading(false); }
  };
  const handleVerifyMfa = async () => {
    if (!enrollData || !verificationCode) { setMfaError("Enrollment data or verification code missing."); return; }
    setMfaActionLoading(true); setMfaError(null); setMfaSuccess(null); setChallengeId(null);
    try {
        const challengeRes = await fetch('/api/profile/mfa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'challenge', factorId: enrollData.id }), });
        if (!challengeRes.ok) { const data = await challengeRes.json(); throw new Error(data.error || 'Failed to get challenge'); }
        const challengeData = await challengeRes.json();
        const currentChallengeId = challengeData.id;
        setChallengeId(currentChallengeId);
        if (!currentChallengeId) throw new Error('Challenge ID not received');
        const verifyRes = await fetch('/api/profile/mfa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'verify', factorId: enrollData.id, challengeId: currentChallengeId, code: verificationCode }), });
        if (!verifyRes.ok) { const data = await verifyRes.json(); throw new Error(data.error || 'Verification failed'); }
        setMfaSuccess("2FA enabled successfully!"); setEnrollData(null); setVerificationCode(''); setChallengeId(null); await refreshMfaFactors();
    } catch (err: any) { setMfaError(err.message); }
    finally { setMfaActionLoading(false); }
  };
  const handleUnenrollMfa = async (factorId: string) => {
    if (!window.confirm("Are you sure you want to disable Two-Factor Authentication?")) return;
    setMfaActionLoading(true); setMfaError(null); setMfaSuccess(null);
    try {
        const response = await fetch('/api/profile/mfa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'unenroll', factorId: factorId }), });
        if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Failed to disable 2FA'); }
        setMfaSuccess("2FA disabled successfully!"); await refreshMfaFactors();
    } catch (err: any) { setMfaError(err.message); }
    finally { setMfaActionLoading(false); }
  };
  const refreshMfaFactors = async () => {
    setMfaLoading(true);
    try {
        const mfaResponse = await fetch('/api/profile/mfa');
        if (!mfaResponse.ok) throw new Error('Failed to refresh MFA status');
        const mfaData = await mfaResponse.json();
        setMfaFactors(mfaData.factors || []);
    } catch (err: any) { setMfaError(`Failed to refresh MFA status: ${err.message}`); }
    finally { setMfaLoading(false); setTimeout(() => { setMfaSuccess(null); setMfaError(null); }, 3000); }
  };

  // Handle Password Reset Request
  const handlePasswordResetRequest = async () => {
    if (!user?.email) { setResetError("User email not found."); return; }
    setResetLoading(true); setResetError(null); setResetSuccess(null);
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email);
        if (error) throw error;
        setResetSuccess("Password reset email sent! Check your inbox.");
    } catch (err: any) { setResetError(`Failed to send reset email: ${err.message}`); }
    finally { setResetLoading(false); setTimeout(() => { setResetSuccess(null); setResetError(null); }, 5000); }
  };

  const verifiedFactor = mfaFactors.find(f => f.status === 'verified' && f.type === 'totp');

  return (
    <div className="space-y-6">
      {/* --- My Profile Card --- */}
      <Card className="bg-black border-2 border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white font-black uppercase tracking-wide">My Profile</CardTitle>
          <CardDescription className="text-gray-400">Update your name and avatar. Email and Role are read-only.</CardDescription>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <div className="flex justify-center items-center h-20"><div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div></div>
          ) : profileError && !user ? (
            <p className="text-sm text-red-500">{profileError}</p>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-primary/50">
                  <AvatarImage src={avatarUrl || undefined} alt={fullName || user?.email?.charAt(0)} />
                  <AvatarFallback className="bg-primary text-black font-bold text-xl">
                    {fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <label htmlFor="avatarUrl" className="text-xs font-medium text-gray-400">Avatar Image URL</label>
                  <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." disabled={profileSaving} className="bg-gray-900 border-gray-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="fullName" className="text-xs font-medium text-gray-400">Full Name</label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={profileSaving} className="bg-gray-900 border-gray-700 text-white" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-medium text-gray-400">Email Address (Read-only)</label>
                  <Input id="email" value={user?.email || ''} disabled className="bg-zinc-900 border-white/20 text-gray-400 cursor-not-allowed" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="role" className="text-xs font-medium text-gray-400">Role (Read-only)</label>
                  <Input id="role" value={user?.app_metadata?.role || 'N/A'} disabled className="bg-zinc-900 border-white/20 text-gray-400 cursor-not-allowed" />
                </div>
              </div>
              {profileSuccess && <p className="text-sm text-green-400">{profileSuccess}</p>}
              {profileError && <p className="text-sm text-red-500">{profileError}</p>}
              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-primary text-black hover:bg-yellow-500 font-bold" disabled={profileSaving || profileLoading}>
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* --- Two-Factor Authentication Card --- */}
      <Card className="bg-black border-2 border-white/10 rounded-xl">
        <CardHeader>
            <CardTitle className="text-white font-black uppercase tracking-wide">Two-Factor Authentication (2FA)</CardTitle>
            <CardDescription className="text-gray-400">Add an extra layer of security using an authenticator app (e.g., Google Authenticator, Authy).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {mfaLoading ? (
                 <div className="flex justify-center items-center h-10"><div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div></div>
            ) : mfaError ? (
                 <p className="text-sm text-red-500">{mfaError}</p>
            ) : (
                <>
                    <div className={`flex items-center gap-2 p-3 rounded-md border ${verifiedFactor ? 'border-green-600/50 bg-green-900/20' : 'border-gray-700 bg-gray-900/30'}`}>
                        {verifiedFactor ? <ShieldCheck className="w-5 h-5 text-green-400" /> : <ShieldOff className="w-5 h-5 text-gray-400" />}
                        <p className={`text-sm font-medium ${verifiedFactor ? 'text-green-300' : 'text-gray-300'}`}>Status: {verifiedFactor ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    {!verifiedFactor && !enrollData && (<Button onClick={handleEnrollMfa} disabled={mfaActionLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">{mfaActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Enable 2FA</Button>)}
                    {verifiedFactor && (<Button onClick={() => handleUnenrollMfa(verifiedFactor.id)} disabled={mfaActionLoading} variant="destructive">{mfaActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Disable 2FA</Button>)}
                    {enrollData && !verifiedFactor && (
                        <div className="space-y-4 pt-4 border-t border-gray-700">
                            <p className="text-sm text-gray-300">Scan the QR code with your authenticator app or manually enter the secret key:</p>
                            <div className="bg-white p-2 inline-block rounded"><img src={enrollData.qr_code} alt="2FA QR Code" /></div>
                            <div className="space-y-1"><label className="text-xs font-medium text-gray-400">Secret Key</label><Input value={enrollData.secret} readOnly disabled className="bg-zinc-800 border-gray-700 text-gray-400 font-mono text-sm tracking-wider" /></div>
                            <div className="space-y-1"><label htmlFor="verificationCode" className="text-xs font-medium text-gray-400">Enter Verification Code *</label><Input id="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6} placeholder="6-digit code" disabled={mfaActionLoading} className="bg-gray-900 border-gray-700 text-white font-mono text-lg tracking-widest max-w-xs" /></div>
                            <Button onClick={handleVerifyMfa} disabled={mfaActionLoading || verificationCode.length !== 6} className="bg-green-600 hover:bg-green-700 text-white font-bold">{mfaActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Verify & Enable</Button>
                            <Button onClick={() => { setEnrollData(null); setMfaError(null); }} disabled={mfaActionLoading} variant="ghost" className="text-gray-400 hover:text-white ml-2">Cancel</Button>
                        </div>
                    )}
                    {mfaSuccess && <p className="text-sm text-green-400">{mfaSuccess}</p>}
                    {mfaError && !enrollData && <p className="text-sm text-red-500">{mfaError}</p>}
                </>
            )}
        </CardContent>
      </Card>

      {/* --- Change Password Card --- */}
      <Card className="bg-black border-2 border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white font-black uppercase tracking-wide">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="newPassword" className="text-xs font-medium text-gray-400">New Password *</label>
                <Input name="newPassword" type="password" required disabled={passwordLoading} className="bg-gray-900 border-gray-700 text-white" placeholder="••••••••" />
              </div>
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-400">Confirm New Password *</label>
                <Input name="confirmPassword" type="password" required disabled={passwordLoading} className="bg-gray-900 border-gray-700 text-white" placeholder="••••••••"/>
              </div>
            </div>
            {passwordSuccess && <p className="text-sm text-green-400">{passwordSuccess}</p>}
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            <div className="flex justify-between items-center pt-4">
              <Button type="button" variant="link" className="text-primary hover:text-yellow-300 p-0 h-auto text-sm disabled:text-gray-500" onClick={handlePasswordResetRequest} disabled={resetLoading || !user?.email}>
                {resetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Forgot Password? (Send Reset Email)
              </Button>
              <Button type="submit" className="bg-primary text-black hover:bg-yellow-500 font-bold" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
            {resetSuccess && <p className="text-sm text-green-400 mt-2">{resetSuccess}</p>}
            {resetError && <p className="text-sm text-red-500 mt-2">{resetError}</p>}
          </form>
        </CardContent>
      </Card>

      {/* --- Admin Activity Log Card --- */}
      <Card className="bg-black border-2 border-white/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white font-black uppercase tracking-wide flex items-center gap-2">
             <History className="w-5 h-5 text-primary" /> Activity Log
          </CardTitle>
          <CardDescription className="text-gray-400">Recent actions performed by your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {logLoading ? (
             <div className="flex justify-center items-center h-20"><div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div></div>
          ) : logError ? (
            <p className="text-sm text-red-500">{logError}</p>
          ) : activityLog.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No recent activity found.</p>
          ) : (
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {activityLog.map((log) => (
                <li key={log.id} className="flex justify-between items-start text-sm border-b border-gray-800 pb-2 last:border-b-0 last:pb-0">
                  <span className="text-gray-300 flex-1 mr-4">{log.action_description}</span>
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

    </div>
  );
}