// File: app/api/payments/[id]/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// --- GET Handler: Fetches a single payment record ---
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: 'Valid Payment ID is required' }, { status: 400 });
  }

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
    const { data: payment, error } = await supabaseServer
      .from('payments')
      .select(`*, members ( full_name )`)
      .eq('id', parseInt(id))
      .single();

    if (error) {
        if (error.code === 'PGRST116') return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        throw new Error(error.message);
    }
    return NextResponse.json(payment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- PUT Handler: Updates payment status and potentially member subscription ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  function getNewEndDate(planName: string, currentEndDateStr?: string): string {
      const startDate = currentEndDateStr && new Date(currentEndDateStr) > new Date()
          ? new Date(currentEndDateStr)
          : new Date();
      let monthsToAdd = 0;
      if (planName?.includes('1 Month')) monthsToAdd = 1;
      else if (planName?.includes('3 Months')) monthsToAdd = 3;
      else if (planName?.includes('6 Months')) monthsToAdd = 6;
      else if (planName?.includes('12 Months')) monthsToAdd = 12;

      startDate.setMonth(startDate.getMonth() + monthsToAdd);
      return startDate.toISOString().split('T')[0];
  }

  const { id } = params;
  const payload = await request.json();
  const { status, plan_name, amount, payment_method } = payload;

  if (!id) {
    return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
  }

  const dataToUpdate: any = {};
  if (status) dataToUpdate.status = status;
  if (plan_name) dataToUpdate.plan_name = plan_name;
  if (amount !== undefined) dataToUpdate.amount = parseFloat(amount);
  if (payment_method) dataToUpdate.payment_method = payment_method;

  if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: 'No valid fields for update' }, { status: 400 });
  }

  try {
    const { data: updatedPayment, error: paymentError } = await supabaseServer
      .from('payments')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (paymentError) throw new Error(paymentError.message);
    if (!updatedPayment) throw new Error('Payment not found.');

    if (dataToUpdate.status === 'Success' && updatedPayment.member_id) {
        const { data: memberData } = await supabaseServer
            .from('members')
            .select('end_date')
            .eq('id', updatedPayment.member_id)
            .single();

        const newEndDate = getNewEndDate(updatedPayment.plan_name, memberData?.end_date);

        await supabaseServer
            .from('members')
            .update({ status: 'Active', end_date: newEndDate, plan: updatedPayment.plan_name })
            .eq('id', updatedPayment.member_id);
    }
    return NextResponse.json(updatedPayment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- NEW DELETE Handler: Removes a payment record (Owner only) ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    
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
        return NextResponse.json({ error: 'Forbidden: You do not have permission to delete payments.' }, { status: 403 });
    }

    // 3. If authorized, proceed with deletion
    try {
        const { error } = await supabaseServer
            .from('payments')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
        
        return NextResponse.json({ message: 'Payment deleted successfully' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}