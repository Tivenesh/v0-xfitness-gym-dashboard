"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchSubscriptions() {
      setLoading(true);
      try {
        const response = await fetch('/api/subscriptions');
        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions');
        }
        const data = await response.json();
        setSubscriptions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">Loading subscriptions...</TableCell>
              </TableRow>
            )}
            {!loading && filteredSubscriptions.map((sub) => (
              <TableRow key={sub.id} className="border-border">
                <TableCell className="font-medium text-foreground">{sub.full_name}</TableCell>
                <TableCell className="text-muted-foreground">{sub.plan}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      sub.status === "Active"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }
                  >
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{sub.join_date}</TableCell>
                <TableCell className="text-muted-foreground">{sub.end_date}</TableCell>
                <TableCell className="text-right">
                    <Link href={`/dashboard/members/${sub.id}`}>
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
  );
}