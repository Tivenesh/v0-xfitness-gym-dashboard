// File: app/api/plans/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// --- GET Handler: Fetches all membership plans ---
export async function GET(request: Request) {
    // --- Auth Check (Any logged-in user can view) ---
    const cookieStore = cookies();
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
    );
    const { data: { session } } = await supabaseAuth.auth.getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // --- End Auth Check ---

    try {
        const { data: plans, error } = await supabaseServer
            .from('membership_plans')
            .select('*')
            .order('duration_months', { ascending: true }); // Order by duration

        if (error) throw error;
        return NextResponse.json(plans);

    } catch (error: any) {
        console.error("Error fetching membership plans:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Note: No POST needed here, as plans are usually predefined or edited, not created frequently via API.