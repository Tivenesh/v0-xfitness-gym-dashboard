// File: app/api/classes/[id]/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// --- GET Handler: Fetches a single class by ID ---
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const classId = parseInt(id);

    if (!id || isNaN(classId)) {
        console.error("GET /api/classes/[id]: Invalid Class ID provided:", id);
        return NextResponse.json({ error: 'Valid Class ID is required' }, { status: 400 });
    }

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
        const { data: classData, error } = await supabaseServer
            .from('classes')
            .select('id, name, schedule_time, capacity, trainer_id, trainers ( name )')
            .eq('id', classId)
            .maybeSingle();

        if (error) {
            console.error(`Supabase error fetching class ${classId}:`, error);
            throw new Error(error.message);
        }

        if (!classData) {
            return NextResponse.json({ error: 'Class not found' }, { status: 404 });
        }

        const formattedClass = {
            ...classData,
            trainer_name: classData.trainers?.name ?? null
        };
        delete (formattedClass as any).trainers;

        return NextResponse.json(formattedClass);

    } catch (error: any) {
        console.error("Error in GET /api/classes/[id]:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

// --- PUT Handler: Updates an existing class (Owner only) ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const classId = parseInt(id);
    if (!id || isNaN(classId)) {
        return NextResponse.json({ error: 'Valid Class ID is required' }, { status: 400 });
    }

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
        return NextResponse.json({ error: 'Forbidden: You do not have permission to update classes.' }, { status: 403 });
    }

    try {
        const { name, trainer_id, schedule_time, capacity } = await request.json();

        const dataToUpdate: any = {};
        if (name) dataToUpdate.name = name;
        dataToUpdate.trainer_id = trainer_id ? parseInt(trainer_id) : null;
        if (schedule_time) dataToUpdate.schedule_time = schedule_time;
        if (capacity != null) dataToUpdate.capacity = parseInt(capacity);

        if (Object.keys(dataToUpdate).length === 0) {
            return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from('classes')
            .update(dataToUpdate)
            .eq('id', classId)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error updating class:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// --- DELETE Handler: Removes a class (Owner only) --- // done.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const classId = parseInt(id);
     if (!id || isNaN(classId)) {
        return NextResponse.json({ error: 'Valid Class ID is required' }, { status: 400 });
    }

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
        return NextResponse.json({ error: 'Forbidden: You do not have permission to delete classes.' }, { status: 403 });
    }

    try {
        const { error } = await supabaseServer
            .from('classes')
            .delete()
            .eq('id', classId);

        if (error) throw error;
        
        return NextResponse.json({ message: 'Class deleted successfully' });

    } catch (error: any) {
        console.error("Error deleting class:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
