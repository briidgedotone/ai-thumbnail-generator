import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Create a Supabase client for server-side operations
    const supabase = createRouteHandlerClient({ cookies });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify the session belongs to the current user
    if (session.customer_email !== user.email) {
      console.error(`Session email mismatch: ${session.customer_email} vs ${user.email}`);
      return NextResponse.json({ error: 'Session does not belong to user' }, { status: 403 });
    }

    // Check if payment was successful (for one-time payments, check payment_status)
    if (session.payment_status !== 'paid') {
      console.error(`Payment not completed: ${session.payment_status}`);
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // For one-time payments, we'll give permanent Pro access
    // Update user subscription and assign credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .upsert({ 
        user_id: user.id,
        subscription_tier: 'pro_lifetime', // Changed to indicate lifetime access
        balance: 50,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (updateError) {
      console.error('Error updating user subscription:', updateError);
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    console.log(`Successfully upgraded user ${user.email} to Pro Lifetime plan with 50 credits`);

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified and Pro access granted',
      plan: 'pro_lifetime',
      balance: 50
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 