import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const beehiivApiKey = process.env.BEEHIIV_API_KEY;
    
    if (!beehiivApiKey) {
      console.error('BEEHIIV_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Newsletter service is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_82565575-cdaa-425c-9351-35ad6e2287a0/subscriptions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${beehiivApiKey}`,
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'website',
          utm_medium: 'footer',
        }),
      }
    );

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to our newsletter!',
      });
    } else {
      const errorData = await response.json();
      
      // Handle specific error cases
      if (response.status === 400 && errorData.message?.includes('already exists')) {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed to our newsletter!",
        });
      }
      
      console.error('Beehiiv API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
} 