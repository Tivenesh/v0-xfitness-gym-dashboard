// app/api/reports/revenue/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Call the database function we created earlier
    const { data: revenueData, error } = await supabaseServer.rpc('get_monthly_revenue');

    if (error) {
      console.error("Supabase RPC Error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json(revenueData);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}