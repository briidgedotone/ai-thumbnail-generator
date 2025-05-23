import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  console.log(`[Middleware] Processing ${pathname}, session exists: ${!!session}`);

  // If user is not authenticated and trying to access dashboard, select-plan or their sub-routes
  if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/select-plan'))) {
    console.log(`[Middleware] Unauthenticated user trying to access ${pathname} - redirecting to auth`);
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // If user is authenticated, check their plan status
  if (session && (pathname.startsWith('/dashboard') || pathname.startsWith('/select-plan'))) {
    console.log(`[Middleware] Authenticated user trying to access ${pathname} - checking plan selection`);
    try {
      const { data: creditsData, error } = await supabase
        .from('user_credits')
        .select('subscription_tier')
        .eq('user_id', session.user.id)
        .single();
      
      console.log(`[Middleware] Credits data:`, creditsData, 'Error:', error);
      
      const hasPlanSelected = creditsData && creditsData.subscription_tier && creditsData.subscription_tier.trim() !== '';
      
      if (pathname.startsWith('/dashboard')) {
        // Dashboard access: requires plan selection
        if (error || !hasPlanSelected) {
          console.log(`[Middleware] User ${session.user.email} has no plan selected - redirecting to select-plan`);
          return NextResponse.redirect(new URL('/select-plan', req.url))
        }
        console.log(`[Middleware] User ${session.user.email} has plan: ${creditsData.subscription_tier} - allowing dashboard access`);
      } 
      
      if (pathname.startsWith('/select-plan')) {
        // Select-plan access: only allowed if NO plan selected
        if (hasPlanSelected) {
          console.log(`[Middleware] User ${session.user.email} already has plan: ${creditsData.subscription_tier} - redirecting to dashboard`);
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
        console.log(`[Middleware] User ${session.user.email} has no plan - allowing select-plan access`);
      }
      
    } catch (error) {
      console.log(`[Middleware] Error checking user plan:`, error);
      if (pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/select-plan', req.url))
      }
    }
  }

  // If user is authenticated and trying to access auth page
  if (session && pathname === '/auth') {
    console.log(`[Middleware] Authenticated user trying to access auth - redirecting to dashboard`);
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|ytza-logo.jpeg|images/|auth/callback).*)',
  ],
} 