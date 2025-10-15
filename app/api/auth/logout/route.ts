// File: app/api/auth/logout/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Sign out the user
  await supabase.auth.signOut();

  return NextResponse.redirect(`${requestUrl.origin}/login`, {
    status: 302,
  });
}