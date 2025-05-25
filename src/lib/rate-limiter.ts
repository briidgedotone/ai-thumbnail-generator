// Simple in-memory rate limiter
// For production, consider using Redis or external rate limiting service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

export const rateLimitConfigs = {
  // AI generation endpoints - more restrictive
  aiGeneration: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 requests per minute
  },
  // Payment endpoints - moderate limits
  payment: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  },
  // General API endpoints
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
  // Webhook endpoints - higher limits
  webhook: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  }
} as const;

export function checkRateLimit(
  identifier: string, 
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / options.windowMs)}`;
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupOldEntries(now, options.windowMs);
  }
  
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
    // First request in this window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + options.windowMs
    });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs
    };
  }
  
  if (entry.count >= options.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetTime: entry.resetTime
  };
}

function cleanupOldEntries(now: number, windowMs: number) {
  const cutoff = now - windowMs * 2; // Keep entries for 2 windows
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < cutoff) {
      rateLimitStore.delete(key);
    }
  }
}

export function getRateLimitHeaders(remaining: number, resetTime: number) {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  };
} 