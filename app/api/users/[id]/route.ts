import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch a single member by their ID.
 * e.g., /api/users/some-uuid
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
  }

  try {
    const { data: member, error } = await supabaseServer
      .from('members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(member);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

/**
 * Handles PUT requests to update an existing member's details.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { full_name, email, phone_number, plan, end_date } = body;

  try {
    const { data, error } = await supabaseServer
      .from('members')
      .update({
        full_name,
        email,
        phone_number,
        plan,
        end_date,
      })
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

/**
 * Handles DELETE requests to remove a member from the database.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { error } = await supabaseServer
      .from('members')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
