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

    // Fetch existing projects for this user and style
    const { data: existingProjects, error: fetchError } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', user.id)
      .eq('selected_style_id', selectedStyleId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('Error fetching existing projects:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch existing projects' }, { status: 500 });
    }

    if (!existingProjects || existingProjects.length === 0) {
      console.error('No projects found for user:', user.email, 'style:', selectedStyleId);
      return NextResponse.json({ error: 'No projects found to update' }, { status: 404 });
    }

    // Update the thumbnail in the most recent project for this user and style
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingProjects[0].id)
      .select();

    if (error) {
      console.error('Error updating project thumbnail:', error);
      console.error('Error details:', {
        userId: user.id,
        projectId: existingProjects[0].id,
        imageUrl,
        error: error.message
      });
      return NextResponse.json({ error: 'Failed to update project thumbnail' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      project: data?.[0] 
    });

  } catch (error) {
    console.error('Unexpected error updating thumbnail:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 