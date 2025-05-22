// Environment variables validation and access
// This file provides centralized access to environment variables with validation

// Define required environment variables
const REQUIRED_ENV_VARS = [
  'OPENAI_API_KEY',
  'GEMINI_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
] as const;

// Define all environment variables including optional ones
const ENV_VARS = [
  ...REQUIRED_ENV_VARS,
  // Add optional environment variables here
] as const;

// Type definition for environment variables
type EnvVar = typeof ENV_VARS[number];
type RequiredEnvVar = typeof REQUIRED_ENV_VARS[number];

// Interface for environment validation result
interface EnvValidationResult {
  valid: boolean;
  missing: RequiredEnvVar[];
}

/**
 * Validates that all required environment variables are present
 * @returns Validation result with missing variables if any
 */
export function validateEnv(): EnvValidationResult {
  const missing: RequiredEnvVar[] = [];

  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
      console.error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Checks if a specific environment variable is available
 * @param name Name of the environment variable
 * @returns boolean indicating if the variable is set
 */
export function hasEnv(name: EnvVar): boolean {
  return !!process.env[name];
}

/**
 * Gets an environment variable value with optional fallback
 * @param name Name of the environment variable
 * @param fallback Optional fallback value if variable is not set
 * @returns The environment variable value or fallback
 */
export function getEnv(name: EnvVar, fallback?: string): string {
  return process.env[name] || fallback || '';
}

/**
 * Gets a required environment variable, throws error if not available
 * @param name Name of the required environment variable
 * @returns The environment variable value
 * @throws Error if environment variable is not set
 */
export function getRequiredEnv(name: RequiredEnvVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

/**
 * Helper to check if specific features are available based on environment variables
 */
export const features = {
  hasOpenAI: () => hasEnv('OPENAI_API_KEY'),
  hasGemini: () => hasEnv('GEMINI_API_KEY'),
  hasSupabase: () => hasEnv('NEXT_PUBLIC_SUPABASE_URL') && hasEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
};

/**
 * Helper to get configured API keys and endpoints
 */
export const apiKeys = {
  openai: () => getEnv('OPENAI_API_KEY'),
  gemini: () => getEnv('GEMINI_API_KEY'),
  supabaseUrl: () => getEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: () => getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
}; 