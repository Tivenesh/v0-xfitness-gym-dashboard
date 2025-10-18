// File: app/api/membership-plans/[id]/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
// Assuming logAdminActivity is in lib/activityLogger.ts or similar
import { logAdminActivity } from '@/lib/activityLogger';

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
    {
      cookies: { // Full cookie implementation needed
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  );

  // --- Security Check: Owner Role ---
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) { // Check for user object
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Fetch role securely using RPC
  const { data: roleData, error: rpcError } = await supabase.rpc('get_my_role');
  if (rpcError) {
      console.error(`API PUT /membership-plans/${id} Role Check Error:`, rpcError);
      return NextResponse.json({ error: 'Could not verify user role' }, { status: 500 });
  }
  const userRole = roleData;
  if (userRole !== 'Owner') {
      return NextResponse.json({ error: 'Forbidden: Only Owners can update plans.' }, { status: 403 });
  }
  // --- End Security Check ---

  // Validate ID format early
  if (!id || isNaN(parseInt(id, 10))) {
     return NextResponse.json({ error: 'Invalid Plan ID format' }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
    const { name, price, monthly_equivalent, duration_months, features, is_popular, bonus_offer } = body;

    // --- Validation ---
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
         return NextResponse.json({ error: 'Plan Name cannot be empty.' }, { status: 400 });
    }
    // Price validation (must be non-negative number if provided)
    if (price !== undefined && (typeof price !== 'number' || isNaN(price) || price < 0)) {
        return NextResponse.json({ error: 'Price must be a valid non-negative number.' }, { status: 400 });
    }
    // Duration validation (must be non-negative integer if provided)
    if (duration_months !== undefined && (typeof duration_months !== 'number' || !Number.isInteger(duration_months) || duration_months < 0)) { // <-- FIXED: Allow 0
        return NextResponse.json({ error: 'Duration must be a valid non-negative integer (0 or more).' }, { status: 400 }); // <-- Updated message
    }
    // Monthly Equivalent validation (must be non-negative number or null if provided)
    if (monthly_equivalent !== undefined && monthly_equivalent !== null && (typeof monthly_equivalent !== 'number' || isNaN(monthly_equivalent) || monthly_equivalent < 0)) {
        return NextResponse.json({ error: 'Monthly Equivalent must be a valid non-negative number or null.' }, { status: 400 });
    }
    // Features validation (must be an array if provided)
    if (features !== undefined && !Array.isArray(features)) {
        return NextResponse.json({ error: 'Features must be an array of strings.' }, { status: 400 });
    }
    // --- End Validation ---

    // --- Prepare Update Data ---
    // Only include fields that were actually present in the request body
    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (price !== undefined) dataToUpdate.price = parseFloat(price.toFixed(2));
    if (monthly_equivalent !== undefined) dataToUpdate.monthly_equivalent = monthly_equivalent ? parseFloat(monthly_equivalent.toFixed(2)) : null;
    if (duration_months !== undefined) dataToUpdate.duration_months = parseInt(String(duration_months), 10);
    if (features !== undefined) dataToUpdate.features = features;
    if (is_popular !== undefined) dataToUpdate.is_popular = !!is_popular;
    if (bonus_offer !== undefined) dataToUpdate.bonus_offer = bonus_offer || null;

     // Prevent empty update if no valid fields were provided
    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({ error: 'No valid fields provided for update.' }, { status: 400 });
    }

    // --- Database Update ---
    const { data, error } = await supabaseServer
      .from('membership_plans')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
        if (error.code === '23505') { return NextResponse.json({ error: `A plan with the name "${name}" already exists.` }, { status: 409 }); }
        if (error.code === 'PGRST116' || error.message.includes('No rows found')) { return NextResponse.json({ error: `Plan with ID ${id} not found.` }, { status: 404 }); }
        console.error(`API PUT /membership-plans/${id} DB Error:`, error);
        throw new Error(error.message);
    }
     if (!data) { return NextResponse.json({ error: `Plan with ID ${id} not found.` }, { status: 404 }); }
     // --- End Database Update ---

    // --- Log Activity ---
    await logAdminActivity(
        session.user.id,
        session.user.email,
        `Updated membership plan: ${data.name}`,
        'plan',
        data.id,
        { updatedFields: Object.keys(dataToUpdate) } // Log updated fields
    );
    // --- End Log Activity ---

    return NextResponse.json(data);

  } catch (error: any) {
    console.error(`API PUT /membership-plans/${id} General Error:`, error);
     if (error instanceof SyntaxError) { return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 }); }
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
    {
      cookies: { // Full cookie implementation needed
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  );

  // --- Security Check: Owner Role ---
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { data: roleData, error: rpcError } = await supabase.rpc('get_my_role');
  if (rpcError) { console.error(`API DELETE /membership-plans/${id} Role Check Error:`, rpcError); return NextResponse.json({ error: 'Could not verify user role' }, { status: 500 }); }
  if (roleData !== 'Owner') { return NextResponse.json({ error: 'Forbidden: Only Owners can delete plans.' }, { status: 403 }); }
  // --- End Security Check ---

  if (!id || isNaN(parseInt(id, 10))) { return NextResponse.json({ error: 'Invalid Plan ID format' }, { status: 400 }); }

  try {
     // Fetch plan name before deleting for logging
    const { data: planToDelete, error: fetchError } = await supabaseServer
        .from('membership_plans').select('name').eq('id', id).maybeSingle();
     if (fetchError && fetchError.code !== 'PGRST116') { throw new Error(`Fetch before delete failed: ${fetchError.message}`); }

    // --- Database Delete ---
    const { error, count } = await supabaseServer
      .from('membership_plans').delete({ count: 'exact' }).eq('id', id);
    if (error) { console.error(`API DELETE /membership-plans/${id} DB Error:`, error); throw new Error(error.message); }
    // --- End Database Delete ---

    if (count === 0) { return NextResponse.json({ error: `Plan with ID ${id} not found.` }, { status: 404 }); }

    // --- Log Activity ---
    await logAdminActivity(
        session.user.id,
        session.user.email,
        `Deleted membership plan: ${planToDelete?.name || id}`,
        'plan',
        id
    );
    // --- End Log Activity ---

    return NextResponse.json({ message: `Plan ${id} deleted successfully` }, { status: 200 });

  } catch (error: any) {
    console.error(`API DELETE /membership-plans/${id} General Error:`, error);
    return NextResponse.json({ error: error.message || 'Failed to delete plan' }, { status: 500 });
  }
}