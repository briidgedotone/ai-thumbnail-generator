'use client';

/**
 * Client-side feature detection based on API feature flag headers
 */

// Cache for feature flags to avoid unnecessary API calls
let featureCache: Record<string, boolean> | null = null;

/**
 * Fetch feature flags from the API
 * @returns Promise<Record<string, boolean>> Feature flags
 */
export async function fetchFeatureFlags(): Promise<Record<string, boolean>> {
  if (featureCache) {
    return featureCache;
  }

  try {
    // Make a lightweight request to an API endpoint to get feature flag headers
    const response = await fetch('/api/health', {
      method: 'HEAD', // Use HEAD to avoid loading response body
    });
    
    // Read the feature flags from headers
    const features = {
      hasOpenAI: response.headers.get('X-Feature-OpenAI') === '1',
      hasGemini: response.headers.get('X-Feature-Gemini') === '1',
      hasSupabase: response.headers.get('X-Feature-Supabase') === '1',
    };
    
    // Cache the result
    featureCache = features;
    
    return features;
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    // Default to assuming features are available if we can't check
    return {
      hasOpenAI: true,
      hasGemini: true,
      hasSupabase: true,
    };
  }
}

/**
 * Check if a specific feature is available
 * @param feature Feature name to check
 * @returns Promise<boolean> Whether the feature is available
 */
export async function hasFeature(feature: 'hasOpenAI' | 'hasGemini' | 'hasSupabase'): Promise<boolean> {
  const features = await fetchFeatureFlags();
  return features[feature];
}

/**
 * Reset the feature cache (useful for testing or when environment changes)
 */
export function resetFeatureCache(): void {
  featureCache = null;
} 