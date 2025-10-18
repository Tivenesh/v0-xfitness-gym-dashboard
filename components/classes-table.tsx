// File: components/classes-table.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react"; // Import Edit icon

// Interface for the class data structure expected from the API
interface ClassItem {
  id: number;
  name: string;
  trainer_name: string | null; // From the join in the API
  schedule_time: string;
  capacity: number;
  created_at: string;
  // Note: 'enrolled' count needs to be calculated separately or added to API if needed
}

export function ClassesTable() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch classes data from the API
  useEffect(() => {
    async function fetchClasses() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/classes'); // Fetch from your GET endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        setClasses(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);


  // --- NOTE: Enrollment calculation ---
  // The mock data had 'enrolled'. The current API doesn't provide this.
  // To show enrollment, you'd need to:
  // 1. Create a table like 'class_enrollments' (linking member_id and class_id).
  // 2. Update the GET /api/classes endpoint to count enrollments for each class.
  // For now, we'll just show capacity and a placeholder status.

  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white font-black uppercase tracking-wide">Class Schedule</CardTitle>
          {/* Link Schedule Class button */}
          <Link href="/dashboard/classes/add">
            <Button
              className="bg-primary text-black hover:bg-primary/90 font-bold uppercase"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Class
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error && <p className="text-red-500 p-4">Error loading classes: {error}</p>}
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70 font-bold uppercase text-xs">Class Name</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Trainer</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Time</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Capacity</TableHead>
              {/* <TableHead className="text-white/70 font-bold uppercase text-xs">Enrollment</TableHead> */}
              {/* <TableHead className="text-white/70 font-bold uppercase text-xs text-right">Status</TableHead> */}
              <TableHead className="text-white/70 font-bold uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-white/50 py-4">Loading classes...</TableCell>
              </TableRow>
            ) : classes.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={5} className="text-center text-white/50 py-4">No classes scheduled.</TableCell>
               </TableRow>
            ) : (
              classes.map((classItem) => {
                // Placeholder for enrollment logic
                // const enrollmentPercentage = 0; // Replace with actual data later
                // const isFull = false; // Replace with actual data later

                return (
                  <TableRow key={classItem.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell className="font-bold text-white">{classItem.name}</TableCell>
                    <TableCell className="text-white/70">{classItem.trainer_name ?? 'N/A'}</TableCell>
                    <TableCell className="text-white/70">{classItem.schedule_time}</TableCell>
                    <TableCell className="text-white/70">{classItem.capacity}</TableCell>
                    {/* <TableCell className="text-white/70">
                      0 / {classItem.capacity} // Placeholder enrollment
                    </TableCell> */}
                    {/* <TableCell className="text-right">
                      <Badge
                        variant={isFull ? "destructive" : "default"}
                        className={isFull ? "bg-red-500/20..." : "bg-primary/20..."} // Simplified classes
                      >
                        {isFull ? "FULL" : "OPEN"} // Placeholder status
                      </Badge>
                    </TableCell> */}
                     <TableCell className="text-right">
                        {/* Link Edit button */}
                        <Link href={`/dashboard/classes/edit/${classItem.id}`}>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}