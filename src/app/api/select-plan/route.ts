import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { planName } = await request.json();

    if (!planName) {
      return NextResponse.json({ error: 'Plan name is required' }, { status: 400 });
    }

    // Create a Supabase client for server-side operations
    const supabase = createRouteHandlerClient({ cookies });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update user_credits table with selected plan
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ 
        subscription_tier: planName.toLowerCase(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating user subscription tier:', updateError);
      return NextResponse.json({ error: 'Failed to save plan selection' }, { status: 500 });
    }

    console.log(`User ${user.email} selected plan: ${planName} - stored in user_credits.subscription_tier`);
    return NextResponse.json({ success: true, planName });

  } catch (error) {
    console.error('Error in select-plan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 