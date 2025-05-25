import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  // Security: Check request size for API routes (prevent large payload attacks)
  if (pathname.startsWith('/api/')) {
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json(
        { error: 'Request payload too large' },
        { status: 413 }
      );
    }

    // Security: Validate Content-Type for POST requests
    if (req.method === 'POST') {
      const contentType = req.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return NextResponse.json(
          { error: 'Invalid content type. Expected application/json' },
          { status: 400 }
        );
      }
    }

    // Security: Add basic security headers to API responses
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-XSS-Protection', '1; mode=block');
  }

  // If user is not authenticated and trying to access dashboard, select-plan or their sub-routes
  if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/select-plan'))) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // If user is authenticated, check their plan status
  if (session && (pathname.startsWith('/dashboard') || pathname.startsWith('/select-plan'))) {
    try {
      const { data: creditsData, error } = await supabase
        .from('user_credits')
        .select('subscription_tier')
        .eq('user_id', session.user.id)
        .single();
      
      const hasPlanSelected = creditsData && creditsData.subscription_tier && creditsData.subscription_tier.trim() !== '';
      
      if (pathname.startsWith('/dashboard')) {
        // Dashboard access: requires plan selection
        if (error || !hasPlanSelected) {
          return NextResponse.redirect(new URL('/select-plan', req.url))
        }
      } 
      
      if (pathname.startsWith('/select-plan')) {
        // Select-plan access: only allowed if NO plan selected
        if (hasPlanSelected) {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
      
    } catch {
      if (pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/select-plan', req.url))
      }
    }
  }

  // If user is authenticated and trying to access auth page
  if (session && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - ytza-logo.jpeg (logo file)
     * - images/ (other images)
     * - auth/callback (OAuth callback route)
     * - payment-success (Stripe payment success page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|ytza-logo.jpeg|images/|auth/callback|payment-success).*)',
  ],
} 