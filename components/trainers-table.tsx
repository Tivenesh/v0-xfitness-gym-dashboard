"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"

// Mock data for trainers
const trainers = [
  {
    id: 1,
    name: "Alex Johnson",
    specialization: "Strength & Conditioning",
    status: "Active",
    email: "alex@xfitness.com",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
  },
  {
    id: 2,
    name: "Maria Sanchez",
    specialization: "Yoga & Flexibility",
    status: "Active",
    email: "maria@xfitness.com",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maria",
  },
  {
    id: 3,
    name: "Chen Wei",
    specialization: "HIIT & Cardio",
    status: "On Leave",
    email: "chen@xfitness.com",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Chen",
  },
  {
    id: 4,
    name: "Samir Khan",
    specialization: "Weight Loss",
    status: "Active",
    email: "samir@xfitness.com",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Samir",
  },
]

export function TrainersTable() {
  // In a real app, you would fetch and mutate this data
  const handleAddTrainer = () => {
    alert("Functionality to add a new trainer (Owner only) goes here.")
  }

  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white font-black uppercase tracking-wide">All Trainers</CardTitle>
          <Button 
             onClick={handleAddTrainer}
             className="bg-primary text-black hover:bg-primary/90 font-bold uppercase"
             size="sm"
          >
             <Plus className="w-4 h-4 mr-2" />
             Add Trainer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
            {trainers.map((trainer) => (
              <TableRow key={trainer.id} className="border-white/10 hover:bg-white/5 transition-colors">
                <TableCell className="font-bold text-white flex items-center gap-3">
                  <Avatar className="h-8 w-8 border-2 border-primary/30">
                    <AvatarImage src={trainer.avatar} alt={trainer.name} />
                    <AvatarFallback className="bg-primary text-black font-bold text-sm">{trainer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {trainer.name}
                </TableCell>
                <TableCell className="text-white/70">{trainer.specialization}</TableCell>
                <TableCell className="text-white/70">{trainer.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={trainer.status === "Active" ? "default" : "secondary"}
                    className={
                      trainer.status === "Active"
                        ? "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 rounded-none font-bold"
                        : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500/30 rounded-none font-bold"
                    }
                  >
                    {trainer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}