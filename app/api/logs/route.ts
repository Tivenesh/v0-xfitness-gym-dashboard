// File: app/api/logs/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr'; // Using the correct import
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  // Using the correct, reliable client initialization
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // --- Handle Search and Filter ---
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('search');
  const statusQuery = searchParams.get('status');
  
  let query = supabaseServer
    .from('access_logs')
    .select('*')
    .order('entry_time', { ascending: false });

  if (searchQuery) {
    query = query.ilike('member_name', `%${searchQuery}%`);
  }
  if (statusQuery && statusQuery !== 'All') {
    query = query.eq('access_status', statusQuery);
  }
  // --- END OF LOGIC ---

  const { data: logs, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(logs);
}