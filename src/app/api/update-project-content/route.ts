import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { selectedStyleId, generatedTitle, generatedDescription, generatedTags } = await request.json();

    if (!selectedStyleId) {
      return NextResponse.json({ error: 'Missing selectedStyleId' }, { status: 400 });
    }

    // Check that at least one content field is provided
    if (!generatedTitle && !generatedDescription && !generatedTags) {
      return NextResponse.json({ error: 'At least one content field must be provided' }, { status: 400 });
    }

    // Create a Supabase client for server-side operations
    const supabase = createRouteHandlerClient({ cookies });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Updating content for user:', user.email, 'style:', selectedStyleId);

    // Build the update object with only the provided fields
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (generatedTitle) updateData.generated_title = generatedTitle;
    if (generatedDescription) updateData.generated_description = generatedDescription;
    if (generatedTags) updateData.generated_tags = generatedTags;

    // Update only the content fields in the most recent project for this user and style
    const { data, error } = await supabase
      .from('generated_projects')
      .update(updateData)
      .eq('user_id', user.id)
      .eq('selected_style_id', selectedStyleId)
      .order('created_at', { ascending: false })
      .limit(1)
      .select();

    if (error) {
      console.error('Error updating project content:', error);
      return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }

    console.log('Successfully updated content:', data?.[0]);

    return NextResponse.json({ 
      success: true, 
      message: 'Content updated successfully',
      data: data?.[0] 
    });

  } catch (error) {
    console.error('Unexpected error updating content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 