import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { imageUrl, selectedStyleId } = await request.json();

    if (!imageUrl || !selectedStyleId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a Supabase client for server-side operations
    const supabase = createRouteHandlerClient({ cookies });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update only the thumbnail in the most recent project for this user and style
    const { data, error } = await supabase
      .from('generated_projects')
      .update({ 
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('selected_style_id', selectedStyleId)
      .order('created_at', { ascending: false })
      .limit(1)
      .select();

    if (error) {
      console.error('Error updating project thumbnail:', error);
      return NextResponse.json({ error: 'Failed to update thumbnail' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Thumbnail updated successfully',
      data: data?.[0] 
    });

  } catch (error) {
    console.error('Unexpected error updating thumbnail:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 