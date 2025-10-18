// File: components/payments-table.tsx

"use client";

import { useState, useEffect } from "react";
import Link from 'next/link'; // Make sure Link is imported
import { Plus, Download, Edit } from "lucide-react"; // Import Plus, Download, and Edit icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase-browser"; // Import Supabase client

export function PaymentsTable() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // State for user role
  const supabase = createClient(); // Initialize Supabase client

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/payments');
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();

    // Fetch the user role when component mounts
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserRole(session?.user?.app_metadata?.role || null);
    };
    fetchUserRole();

    // Listen for auth changes to update role if needed (optional but good practice)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUserRole(session?.user?.app_metadata?.role || null);
    });

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };

  }, [supabase]); // Add supabase to dependency array

  // --- OPTIMISTIC UI UPDATE FUNCTION ---
  const handleUpdateStatus = async (paymentId: number, newStatus: 'Success' | 'Failed') => {
    const originalPayments = [...payments]; // Keep a backup

    // Update UI optimistically
    setPayments(currentPayments =>
      currentPayments.map(p =>
        p.id === paymentId ? { ...p, status: newStatus } : p
      )
    );
    setUpdatingId(paymentId);
    setError(null);

    try {
      // Make API call in background
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update status`);
      }
    } catch (err: any) {
      // Revert UI on failure
      setError(err.message);
      setPayments(originalPayments);
      alert(`Error: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = () => {
    if (payments.length === 0) {
      alert("No payment data to export.");
      return;
    }

    const dataToExport = payments.map(p => ({
      "Transaction ID": p.id,
      "Member Name": p.members?.full_name ?? 'N/A', // Handle potential null member
      "Plan": p.plan_name,
      "Amount": p.amount,
      "Transaction Date": p.transaction_date,
      "Payment Method": p.payment_method,
      "Status": p.status,
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `xfitness-payments-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-black border-2 border-white/10">
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <CardTitle className="text-white font-black uppercase tracking-wide">All Transactions</CardTitle>
          
          <div className="flex items-center gap-4">
            {/* Add Manual Payment Button */}
            <Link href="/dashboard/payments/add">
              <Button size="sm" className="bg-primary text-black hover:bg-primary/90 font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Add Manual Payment
              </Button>
            </Link>

            {/* Export CSV Button */}
            <Button onClick={handleExport} variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10 hover:text-white font-bold">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">Error: {error}</p>}
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70 font-bold uppercase text-xs">Member Name</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Plan</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Amount</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Date</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Method</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Status</TableHead>
              <TableHead className="text-right text-white/70 font-bold uppercase text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center text-gray-400">Loading...</TableCell></TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id} className="border-white/10">
                  <TableCell className="font-bold text-white">{payment.members?.full_name ?? 'N/A'}</TableCell>
                  <TableCell className="text-white/70">{payment.plan_name}</TableCell>
                  <TableCell className="text-white/70">RM{payment.amount}</TableCell>
                  <TableCell className="text-white/70">{new Date(payment.transaction_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-white/70">{payment.payment_method}</TableCell>
                  <TableCell>
                    <Badge className={`font-bold rounded-sm border-none ` + (payment.status === 'Success' ? 'bg-green-500/20 text-green-400' : payment.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400')}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end items-center"> {/* Adjusted gap and items-center */}
                      {/* Logic for Approve/Reject buttons */}
                      {payment.status === 'Pending' && (
                        <>
                          <Button onClick={() => handleUpdateStatus(payment.id, 'Success')} size="sm" className="bg-green-600 hover:bg-green-700 text-white font-bold h-8 px-3" disabled={updatingId === payment.id}> {/* Adjusted size */}
                            {updatingId === payment.id ? '...' : 'Approve'}
                          </Button>
                          <Button onClick={() => handleUpdateStatus(payment.id, 'Failed')} variant="destructive" size="sm" className="font-bold h-8 px-3" disabled={updatingId === payment.id}> {/* Adjusted size */}
                            {updatingId === payment.id ? '...' : 'Reject'}
                          </Button>
                        </>
                      )}
                      
                      {/* NEW: Edit Button for Owners */}
                      {userRole === 'Owner' && (
                         <Link href={`/dashboard/payments/edit/${payment.id}`} passHref>
                            <Button variant="ghost" size="icon" className="text-white/70 hover:text-primary hover:bg-white/10 h-8 w-8"> {/* Adjusted size */}
                                <Edit className="h-4 w-4" />
                            </Button>
                         </Link>
                      )}
                    </div>
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