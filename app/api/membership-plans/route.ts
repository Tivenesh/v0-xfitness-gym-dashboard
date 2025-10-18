// File: app/api/membership-plans/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logAdminActivity } from '@/lib/activityLogger'; // <-- Import the logger

/**
 * GET: Fetches all membership plans.
 * Requires logged-in user.
 */
export async function GET(request: Request) { // Added request parameter
    // Auth Check (Any logged-in user can view)
    const cookieStore = cookies();
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
            },
        }
    );
    const { data: { session } } = await supabaseAuth.auth.getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabaseServer
        .from('membership_plans')
        .select('*')
        .order('duration_months', { ascending: true }); // Order by duration

        if (error) {
        console.error("API GET /membership-plans Error:", error);
        throw new Error(error.message);
        }
        return NextResponse.json(data ?? []); // Return empty array if null
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
  if (!session?.user) { // Check for user object
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Fetch role securely using RPC recommended
  const { data: roleData, error: rpcError } = await supabase.rpc('get_my_role');
  if (rpcError) {
      console.error("API POST /membership-plans Role Check Error:", rpcError);
      return NextResponse.json({ error: 'Could not verify user role' }, { status: 500 });
  }
  const userRole = roleData;
  // const userRole = session.user?.app_metadata?.role; // Less secure way
  if (userRole !== 'Owner') {
    return NextResponse.json({ error: 'Forbidden: Only Owners can create plans.' }, { status: 403 });
  }
  // --- End Security Check ---

  let body;
  try {
    body = await request.json();
    const { name, price, monthly_equivalent, duration_months, features, is_popular, bonus_offer } = body;

    // --- Validation ---
    if (!name || price === undefined || duration_months === undefined) {
      return NextResponse.json({ error: 'Name, price, and duration are required fields.' }, { status: 400 });
    }
     if (typeof price !== 'number' || isNaN(price) || price < 0) {
        return NextResponse.json({ error: 'Price must be a valid non-negative number.' }, { status: 400 });
    }
     if (typeof duration_months !== 'number' || !Number.isInteger(duration_months) || duration_months <= 0) {
        return NextResponse.json({ error: 'Duration must be a valid positive integer.' }, { status: 400 });
    }
    if (monthly_equivalent !== undefined && monthly_equivalent !== null && (typeof monthly_equivalent !== 'number' || isNaN(monthly_equivalent) || monthly_equivalent < 0)) {
        return NextResponse.json({ error: 'Monthly Equivalent must be a valid non-negative number or null.' }, { status: 400 });
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
          price: parseFloat(price.toFixed(2)), // Ensure 2 decimal places
          monthly_equivalent: monthly_equivalent ? parseFloat(monthly_equivalent.toFixed(2)) : null,
          duration_months: parseInt(String(duration_months), 10),
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

    // --- Log Activity ---
    await logAdminActivity(
        session.user.id,
        session.user.email,
        `Created membership plan: ${data.name}`,
        'plan',
        data.id
    );
    // --- End Log Activity ---

    return NextResponse.json(data, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error("API POST /membership-plans General Error:", error);
     // Handle case where request body is invalid JSON
     if (error instanceof SyntaxError) {
       return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
     }
    return NextResponse.json({ error: error.message || 'Failed to create plan' }, { status: 500 });
  }
}