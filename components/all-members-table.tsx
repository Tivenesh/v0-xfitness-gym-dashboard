"use client"

import { useState, useEffect } from "react"
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"; // 1. IMPORTED BUTTON

export function AllMembersTable() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">All Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70 font-bold uppercase text-xs">Member</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Plan</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Status</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Join Date</TableHead>
              {/* 2. ADDED ACTIONS COLUMN HEADER */}
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
            {!loading && members.map((member) => (
              <TableRow key={member.id} className="border-white/10 hover:bg-white/5 transition-colors">
                {/* 3. REMOVED LINK FROM NAME */}
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
                {/* 4. ADDED A NEW CELL WITH THE BUTTON */}
                <TableCell className="text-right">
                    <Link href={`/dashboard/members/${member.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-white/10 hover:text-yellow-300">
                            View / Edit
                        </Button>
                    </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}