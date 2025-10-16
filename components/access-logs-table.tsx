// File: components/access-logs-table.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react"; // Import the Download icon
import { cn } from "@/lib/utils";
import Papa from "papaparse"; // Import the CSV library

export function AccessLogsTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Granted" | "Denied">("All");

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (filterStatus !== 'All') params.append('status', filterStatus);

        const response = await fetch(`/api/logs?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch access logs');
        
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    
    const timerId = setTimeout(() => { fetchLogs(); }, 300);
    return () => clearTimeout(timerId);
  }, [searchQuery, filterStatus]);

  // --- NEW: Function to handle exporting log data to CSV ---
  const handleExport = () => {
    if (logs.length === 0) {
      alert("No log data to export.");
      return;
    }

    const dataToExport = logs.map(log => ({
      "Log ID": log.id,
      "Member Name": log.member_name,
      "Entry Time": new Date(log.entry_time).toLocaleString(),
      "Access Status": log.access_status,
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `xfitness-access-logs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <CardTitle className="text-white font-black uppercase tracking-wide">Entry History</CardTitle>
          <div className="flex items-center gap-4">
            {/* --- NEW: Export Button Added --- */}
            <Button onClick={handleExport} variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10 hover:text-white font-bold">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-md">
              <Button variant="ghost" size="sm" onClick={() => setFilterStatus("All")} className={cn("px-4", filterStatus === "All" ? "bg-primary text-black hover:bg-primary/90" : "text-white/70 hover:text-white")}>All</Button>
              <Button variant="ghost" size="sm" onClick={() => setFilterStatus("Granted")} className={cn("px-4", filterStatus === "Granted" ? "bg-green-500 text-black hover:bg-green-600" : "text-white/70 hover:text-white")}>Granted</Button>
              <Button variant="ghost" size="sm" onClick={() => setFilterStatus("Denied")} className={cn("px-4", filterStatus === "Denied" ? "bg-red-500 text-white hover:bg-red-600" : "text-white/70 hover:text-white")}>Denied</Button>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input 
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border-white/20 text-white pl-9"
              />
            </div>
          </div>
        </div>
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
              <TableRow><TableCell colSpan={3} className="text-center text-gray-400">Loading logs...</TableCell></TableRow>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id} className="border-white/10">
                  <TableCell className="font-bold text-white">{log.member_name ?? 'N/A'}</TableCell>
                  <TableCell className="text-white/70">{new Date(log.entry_time).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={`font-bold rounded-sm border-none ` + (log.access_status === 'Granted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>{log.access_status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={3} className="text-center text-white/50">No logs found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}