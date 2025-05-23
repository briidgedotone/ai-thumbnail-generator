import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { features } from '@/lib/env';

/**
 * Middleware to add feature flags headers to API responses
 * This helps the client determine which features are available based on environment configuration
 */
export function featureFlagsMiddleware(request: NextRequest) {
  // Only apply this middleware to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Create a new response
  const response = NextResponse.next();

  // Add feature flags as headers
  response.headers.set('X-Feature-OpenAI', features.hasOpenAI() ? '1' : '0');
  response.headers.set('X-Feature-Gemini', features.hasGemini() ? '1' : '0');
  response.headers.set('X-Feature-Supabase', features.hasSupabase() ? '1' : '0');

  return response;
} 