// app/api/logs/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data: logs, error } = await supabaseServer
      .from('access_logs')
      .select('*')
      .order('entry_time', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(logs);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}