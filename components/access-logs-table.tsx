"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function AccessLogsTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const response = await fetch('/api/logs');
        if (!response.ok) {
          throw new Error('Failed to fetch access logs');
        }
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">Entry History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70 font-bold uppercase text-xs">Member Name</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Time of Entry</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Access Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-400">Loading logs...</TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="border-white/10">
                  <TableCell className="font-bold text-white">{log.member_name ?? 'N/A'}</TableCell>
                  <TableCell className="text-white/70">{new Date(log.entry_time).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={
                      `font-bold rounded-sm border-none ` +
                      (log.access_status === 'Granted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')
                    }>
                      {log.access_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}