// components/notification-history-table.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function NotificationHistoryTable() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const response = await fetch('/api/notifications/history');
        if (!response.ok) {
          throw new Error('Failed to fetch notification history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">Sent Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70 font-bold uppercase text-xs">Title</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Message</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Date Sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-400">Loading history...</TableCell>
              </TableRow>
            ) : (
              history.map((item) => (
                <TableRow key={item.id} className="border-white/10">
                  <TableCell className="font-bold text-white">{item.title}</TableCell>
                  <TableCell className="text-white/70 max-w-md truncate">{item.body}</TableCell>
                  <TableCell className="text-white/70">{new Date(item.sent_at).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}