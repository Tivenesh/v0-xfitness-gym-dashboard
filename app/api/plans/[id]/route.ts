// File: app/api/plans/[id]/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// --- PUT Handler: Updates an existing membership plan (Owner only) ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const planId = parseInt(id);
    if (!id || isNaN(planId)) {
        return NextResponse.json({ error: 'Valid Plan ID is required' }, { status: 400 });
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
        return NextResponse.json({ error: 'Forbidden: You do not have permission to update plans.' }, { status: 403 });
    }

    // 3. If authorized, proceed with update
    try {
        // Only allow specific fields to be updated
        const {
            price,
            monthly_breakdown,
            features,
            is_popular,
            bonus_text
        } = await request.json();

        const dataToUpdate: any = {};
        if (price !== undefined) dataToUpdate.price = parseFloat(price);
        if (monthly_breakdown !== undefined) dataToUpdate.monthly_breakdown = monthly_breakdown; // Allow setting to null or empty
        if (features !== undefined && Array.isArray(features)) dataToUpdate.features = features; // Expecting an array
        if (is_popular !== undefined) dataToUpdate.is_popular = !!is_popular; // Coerce to boolean
        if (bonus_text !== undefined) dataToUpdate.bonus_text = bonus_text; // Allow setting to null or empty


        if (Object.keys(dataToUpdate).length === 0) {
            return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from('membership_plans')
            .update(dataToUpdate)
            .eq('id', planId)
            .select()
            .single();

        if (error) {
             console.error("Error updating plan:", error);
             throw error; // Throw error to be caught below
        }
        
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("API Error updating plan:", error);
        // Provide more specific feedback if it's a known Supabase error
        if (error.code) {
             return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Failed to update plan' }, { status: 500 });
    }
}

// Note: GET and DELETE handlers for a single plan might not be necessary
// if you fetch all plans on the frontend and filter/manage there.
// Add them here if your UI design requires fetching/deleting single plans by ID.