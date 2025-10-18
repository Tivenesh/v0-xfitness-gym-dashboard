// File: app/dashboard/classes/add/page.tsx

import { AddClassForm } from "@/components/add-class-form";

export default function AddClassPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Schedule New Class</h1>
        <p className="text-gray-400 mt-1">
          Fill in the details to add a new class to the schedule.
        </p>
      </div>
      <AddClassForm />
    </div>
  );
}