import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic' // Ensures this route is always run dynamically

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    try {
      await supabase.auth.exchangeCodeForSession(code)
      // Successful exchange, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      // Failed exchange, redirect to an error page or auth page with an error message
      // For simplicity, redirecting to auth page. Consider a dedicated error page for better UX.
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('error', 'auth_callback_failed')
      redirectUrl.searchParams.set('error_description', 'Could not log you in with Google. Please try again.')
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If no code is present, or other issues, redirect to auth page
  console.warn('No code found in auth callback.')
  const redirectUrl = new URL('/auth', request.url)
  redirectUrl.searchParams.set('error', 'auth_callback_error')
  redirectUrl.searchParams.set('error_description', 'Something went wrong during Google authentication.')
  return NextResponse.redirect(redirectUrl)
} 