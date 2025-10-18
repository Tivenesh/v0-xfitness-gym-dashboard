// File: app/api/logs/route.ts

import { supabaseServer } from '@/lib/supabaseServer'; // Use the admin client for direct table access
import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic' // Ensure this route is always dynamic

export async function GET(request: Request) {
  const cookieStore = cookies();

  // Create client ONLY for session check
  const supabaseAuthClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // IMPORTANT: Route Handlers must be able to set/remove cookies
        // if the session needs refreshing.
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request's cookies.
           cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request's cookies.
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Check user session
  const { data: { session }, error: sessionError } = await supabaseAuthClient.auth.getSession();

  if (sessionError || !session) {
    console.error('API /api/logs: Session error or no session:', sessionError?.message);
    // Return unauthorized even if just checking session failed
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Session is valid, proceed to fetch data using the admin client (supabaseServer)
  // This bypasses RLS for reading logs, assuming admins should see all logs.
  // If you HAVE set up RLS for logs, you might use supabaseAuthClient instead.
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    const statusQuery = searchParams.get('status');

    let query = supabaseServer // Using admin client
      .from('access_logs')
      .select('*')
      .order('entry_time', { ascending: false });

    if (searchQuery) {
      // Use case-insensitive search if desired
      query = query.ilike('member_name', `%${searchQuery}%`);
    }
    if (statusQuery && statusQuery !== 'All') {
      // Ensure the statusQuery matches exactly what's in your DB ('Granted' or 'Denied')
      query = query.eq('access_status', statusQuery);
    }

    // Limit the results to prevent fetching too much data at once (optional but recommended)
    query = query.limit(100); // Adjust limit as needed

    const { data: logs, error: queryError } = await query;

    if (queryError) {
      console.error("API /api/logs: Supabase query error:", queryError);
      return NextResponse.json({ error: `Database error: ${queryError.message}` }, { status: 500 });
    }

    // console.log("API /api/logs: Fetched logs:", logs); // Optional: Log successful fetches
    return NextResponse.json(logs ?? []); // Return empty array if data is null/undefined

  } catch (error: any) {
    console.error("API /api/logs: General error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}