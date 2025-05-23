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

    // Check user's current tier to determine action
    const { data: currentCreditsData, error: creditsCheckError } = await supabase
      .from('user_credits')
      .select('subscription_tier, balance')
      .eq('user_id', user.id)
      .single();

    let newBalance = 50;
    let newTier = 'pro';
    let actionMessage = 'upgraded to Pro plan';

    if (!creditsCheckError && currentCreditsData) {
      if (currentCreditsData.subscription_tier === 'pro') {
        // User is already Pro, add 50 credits to existing balance
        newBalance = (currentCreditsData.balance || 0) + 50;
        newTier = 'pro';
        actionMessage = 'added 50 credits to Pro account';
      } else {
        // User is Free, upgrade to Pro with 50 credits
        newBalance = 50;
        newTier = 'pro';
        actionMessage = 'upgraded to Pro plan with 50 credits';
      }
    }

    // Update user subscription and assign credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .upsert({ 
        user_id: user.id,
        subscription_tier: newTier,
        balance: newBalance,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (updateError) {
      console.error('Error updating user subscription:', updateError);
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    console.log(`Successfully ${actionMessage} for user ${user.email}. New balance: ${newBalance}`);

    return NextResponse.json({ 
      success: true, 
      message: `Payment verified and ${actionMessage}`,
      plan: newTier,
      balance: newBalance
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 