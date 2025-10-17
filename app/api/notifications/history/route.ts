// app/api/notifications/history/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data: notifications, error } = await supabaseServer
      .from('notifications')
      .select('*')
      .order('sent_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(notifications);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}