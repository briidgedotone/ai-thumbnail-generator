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

    // Determine credits based on plan
    let credits = 0;
    if (planName.toLowerCase() === 'free') {
      credits = 3;
    }

    // Update user_credits table with selected plan and credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .upsert({ 
        user_id: user.id,
        subscription_tier: planName.toLowerCase(),
        balance: credits,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (updateError) {
      console.error('Error updating user subscription tier:', updateError);
      return NextResponse.json({ error: 'Failed to update subscription tier' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Plan selected: ${planName}`,
      tier: planName.toLowerCase(),
      credits: credits
    });

  } catch (error) {
    console.error('Error in select-plan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 