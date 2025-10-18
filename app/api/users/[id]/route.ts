// File: app/api/users/[id]/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
// Assuming logAdminActivity is in lib/activityLogger.ts or similar
import { logAdminActivity } from '@/lib/activityLogger';

// --- Re-add or import the calculateEndDate helper function ---
function calculateEndDate(startDateStr: string, planName: string): string {
    // Ensure the date string is treated as UTC to avoid timezone issues on calculation
    const startDate = new Date(startDateStr + 'T12:00:00Z'); // Set time to noon UTC

    if (isNaN(startDate.getTime())) {
        const today = new Date();
        today.setUTCHours(12, 0, 0, 0); // Use noon UTC today as fallback
        startDate = today;
        console.warn("Invalid start date received, defaulting to today (UTC) for calculation.");
    }

    let endDate = new Date(startDate); // Clone the start date

    if (planName === 'Walk-in') {
        endDate.setUTCDate(startDate.getUTCDate() + 1); // Add 1 day
    } else if (planName === '1 Month') {
        endDate.setUTCMonth(startDate.getUTCMonth() + 1);
    } else if (planName === '3 Months') {
        endDate.setUTCMonth(startDate.getUTCMonth() + 3);
    } else if (planName === '6 Months') {
        endDate.setUTCMonth(startDate.getUTCMonth() + 6);
    } else if (planName === '12 Months') {
        endDate.setUTCMonth(startDate.getUTCMonth() + 12);
    } else {
        console.warn(`Unknown plan "${planName}" received, defaulting end date calculation to +1 month.`);
        endDate.setUTCMonth(startDate.getUTCMonth() + 1); // Default or handle unknown plan
    }
    // Format back to YYYY-MM-DD
    return endDate.toISOString().split('T')[0];
}
// --- End Helper Function ---


// GET handler remains the same
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
  }

  // Auth Check
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

  // Proceed with fetching data
  try {
    const { data: member, error } = await supabaseServer
      .from('members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
       if (error.code === 'PGRST116') {
         return NextResponse.json({ error: `Member with ID ${id} not found.` }, { status: 404 });
       }
       throw new Error(error.message);
    }
    return NextResponse.json(member);

  } catch (error: any) {
     console.error(`API GET /users/${id} Error:`, error);
     const status = error.message.includes('not found') ? 404 : 500;
     return NextResponse.json({ error: error.message }, { status });
  }
}

/**
 * Handles PUT requests to update an existing member's details.
 * Accepts start_date and recalculates end_date.
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
          cookies: { // Need full cookie implementation for session refresh
            get(name: string) { return cookieStore.get(name)?.value },
            set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
            remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
          },
        }
      );
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
    const { full_name, email, phone_number, plan, start_date, status } = body;

    // --- Validation ---
    if (!full_name && !email && !phone_number && !plan && !start_date && !status) {
        return NextResponse.json({ error: 'No fields provided for update.' }, { status: 400 });
    }
     if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
        return NextResponse.json({ error: 'Invalid Start Date format. Use YYYY-MM-DD.' }, { status: 400 });
     }
    // --- End Validation ---

    // --- Recalculate end_date if plan or start_date is being updated ---
    let calculated_end_date: string | undefined = undefined;
    let final_start_date: string | undefined = start_date; // Use provided start_date if available

    if (plan || start_date) {
        let currentPlan = plan;
        let currentStartDate = start_date;

        if (!currentPlan || !currentStartDate) {
            const { data: existingMember, error: fetchError } = await supabaseServer
                .from('members')
                .select('plan, start_date')
                .eq('id', id)
                .single(); // Use single()

            // Handle potential errors during fetch for calculation data
            if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "not found" if member was just deleted? Maybe rethink.
                 console.error(`Error fetching existing member data for end date calculation (ID: ${id}):`, fetchError);
                 // Return error or proceed without updating end_date
                 return NextResponse.json({ error: 'Could not retrieve existing member data to calculate end date.' }, { status: 500 });
            }
             if (!existingMember && !currentPlan && !currentStartDate) {
                 return NextResponse.json({ error: `Member with ID ${id} not found.` }, { status: 404 });
             }

             if (existingMember) {
                 if (!currentPlan) currentPlan = existingMember.plan;
                 if (!currentStartDate) currentStartDate = existingMember.start_date;
             }
        }

        // Only calculate if we have *both* pieces of info
        if (currentPlan && currentStartDate) {
             calculated_end_date = calculateEndDate(currentStartDate, currentPlan);
        } else {
            console.warn(`Skipping end date calculation due to missing plan or start date (Member ID: ${id}).`)
        }
    }
    // --- End Date Calculation ---


    // Construct update object
    const dataToUpdate: any = {};
    if (full_name !== undefined) dataToUpdate.full_name = full_name;
    if (email !== undefined) dataToUpdate.email = email || null; // Ensure null if empty
    if (phone_number !== undefined) dataToUpdate.phone_number = phone_number || null; // Ensure null if empty
    if (plan !== undefined) dataToUpdate.plan = plan;
    if (final_start_date !== undefined) dataToUpdate.start_date = final_start_date;
    if (calculated_end_date !== undefined) dataToUpdate.end_date = calculated_end_date;
    if (status !== undefined) dataToUpdate.status = status;

    // Prevent empty update
    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    // Perform the update
    const { data, error } = await supabaseServer
      .from('members')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
        if (error.code === 'PGRST116') {
             return NextResponse.json({ error: `Member with ID ${id} not found.` }, { status: 404 });
         }
        throw new Error(error.message);
    }
    if (!data) { // Failsafe
        return NextResponse.json({ error: `Member with ID ${id} not found.` }, { status: 404 });
    }

    // --- Log Activity ---
    await logAdminActivity(
      session.user.id,
      session.user.email,
      `Updated member profile: ${data.full_name || id}`,
      'member',
      id,
      { updatedFields: Object.keys(dataToUpdate) }
    );
    // --- End Log Activity ---

    return NextResponse.json(data);

  } catch (error: any) {
     console.error(`API PUT /users/${id} Error:`, error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
     }
     return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE handler remains the same
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const cookieStore = cookies();
    const supabase = createServerClient( /*...*/ ); // Initialize client as before
    const { data: { session } } = await supabase.auth.getSession();

    // ... (Authorization checks remain the same) ...
     if (!session?.user) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
      const { data: role, error: rpcError } = await supabase.rpc('get_my_role');
      if (rpcError) { console.error(`API DELETE /users/${id} Role Check Error:`, rpcError); return NextResponse.json({ error: 'Error fetching user role.' }, { status: 500 }); }
      if (role !== 'Owner') { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }

  try {
    const { data: memberToDelete, error: fetchError } = await supabaseServer
        .from('members').select('full_name').eq('id', id).maybeSingle();
     if (fetchError && fetchError.code !== 'PGRST116') { throw new Error(`Fetch before delete failed: ${fetchError.message}`); }

    const { error: deleteError, count } = await supabaseServer
      .from('members').delete({ count: 'exact' }).eq('id', id);
    if (deleteError) throw new Error(deleteError.message);
    if (count === 0) { return NextResponse.json({ error: `Member with ID ${id} not found.` }, { status: 404 }); }

    // --- Log Activity ---
    await logAdminActivity(
      session.user.id,
      session.user.email,
      `Deleted member: ${memberToDelete?.full_name || id}`,
      'member',
      id
    );
    // --- End Log Activity ---

    return NextResponse.json({ message: 'Member deleted successfully' });

  } catch (error: any) {
    console.error(`API DELETE /users/${id} Error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}