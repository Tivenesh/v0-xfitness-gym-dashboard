// File: app/api/payments/manual/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { member_id, plan_name, amount, payment_method } = await request.json();

    if (!member_id || !plan_name || !amount || !payment_method) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        // Create a 'Pending' payment record. The member is NOT updated yet.
        const { error: paymentError } = await supabaseServer
            .from('payments')
            .insert({
                member_id: member_id,
                plan_name: plan_name,
                amount: parseFloat(amount),
                payment_method: payment_method,
                status: 'Pending', // <-- THIS IS THE KEY CHANGE
                transaction_date: new Date().toISOString(),
            });

        if (paymentError) {
            console.error("Error creating manual payment:", paymentError);
            throw new Error(`Failed to create payment record: ${paymentError.message}`);
        }

        return NextResponse.json({ message: 'Pending payment recorded successfully. Please approve it.' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}