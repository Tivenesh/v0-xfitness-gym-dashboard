// File: app/api/users/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Assuming logAdminActivity is in lib/activityLogger.ts or similar
// If not, define it here or import appropriately.
async function logAdminActivity(
    adminUserId: string,
    adminEmail: string | undefined, // Pass the email from the session
    action: string, // Description of the action
    resourceType?: string, // Type of resource affected (optional)
    resourceId?: string | number, // ID of the resource affected (optional)
    details?: object // Extra JSON data (optional)
) {
  try {
    const { error } = await supabaseServer.from('admin_activity_log').insert({
      admin_user_id: adminUserId,
      admin_email: adminEmail || 'Unknown', // Store email for easier display
      action_description: action,
      target_resource_type: resourceType,
      target_resource_id: resourceId ? String(resourceId) : undefined, // Ensure ID is stored as string
      details: details,
    });
    if (error) {
      console.error('Failed to log admin activity:', error);
    }
  } catch (logError) {
    console.error('Exception during admin activity logging:', logError);
  }
}


// Helper function to calculate end date
function calculateEndDate(startDateStr: string, planName: string): string {
    const startDate = new Date(startDateStr);
    // Adjust for potential timezone offset if start_date is just YYYY-MM-DD
    // Treat the input date as UTC to avoid timezone shifts during calculation
    startDate.setUTCHours(0, 0, 0, 0);

    if (isNaN(startDate.getTime())) {
        // Handle invalid start date string, default to today UTC
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        startDate = today;
        console.warn("Invalid start date received, defaulting to today (UTC) for calculation.");
    }

    let endDate = new Date(startDate); // Clone the start date

    if (planName === 'Walk-in') {
        endDate.setUTCDate(startDate.getUTCDate() + 1); // Add 1 day (UTC)
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
        endDate.setUTCMonth(startDate.getUTCMonth() + 1);
    }

    // Format as YYYY-MM-DD
    return endDate.toISOString().split('T')[0];
}


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
    console.error("API GET /users Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(members ?? []); // Return empty array if null
}

export async function POST(request: Request) {
  // --- Auth Check ---
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // --- End Auth Check ---

  try {
    const body = await request.json();
    // Destructure start_date instead of end_date
    const { full_name, email, phone_number, plan, start_date } = body;

    // --- Validation ---
    if (!full_name || !plan || !start_date) {
        return NextResponse.json({ error: 'Full Name, Plan, and Start Date are required.' }, { status: 400 });
    }
     if (!/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
        return NextResponse.json({ error: 'Invalid Start Date format. Use YYYY-MM-DD.' }, { status: 400 });
     }
    // --- End Validation ---

    // --- Calculate End Date ---
    const calculated_end_date = calculateEndDate(start_date, plan);
    // --- End Calculation ---

    // Get today's date for join_date
    const joinDate = new Date().toISOString().split('T')[0];

    const { data, error } = await supabaseServer
      .from('members')
      .insert([
        {
          full_name,
          email: email || null, // Handle empty string as null
          phone_number: phone_number || null, // Handle empty string as null
          plan,
          start_date: start_date, // Save the provided start date
          end_date: calculated_end_date, // Save the calculated end date
          status: 'Active', // Default status for new members
          join_date: joinDate // Set join date
        },
      ])
      .select()
      .single(); // Expecting one row back

    if (error) {
      console.error("Supabase Insert Error:", error);
       if (error.code === '23505' && error.message.includes('members_email_key')) {
         return NextResponse.json({ error: `A member with email "${email}" already exists.` }, { status: 409 });
       }
      // Provide a more generic error for other db issues
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 400 });
    }
     if (!data) { // Should ideally be caught by error handling, but good failsafe
        return NextResponse.json({ error: 'Failed to create member, no data returned.' }, { status: 500 });
     }

    // --- Log Activity ---
    await logAdminActivity(
        session.user.id,
        session.user.email,
        `Added new member: ${data.full_name}`,
        'member',
        data.id // Use the ID from the returned data
    );
    // --- End Log Activity ---

    return NextResponse.json(data); // Return the created member data

  } catch (error: any) {
    console.error("API POST /users Route Error:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}