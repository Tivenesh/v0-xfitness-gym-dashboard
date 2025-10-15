// File: app/api/users/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr'; // Correct import
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  // Correct client initialization
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Handle Search Query
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('search');
  
  // Use the admin client for the actual data fetching
  let query = supabaseServer
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.ilike('full_name', `%${searchQuery}%`);
  }
  
  const { data: members, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(members);
}

// Your POST function can remain the same, but it's good practice to add auth checks to it as well.
// For now, we will leave it as is to fix the immediate problem.
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