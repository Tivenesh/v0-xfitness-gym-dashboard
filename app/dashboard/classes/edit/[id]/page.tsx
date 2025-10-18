// File: app/dashboard/classes/edit/[id]/page.tsx

import { EditClassForm } from "@/components/edit-class-form";

export default function EditClassPage({ params }: { params: { id: string } }) {
  const classId = params.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Edit Class</h1>
        <p className="text-gray-400 mt-1">
          Update the class details or remove it from the schedule.
        </p>
      </div>
      <EditClassForm classId={classId} />
    </div>
  );
}