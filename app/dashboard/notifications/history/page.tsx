// app/dashboard/notifications/history/page.tsx

import { NotificationHistoryTable } from "@/components/notification-history-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";

export default function NotificationHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white"></h1>
          <p className="text-gray-400 mt-1">
            A log of all past announcements sent to members.
          </p>
        </div>
        <Link href="/dashboard/notifications">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Compose New
            </Button>
        </Link>
      </div>
      <NotificationHistoryTable />
    </div>
  );
}