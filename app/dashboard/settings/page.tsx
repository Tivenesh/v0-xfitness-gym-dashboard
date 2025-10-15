// app/dashboard/settings/page.tsx

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage your gym's information and account settings.
        </p>
      </div>

      {/* Gym Information Card */}
      <Card className="bg-black border-2 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Gym Information</CardTitle>
          <CardDescription className="text-gray-400">Update your gym's public details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Gym Name</label>
            <Input defaultValue="XFitness Gym" className="bg-gray-900 border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Contact Number</label>
            <Input defaultValue="011-7260 3994" className="bg-gray-900 border-gray-700 text-white" />
          </div>
          <div className="flex justify-end">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Account Card */}
      <Card className="bg-black border-2 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Admin Account</CardTitle>
          <CardDescription className="text-gray-400">Manage your login credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Current Password</label>
            <Input type="password" placeholder="********" className="bg-gray-900 border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">New Password</label>
            <Input type="password" placeholder="Enter a new secure password" className="bg-gray-900 border-gray-700 text-white" />
          </div>
          <div className="flex justify-end">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}