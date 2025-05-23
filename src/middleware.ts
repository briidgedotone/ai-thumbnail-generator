import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { featureFlagsMiddleware } from '@/middleware/feature-flags-middleware'

export async function middleware(req: NextRequest) {
  // Apply feature flags middleware for API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    return featureFlagsMiddleware(req);
  }
  
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // If user is not authenticated and trying to access dashboard or its sub-routes
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // If user is authenticated and trying to access auth page
  if (session && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    // Also match API routes for feature flags middleware
    '/api/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - ytza-logo.jpeg (logo file)
     * - images/ (other images)
     * - auth/callback (OAuth callback route)
     */
    '/((?!_next/static|_next/image|favicon.ico|ytza-logo.jpeg|images/|auth/callback).*)',
  ],
} 