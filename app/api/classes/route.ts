// File: app/api/classes/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// --- GET Handler: Fetches all classes, joining with trainer name ---
export async function GET(request: Request) {
    // Auth Check (Any logged-in user can view)
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

    try {
        // Join with trainers table to get the trainer's name
        const { data: classes, error } = await supabaseServer
            .from('classes')
            .select(`
                id,
                name,
                schedule_time,
                capacity,
                created_at,
                trainers ( name )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Flatten the trainer object for easier frontend use
        const formattedClasses = classes.map(cls => ({
            ...cls,
            trainer_name: cls.trainers?.name ?? 'Unassigned' 
        }));

        return NextResponse.json(formattedClasses);

    } catch (error: any) {
        console.error("Error fetching classes:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// --- POST Handler: Adds a new class (Owner only) ---
export async function POST(request: Request) {
    // Authorize & Check Role
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
    );
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: role, error: rpcError } = await supabase.rpc('get_my_role');
    if (rpcError || role !== 'Owner') {
        return NextResponse.json({ error: 'Forbidden: You do not have permission to add classes.' }, { status: 403 });
    }

    // Proceed with insertion
    try {
        const { name, trainer_id, schedule_time, capacity } = await request.json();

        if (!name || !schedule_time || capacity == null) {
            return NextResponse.json({ error: 'Class name, schedule time, and capacity are required' }, { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from('classes')
            .insert({
                name,
                trainer_id: trainer_id || null, // Allow null if no trainer assigned
                schedule_time,
                capacity: parseInt(capacity)
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error adding class:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}