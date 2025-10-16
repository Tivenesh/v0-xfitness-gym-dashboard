// File: app/api/users/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Handle both Search and Filter Queries
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('search');
  const statusQuery = searchParams.get('status');
  
  let query = supabaseServer
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  // Add search filter if it exists
  if (searchQuery) {
    query = query.ilike('full_name', `%${searchQuery}%`);
  }
  
  // Add status filter if it exists and is not 'All'
  if (statusQuery && statusQuery !== 'All') {
    query = query.eq('status', statusQuery);
  }
  
  const { data: members, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(members);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone_number, plan, end_date } = body;

    const { data, error } = await supabaseServer
      .from('members')
      .insert([
        {
          full_name,
          email,
          phone_number,
          plan,
          end_date,
          status: 'Active',
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data ? data[0] : null);

  } catch (error: any) {
    console.error("API POST Route Error:", error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}