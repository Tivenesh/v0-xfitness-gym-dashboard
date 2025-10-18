// File: app/api/membership-plans/[id]/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * PUT: Updates an existing membership plan by ID.
 * Requires Owner role.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  // --- Security Check: Owner Role ---
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userRole = session.user?.app_metadata?.role;
  if (userRole !== 'Owner') return NextResponse.json({ error: 'Forbidden: Only Owners can update plans.' }, { status: 403 });
  // --- End Security Check ---

  // Validate ID format early
  if (!id || isNaN(parseInt(id, 10))) {
     return NextResponse.json({ error: 'Invalid Plan ID format' }, { status: 400 });
  }

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

    // --- Database Update ---
    const { data, error } = await supabaseServer
      .from('membership_plans')
      .update({
         name,
         price: parseFloat(price),
         monthly_equivalent: monthly_equivalent ? parseFloat(monthly_equivalent) : null,
         duration_months: parseInt(duration_months, 10),
         features: features, // Already validated as array
         is_popular: !!is_popular,
         bonus_offer: bonus_offer || null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
        // Handle potential duplicate name error on update
        if (error.code === '23505') {
            return NextResponse.json({ error: `A plan with the name "${name}" already exists.` }, { status: 409 }); // 409 Conflict
        }
        console.error(`API PUT /membership-plans/${id} DB Error:`, error);
        throw new Error(error.message);
    }
     if (!data) { // Handle case where ID doesn't exist
         return NextResponse.json({ error: `Plan with ID ${id} not found.` }, { status: 404 });
     }
     // --- End Database Update ---

    return NextResponse.json(data);

  } catch (error: any) {
    console.error(`API PUT /membership-plans/${id} General Error:`, error);
    return NextResponse.json({ error: error.message || 'Failed to update plan' }, { status: 500 });
  }
}

/**
 * DELETE: Deletes an existing membership plan by ID.
 * Requires Owner role.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  // --- Security Check: Owner Role ---
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userRole = session.user?.app_metadata?.role;
  if (userRole !== 'Owner') return NextResponse.json({ error: 'Forbidden: Only Owners can delete plans.' }, { status: 403 });
  // --- End Security Check ---

  // Validate ID format early
  if (!id || isNaN(parseInt(id, 10))) {
     return NextResponse.json({ error: 'Invalid Plan ID format' }, { status: 400 });
  }

  try {
    // --- Database Delete ---
    const { error, count } = await supabaseServer
      .from('membership_plans')
      .delete({ count: 'exact' }) // Request count of deleted rows
      .eq('id', id);

    if (error) {
      console.error(`API DELETE /membership-plans/${id} DB Error:`, error);
      throw new Error(error.message);
    }
    // --- End Database Delete ---

    // Check if a row was actually deleted
    if (count === 0) {
        return NextResponse.json({ error: `Plan with ID ${id} not found.` }, { status: 404 });
    }

    return NextResponse.json({ message: `Plan ${id} deleted successfully` }, { status: 200 }); // 200 OK

  } catch (error: any) {
    console.error(`API DELETE /membership-plans/${id} General Error:`, error);
    return NextResponse.json({ error: error.message || 'Failed to delete plan' }, { status: 500 });
  }
}