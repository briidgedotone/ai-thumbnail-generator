'use server';

import { validateEnv } from '@/lib/env';

/**
 * This function is called during application initialization
 * to ensure all required configuration is in place
 */
export async function initializeApp() {
  const result = validateEnv();
  
  if (!result.valid) {
    console.error('Application initialization failed: Missing required environment variables', result.missing);
  }
  
  return result;
}

/**
 * Checks if the app is correctly configured
 */
export async function isAppConfigured() {
  const result = await initializeApp();
  return result.valid;
}

/**
 * Gets a list of missing environment variables
 */
export async function getMissingEnvVars() {
  const result = await initializeApp();
  return result.missing;
} 