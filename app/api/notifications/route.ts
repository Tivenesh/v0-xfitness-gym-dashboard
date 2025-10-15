// app/api/notifications/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, message } = await request.json();

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    // For now, we assume we send to 'All' members.
    // In a real app, you might calculate the actual number of members.
    const recipient_group = 'All';
    const recipient_count = 0; // Placeholder

    const { data, error } = await supabaseServer
      .from('notifications')
      .insert({
        title,
        body: message, // The column in your table is 'body'
        recipient_group,
        recipient_count,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // In a real app, this is where you would trigger the actual push notification/email service.
    // For now, we are just saving it to the database.

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}