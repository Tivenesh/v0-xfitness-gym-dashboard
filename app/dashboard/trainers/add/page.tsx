// File: app/dashboard/trainers/add/page.tsx

import { AddTrainerForm } from "@/components/add-trainer-form"; // We'll create this next

export default function AddTrainerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Add New Trainer</h1>
        <p className="text-gray-400 mt-1">
          Enter the details for the new trainer. Only Owners can perform this action.
        </p>
      </div>
      <AddTrainerForm />
    </div>
  );
}