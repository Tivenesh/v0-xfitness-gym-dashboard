// File: app/api/trainers/[id]/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// --- GET Handler: Fetches a single trainer by ID ---
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ error: 'Valid Trainer ID is required' }, { status: 400 });
    }

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
        const { data: trainer, error } = await supabaseServer
            .from('trainers')
            .select('*')
            .eq('id', parseInt(id))
            .single();

        if (error) {
            if (error.code === 'PGRST116') return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
            throw error;
        }
        return NextResponse.json(trainer);

    } catch (error: any) {
        console.error("Error fetching trainer:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// --- PUT Handler: Updates an existing trainer (Owner only) ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ error: 'Valid Trainer ID is required' }, { status: 400 });
    }

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
        return NextResponse.json({ error: 'Forbidden: You do not have permission to update trainers.' }, { status: 403 });
    }

    // 3. If authorized, proceed with update
    try {
        const { name, specialization, email, status, avatar_url } = await request.json();

        // Construct object with only the fields provided in the request
        const dataToUpdate: any = {};
        if (name) dataToUpdate.name = name;
        if (specialization) dataToUpdate.specialization = specialization;
        if (email) dataToUpdate.email = email;
        if (status) dataToUpdate.status = status;
        if (avatar_url) dataToUpdate.avatar_url = avatar_url;

        if (Object.keys(dataToUpdate).length === 0) {
            return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from('trainers')
            .update(dataToUpdate)
            .eq('id', parseInt(id))
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error updating trainer:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// --- DELETE Handler: Removes a trainer (Owner only) ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ error: 'Valid Trainer ID is required' }, { status: 400 });
    }

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
        return NextResponse.json({ error: 'Forbidden: You do not have permission to delete trainers.' }, { status: 403 });
    }

    // 3. If authorized, proceed with deletion
    try {
        const { error } = await supabaseServer
            .from('trainers')
            .delete()
            .eq('id', parseInt(id));

        if (error) throw error;
        
        return NextResponse.json({ message: 'Trainer deleted successfully' });

    } catch (error: any) {
        console.error("Error deleting trainer:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}