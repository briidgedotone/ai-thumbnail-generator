import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract user info and update database
        if (session.client_reference_id && session.metadata?.plan) {
          await updateUserSubscription(session.client_reference_id, session.metadata.plan);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        // Payment intent succeeded - could log to analytics here
        break;
      }

      case 'payment_intent.payment_failed': {
        // Payment intent failed - could log to analytics here
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        // Subscription events - could update subscription status here
        break;
      }

      case 'customer.subscription.deleted': {
        // Subscription cancelled - could handle cleanup here
        break;
      }

      default:
        // Unhandled event type
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function updateUserSubscription(userId: string, plan: string) {
  try {
    const { error } = await supabase
      .from('user_credits')
      .upsert({
        user_id: userId,
        subscription_tier: plan,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    // Could log to error tracking service here
    throw error;
  }
} 