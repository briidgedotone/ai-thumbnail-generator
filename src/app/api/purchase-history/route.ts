import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Create a Supabase client for server-side operations
    const supabase = createRouteHandlerClient({ cookies });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch purchase history for this user
    const { data: purchases, error: purchasesError } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (purchasesError) {
      console.error('Error fetching purchase history:', purchasesError);
      return NextResponse.json({ error: 'Failed to fetch purchase history' }, { status: 500 });
    }

    // Format the response
    const formattedPurchases = purchases.map(purchase => ({
      id: purchase.id,
      amount: purchase.amount_cents / 100, // Convert cents to dollars
      credits_added: purchase.credits_added,
      purchase_type: purchase.purchase_type === 'upgrade' ? 'Pro Upgrade' : 'Credit Purchase',
      payment_method_last4: purchase.payment_method_last4,
      created_at: purchase.created_at
    }));

    return NextResponse.json({ 
      purchases: formattedPurchases 
    });

  } catch (error) {
    console.error('Error in purchase history API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 