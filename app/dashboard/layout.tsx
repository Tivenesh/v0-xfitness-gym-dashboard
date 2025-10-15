// File: app/dashboard/layout.tsx

"use client"; // This line is important

import type React from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { useIdleTimeout } from "@/lib/hooks/useIdleTimeout"; // Import the hook we just created

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Set the timeout. 15 * 60 * 1000 = 15 minutes.
  // For testing, you can change this to 5000 (which is 5 seconds).
  const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

  // Activate the idle timer
  useIdleTimeout(IDLE_TIMEOUT_MS);

  return (
    <div className="flex min-h-screen bg-black">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}