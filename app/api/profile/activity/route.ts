// File: app/api/profile/activity/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
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

  // Get the current user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.error('API GET /api/profile/activity: Session error or no user:', sessionError?.message);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch activity log data for the current user
  try {
    // RLS policy ensures users can only fetch their own logs
    const { data: activityLogs, error: logError } = await supabase
      .from('admin_activity_log')
      .select('id, action_description, target_resource_type, target_resource_id, timestamp, details') // Select desired columns
      .eq('admin_user_id', session.user.id) // RLS policy handles this, but explicit check is fine too
      .order('timestamp', { ascending: false }) // Show most recent first
      .limit(50); // Limit the number of logs fetched for performance

    if (logError) {
      console.error('API GET /api/profile/activity: Supabase log fetch error:', logError);
      throw logError;
    }

    return NextResponse.json(activityLogs ?? []); // Return empty array if null

  } catch (error: any) {
    console.error('API GET /api/profile/activity: General error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch activity logs' }, { status: 500 });
  }
}