// File: app/dashboard/trainers/edit/[id]/page.tsx

import { EditTrainerForm } from "@/components/edit-trainer-form"; // We'll create this next

export default function EditTrainerPage({ params }: { params: { id: string } }) {
  const trainerId = params.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Edit Trainer</h1>
        <p className="text-gray-400 mt-1">
          Update the trainer's details or remove them from the system.
        </p>
      </div>
      {/* Pass the trainerId from the URL to the form component */}
      <EditTrainerForm trainerId={trainerId} />
    </div>
  );
}