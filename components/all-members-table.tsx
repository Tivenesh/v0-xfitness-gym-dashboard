// File: components/all-members-table.tsx

"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react"; // Import the Download icon
import { cn } from "@/lib/utils";
import Papa from "papaparse"; // Import the CSV library

export function AllMembersTable() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Expired">("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (filterStatus !== 'All') params.append('status', filterStatus);
        
        const response = await fetch(`/api/users?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    }

    const timerId = setTimeout(() => { fetchMembers(); }, 300);
    return () => clearTimeout(timerId);
  }, [searchQuery, filterStatus]);

  // Function to handle exporting the current member list to a CSV file
  const handleExport = () => {
    if (members.length === 0) {
      alert("No data to export.");
      return;
    }

    const dataToExport = members.map(member => ({
      "Full Name": member.full_name,
      "Email": member.email,
      "Phone Number": member.phone_number,
      "Plan": member.plan,
      "Status": member.status,
      "Join Date": member.join_date,
      "End Date": member.end_date,
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `xfitness-members-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-black border-2 border-white/10 rounded-none">
      <CardHeader>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <CardTitle className="text-white font-black uppercase tracking-wide">All Members</CardTitle>
          <div className="flex items-center gap-4">
            {/* --- THIS IS THE NEW EXPORT BUTTON --- */}
            <Button onClick={handleExport} variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10 hover:text-white font-bold">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            {/* ---------------------------------- */}
            <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-md">
              <Button variant="ghost" size="sm" onClick={() => setFilterStatus("All")} className={cn("px-4", filterStatus === "All" ? "bg-primary text-black hover:bg-primary/90" : "text-white/70 hover:text-white")}>All</Button>
              <Button variant="ghost" size="sm" onClick={() => setFilterStatus("Active")} className={cn("px-4", filterStatus === "Active" ? "bg-primary text-black hover:bg-primary/90" : "text-white/70 hover:text-white")}>Active</Button>
              <Button variant="ghost" size="sm" onClick={() => setFilterStatus("Expired")} className={cn("px-4", filterStatus === "Expired" ? "bg-primary text-black hover:bg-primary/90" : "text-white/70 hover:text-white")}>Expired</Button>
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
              <TableHead className="text-white/70 font-bold uppercase text-xs">Member</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Plan</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Status</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Join Date</TableHead>
              <TableHead className="text-right text-white/70 font-bold uppercase text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-white/50">Loading members...</TableCell></TableRow>
            ) : members.length > 0 ? (
              members.map((member) => (
                <TableRow key={member.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold text-white">{member.full_name}</TableCell>
                  <TableCell className="text-white/70">{member.plan}</TableCell>
                  <TableCell>
                    <Badge className={member.status === "Active" ? "bg-primary/20 text-primary border border-primary/50 rounded-none font-bold" : "bg-red-500/20 text-red-500 border border-red-500/50 rounded-none font-bold"}>{member.status}</Badge>
                  </TableCell>
                  <TableCell className="text-white/70">{member.join_date}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/members/${member.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-white/10 hover:text-yellow-300">View / Edit</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-white/50">No members found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}