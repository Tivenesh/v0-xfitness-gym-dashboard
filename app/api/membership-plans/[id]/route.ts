// app/api/membership-plans/[id]/route.ts
import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

  // Auth Check: Ensure user is logged in and is Owner
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Check role (assuming you have a function or metadata for this)
  const userRole = session.user?.app_metadata?.role;
  if (userRole !== 'Owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    // Destructure only the fields you allow to be updated
    const { name, price, monthly_equivalent, duration_months, features, is_popular, bonus_offer } = body;

    // Basic validation (add more as needed)
    if (!name || price === undefined || duration_months === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('membership_plans')
      .update({
         name,
         price,
         monthly_equivalent,
         duration_months,
         features,
         is_popular,
         bonus_offer
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}