import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|ytza-logo.png|images/).*)',
    // We explicitly want to run on /auth and /dashboard routes.
    // The above negative lookahead will match them.
    // If it were too broad, we could list them: '/dashboard/:path*', '/auth'
  ],
} 