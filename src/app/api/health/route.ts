import { NextResponse } from 'next/server';
import { validateEnv } from '@/lib/env';

/**
 * Simple health check endpoint
 * - Returns 200 OK if the application is running
 * - Feature flags are added via middleware
 */
export async function GET() {
  const envValidation = validateEnv();
  
  return NextResponse.json({
    status: 'ok',
    configValid: envValidation.valid,
    timestamp: new Date().toISOString(),
  });
}

/**
 * HEAD method for lightweight feature detection
 * Headers are added by middleware
 */
export async function HEAD() {
  return new Response(null, { status: 200 });
} 