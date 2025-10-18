    // app/api/reports/revenue/route.ts

    import { createClient } from '@/lib/supabase/server';
    import { NextResponse } from 'next/server';

    export async function GET() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Protect the route - only logged-in users can access it
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Call the database function we created earlier
        const { data: revenueData, error } = await supabase.rpc('get_monthly_revenue');

        if (error) {
        console.error("Supabase RPC Error:", error);
        throw new Error(error.message);
        }

        return NextResponse.json(revenueData);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    }

