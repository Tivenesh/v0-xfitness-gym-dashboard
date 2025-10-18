// File: app/api/membership-plans/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * GET: Fetches all membership plans.
 * No specific role required, assuming plans are public info.
 */
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('membership_plans')
      .select('*')
      .order('duration_months', { ascending: true }); // Order by duration

    if (error) {
      console.error("API GET /membership-plans Error:", error);
      throw new Error(error.message);
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Creates a new membership plan.
 * Requires Owner role.
 */
export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  // --- Security Check: Owner Role ---
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userRole = session.user?.app_metadata?.role;
  if (userRole !== 'Owner') {
    return NextResponse.json({ error: 'Forbidden: Only Owners can create plans.' }, { status: 403 });
  }
  // --- End Security Check ---

  try {
    const body = await request.json();
    const { name, price, monthly_equivalent, duration_months, features, is_popular, bonus_offer } = body;

    // --- Validation ---
    if (!name || price === undefined || duration_months === undefined) {
      return NextResponse.json({ error: 'Name, price, and duration are required fields.' }, { status: 400 });
    }
    if (!Array.isArray(features)) {
        return NextResponse.json({ error: 'Features must be an array of strings.' }, { status: 400 });
    }
    // --- End Validation ---

    // --- Database Insert ---
    const { data, error } = await supabaseServer
      .from('membership_plans')
      .insert([
        {
          name,
          price: parseFloat(price),
          monthly_equivalent: monthly_equivalent ? parseFloat(monthly_equivalent) : null,
          duration_months: parseInt(duration_months, 10),
          features: features, // Already validated as array
          is_popular: !!is_popular, // Ensure boolean
          bonus_offer: bonus_offer || null, // Ensure null if empty/falsy
        },
      ])
      .select()
      .single(); // Return the newly created object

    if (error) {
      // Handle potential duplicate name error
      if (error.code === '23505') { // PostgreSQL unique violation code
          return NextResponse.json({ error: `A plan with the name "${name}" already exists.` }, { status: 409 }); // 409 Conflict
      }
      console.error("API POST /membership-plans DB Error:", error);
      throw new Error(error.message);
    }
    // --- End Database Insert ---

    return NextResponse.json(data, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error("API POST /membership-plans General Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to create plan' }, { status: 500 });
  }
}