"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

// Mock data for classes
const classes = [
  {
    id: 1,
    name: "Yoga Flow",
    trainer: "Maria Sanchez",
    time: "Mon 10:00 AM",
    capacity: 15,
    enrolled: 12,
  },
  {
    id: 2,
    name: "Advanced HIIT",
    trainer: "Alex Johnson",
    time: "Tue 6:00 PM",
    capacity: 20,
    enrolled: 20,
  },
  {
    id: 3,
    name: "Spin Cycle",
    trainer: "Samir Khan",
    time: "Wed 7:00 AM",
    capacity: 18,
    enrolled: 10,
  },
  {
    id: 4,
    name: "Boxing Fundamentals",
    trainer: "Alex Johnson",
    time: "Thu 7:00 PM",
    capacity: 15,
    enrolled: 14,
  },
]

export function ClassesTable() {
  // In a real app, you would fetch and manage this data
  const handleAddClass = () => {
    alert("Functionality to schedule a new class goes here.")
  }

  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white font-black uppercase tracking-wide">Class Schedule</CardTitle>
          <Button 
             onClick={handleAddClass}
             className="bg-primary text-black hover:bg-primary/90 font-bold uppercase"
             size="sm"
          >
             <Plus className="w-4 h-4 mr-2" />
             Schedule Class
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70 font-bold uppercase text-xs">Class Name</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Trainer</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Time</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Enrollment</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((classItem) => {
              const enrollmentPercentage = (classItem.enrolled / classItem.capacity) * 100
              const isFull = enrollmentPercentage === 100
              
              return (
                <TableRow key={classItem.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold text-white">{classItem.name}</TableCell>
                  <TableCell className="text-white/70">{classItem.trainer}</TableCell>
                  <TableCell className="text-white/70">{classItem.time}</TableCell>
                  <TableCell className="text-white/70">
                    {classItem.enrolled} / {classItem.capacity}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={isFull ? "destructive" : "default"}
                      className={
                        isFull
                          ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 rounded-none font-bold"
                          : "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 rounded-none font-bold"
                      }
                    >
                      {isFull ? "FULL" : "OPEN"}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}