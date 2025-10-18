// File: app/api/profile/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// GET handler to fetch the current user's profile
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
    console.error('API GET /api/profile: Session error or no user:', sessionError?.message);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch profile data using the user's ID
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', session.user.id)
      .single(); // Use single() as the ID is unique

    if (profileError) {
      // If profile doesn't exist yet (e.g., trigger didn't run or manual creation), return defaults
      if (profileError.code === 'PGRST116') { // PGRST116 = "Row not found"
        return NextResponse.json({ full_name: null, avatar_url: null });
      }
      console.error('API GET /api/profile: Supabase profile fetch error:', profileError);
      throw profileError;
    }

    return NextResponse.json(profile);

  } catch (error: any) {
    console.error('API GET /api/profile: General error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT handler to update the current user's profile
export async function PUT(request: NextRequest) {
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
    console.error('API PUT /api/profile: Session error or no user:', sessionError?.message);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get data from request body
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { full_name, avatar_url } = body;

  // Prepare data for update (only include fields provided)
  const dataToUpdate: { full_name?: string; avatar_url?: string; updated_at: string } = {
    updated_at: new Date().toISOString(), // Always update the timestamp
  };
  if (full_name !== undefined) {
    dataToUpdate.full_name = full_name;
  }
   if (avatar_url !== undefined) {
    dataToUpdate.avatar_url = avatar_url;
  }

  // Perform the update using RLS (user can only update their own profile)
  try {
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(dataToUpdate)
      .eq('id', session.user.id)
      .select('full_name, avatar_url') // Select the updated data to return
      .single();

    if (updateError) {
      console.error('API PUT /api/profile: Supabase profile update error:', updateError);
      throw updateError;
    }

    return NextResponse.json(updatedProfile);

  } catch (error: any) {
    console.error('API PUT /api/profile: General error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}