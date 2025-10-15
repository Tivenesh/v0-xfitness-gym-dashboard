// app/api/payments/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This query fetches all payments and joins with the members table
    // to get the full_name associated with each payment.
    const { data: payments, error } = await supabaseServer
      .from('payments')
      .select(`
        id,
        plan_name,
        amount,
        transaction_date,
        payment_method,
        status,
        members (
          full_name
        )
      `)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error("Supabase API Error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json(payments);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}