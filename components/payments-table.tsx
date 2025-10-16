// File: components/payments-table.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react"; // Import the Download icon
import Papa from "papaparse"; // Import the CSV library

export function PaymentsTable() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    // We can keep this loading logic as it is
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
  }, []);

  const handleUpdateStatus = async (paymentId: number, newStatus: 'Success' | 'Failed') => {
    // This function remains the same
    setUpdatingId(paymentId);
    setError(null);
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || `Failed to update status`);
      }
      fetchPayments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // --- NEW: Function to handle exporting payments data to CSV ---
  const handleExport = () => {
    if (payments.length === 0) {
      alert("No payment data to export.");
      return;
    }

    const dataToExport = payments.map(p => ({
      "Transaction ID": p.id,
      "Member Name": p.members.full_name,
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
        {/* --- NEW: Header updated with Export Button --- */}
        <div className="flex justify-between items-center">
          <CardTitle className="text-white font-black uppercase tracking-wide">All Transactions</CardTitle>
          <Button onClick={handleExport} variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10 hover:text-white font-bold">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
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
                    {payment.status === 'Pending' && (
                      <div className="flex gap-2 justify-end">
                        <Button onClick={() => handleUpdateStatus(payment.id, 'Success')} size="sm" className="bg-green-600 hover:bg-green-700 text-white font-bold" disabled={updatingId === payment.id}>
                          {updatingId === payment.id ? '...' : 'Approve'}
                        </Button>
                        <Button onClick={() => handleUpdateStatus(payment.id, 'Failed')} variant="destructive" size="sm" className="font-bold" disabled={updatingId === payment.id}>
                          {updatingId === payment.id ? '...' : 'Reject'}
                        </Button>
                      </div>
                    )}
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