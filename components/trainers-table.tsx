// File: components/trainers-table.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Import Link for navigation
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit } from "lucide-react"; // Import Edit icon

// Define an interface for the trainer data structure
interface Trainer {
  id: number;
  name: string;
  specialization: string | null;
  status: string;
  email: string | null;
  avatar_url: string | null; // Changed from avatar to avatar_url to match DB
}

export function TrainersTable() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trainers data from the API
  useEffect(() => {
    async function fetchTrainers() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/trainers'); // Fetch from your GET endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch trainers');
        }
        const data = await response.json();
        setTrainers(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching trainers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrainers();
  }, []);

  // Placeholder function for Add Trainer button (will navigate later)
  const handleAddTrainerClick = () => {
    // We will replace this with navigation soon
    alert("Navigate to Add Trainer page (to be implemented).");
  };

  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white font-black uppercase tracking-wide">All Trainers</CardTitle>
          {/* Link Add Trainer button to a future page */}
          <Link href="/dashboard/trainers/add">
            <Button
              className="bg-primary text-black hover:bg-primary/90 font-bold uppercase"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Trainer
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error && <p className="text-red-500 p-4">Error loading trainers: {error}</p>}
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70 font-bold uppercase text-xs">Trainer</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Specialization</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Email</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Status</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-white/50 py-4">Loading trainers...</TableCell>
              </TableRow>
            ) : trainers.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={5} className="text-center text-white/50 py-4">No trainers found.</TableCell>
               </TableRow>
            ) : (
              trainers.map((trainer) => (
                <TableRow key={trainer.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold text-white flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-primary/30">
                      {/* Use avatar_url, provide a fallback if null */}
                      <AvatarImage src={trainer.avatar_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${trainer.name}`} alt={trainer.name} />
                      <AvatarFallback className="bg-primary text-black font-bold text-sm">{trainer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {trainer.name}
                  </TableCell>
                  <TableCell className="text-white/70">{trainer.specialization ?? 'N/A'}</TableCell>
                  <TableCell className="text-white/70">{trainer.email ?? 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={trainer.status === "Active" ? "default" : "secondary"}
                      className={
                        trainer.status === "Active"
                          ? "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 rounded-none font-bold"
                          : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500/30 rounded-none font-bold" // Assuming non-Active is 'On Leave' or similar
                      }
                    >
                      {trainer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Link Edit button to a future page */}
                    <Link href={`/dashboard/trainers/edit/${trainer.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        <Edit className="h-4 w-4 mr-1" /> {/* Added Edit icon */}
                        Edit
                      </Button>
                    </Link>
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