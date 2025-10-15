// app/dashboard/notifications/page.tsx
import { NotificationForm } from "@/components/notification-form";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Send Notification</h1>
        <p className="text-gray-400 mt-1">
          Compose and send a message to your members.
        </p>
      </div>
      <NotificationForm />
    </div>
  );
}