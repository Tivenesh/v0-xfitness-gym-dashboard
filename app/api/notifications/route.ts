// app/api/notifications/route.ts

import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, message, recipientGroup } = await request.json();

    if (!title || !message || !recipientGroup) {
      return NextResponse.json({ error: 'Title, message, and recipient group are required' }, { status: 400 });
    }

    // You can add logic here to count members based on the recipientGroup
    // For now, we'll just save the group name and a placeholder count.
    const recipient_count = 0; // Placeholder

    const { data, error } = await supabaseServer
      .from('notifications')
      .insert({
        title,
        body: message,
        recipient_group: recipientGroup, // Save the selected group
        recipient_count,
      })
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