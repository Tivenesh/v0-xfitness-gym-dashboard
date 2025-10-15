// app/api/users/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

// GET function remains the same
export async function GET() {
  const { data: members, error } = await supabaseServer
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(members);
}

// POST function with the fix
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone_number, plan, end_date } = body;

    // THIS IS THE CORRECTED QUERY
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
      .select(); // REMOVED .single()

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return the first item from the array
    return NextResponse.json(data ? data[0] : null);

  } catch (error: any) {
    console.error("API POST Route Error:", error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}