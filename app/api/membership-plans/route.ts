// app/api/membership-plans/route.ts
import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('membership_plans')
      .select('*')
      .order('duration_months', { ascending: true }); // Order by duration

    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}