// File: app/api/trainers/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// --- GET Handler: Fetches all trainers ---
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
        const { data: trainers, error } = await supabaseServer
            .from('trainers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(trainers);

    } catch (error: any) {
        console.error("Error fetching trainers:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// --- POST Handler: Adds a new trainer (Owner only) ---
export async function POST(request: Request) {
    // 1. Authorize the user
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

    // 2. Check if the user is an 'Owner'
    const { data: role, error: rpcError } = await supabase.rpc('get_my_role');
    if (rpcError || role !== 'Owner') {
        return NextResponse.json({ error: 'Forbidden: You do not have permission to add trainers.' }, { status: 403 });
    }

    // 3. If authorized, proceed with insertion
    try {
        const { name, specialization, email, status, avatar_url } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Trainer name is required' }, { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from('trainers')
            .insert({
                name,
                specialization,
                email,
                status: status || 'Active', // Default to Active if not provided
                avatar_url
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error adding trainer:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}