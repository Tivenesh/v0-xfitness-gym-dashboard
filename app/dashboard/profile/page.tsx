// File: app/dashboard/profile/page.tsx

import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white"></h1>
      <ProfileForm />
    </div>
  );
}