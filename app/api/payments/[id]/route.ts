// app/api/payments/[id]/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { status } = await request.json();

  if (!id || !status) {
    return NextResponse.json({ error: 'Payment ID and status are required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseServer
      .from('payments')
      .update({ status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}