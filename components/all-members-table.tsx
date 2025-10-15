// File: components/all-members-table.tsx

"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // We need this for conditional styling

export function AllMembersTable() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // --- NEW: State to hold the current filter ---
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Expired">("All");

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  // --- NEW: Memoized filtering logic ---
  // This recalculates the filtered list only when members or filterStatus changes
  const filteredMembers = useMemo(() => {
    if (filterStatus === "All") {
      return members;
    }
    // Note: Your data uses "Active" for active members. We'll assume anything else is "Expired".
    const targetStatus = filterStatus;
    return members.filter((member) => member.status === targetStatus);
  }, [members, filterStatus]);


  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white font-black uppercase tracking-wide">All Members</CardTitle>
          
          {/* --- NEW: Filter Buttons --- */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterStatus("All")}
              className={cn("font-bold", filterStatus === "All" ? "bg-primary text-black" : "text-white/70 hover:bg-white/10 hover:text-white")}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterStatus("Active")}
              className={cn("font-bold", filterStatus === "Active" ? "bg-primary text-black" : "text-white/70 hover:bg-white/10 hover:text-white")}
            >
              Active
            </Button>
             <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterStatus("Expired")}
              className={cn("font-bold", filterStatus === "Expired" ? "bg-primary text-black" : "text-white/70 hover:bg-white/10 hover:text-white")}
            >
              Expired
            </Button>
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
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-white/50">
                  Loading members...
                </TableCell>
              </TableRow>
            )}
            {/* --- UPDATED: Map over the new 'filteredMembers' array --- */}
            {!loading && filteredMembers.map((member) => (
              <TableRow key={member.id} className="border-white/10 hover:bg-white/5 transition-colors">
                <TableCell className="font-bold text-white">{member.full_name}</TableCell>
                <TableCell className="text-white/70">{member.plan}</TableCell>
                <TableCell>
                  <Badge
                    variant={member.status === "Active" ? "default" : "destructive"}
                    className={
                      member.status === "Active"
                        ? "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 rounded-none font-bold"
                        : "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 rounded-none font-bold"
                    }
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/70">{member.join_date}</TableCell>
                <TableCell className="text-right">
                    <Link href={`/dashboard/members/${member.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-white/10 hover:text-yellow-300">
                            View / Edit
                        </Button>
                    </Link>
                </TableCell>
              </TableRow>
            ))}
             {/* --- NEW: Show a message if no members match the filter --- */}
            {!loading && filteredMembers.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-white/50">
                        No members found for this filter.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}