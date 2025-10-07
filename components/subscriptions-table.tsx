"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const subscriptions = [
  {
    id: 1,
    member: "Ethan Harper",
    plan: "Premium",
    status: "Active",
    startDate: "2023-01-15",
    endDate: "2024-01-15",
    amount: "$49",
  },
  {
    id: 2,
    member: "Olivia Bennett",
    plan: "Standard",
    status: "Active",
    startDate: "2023-02-20",
    endDate: "2024-02-20",
    amount: "$39",
  },
  {
    id: 3,
    member: "Noah Carter",
    plan: "Basic",
    status: "Expired",
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    amount: "$29",
  },
  {
    id: 4,
    member: "Ava Reynolds",
    plan: "Premium",
    status: "Active",
    startDate: "2023-04-10",
    endDate: "2024-04-10",
    amount: "$49",
  },
  {
    id: 5,
    member: "Liam Foster",
    plan: "Elite",
    status: "Active",
    startDate: "2023-05-25",
    endDate: "2024-05-25",
    amount: "$79",
  },
  {
    id: 6,
    member: "Emma Wilson",
    plan: "Basic",
    status: "Cancelled",
    startDate: "2023-06-12",
    endDate: "2024-06-12",
    amount: "$29",
  },
]

export function SubscriptionsTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.member.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Active Subscriptions</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-border text-foreground"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Member</TableHead>
              <TableHead className="text-muted-foreground">Plan</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Start Date</TableHead>
              <TableHead className="text-muted-foreground">End Date</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id} className="border-border">
                <TableCell className="font-medium text-foreground">{subscription.member}</TableCell>
                <TableCell className="text-muted-foreground">{subscription.plan}</TableCell>
                <TableCell>
                  <Badge
                    variant={subscription.status === "Active" ? "default" : "secondary"}
                    className={
                      subscription.status === "Active"
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        : subscription.status === "Expired"
                          ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                          : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    }
                  >
                    {subscription.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{subscription.startDate}</TableCell>
                <TableCell className="text-muted-foreground">{subscription.endDate}</TableCell>
                <TableCell className="text-muted-foreground">{subscription.amount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    View Details
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
