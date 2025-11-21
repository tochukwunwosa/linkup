/**
 * Centralized Configuration
 *
 * This file exports all environment variables and API keys in a type-safe manner.
 * All environment variable access should go through this config object.
 */

// Helper function to get required env variable
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Helper function to get optional env variable
function getOptionalEnv(key: string, defaultValue = ""): string {
  return process.env[key] || defaultValue;
}

export const config = {
  // Supabase
  supabase: {
    url: getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  },

  // Google Maps API
  googleMaps: {
    clientKey: getOptionalEnv("NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_KEY"),
    serverKey: getRequiredEnv("GOOGLE_MAPS_SERVER_KEY"),
  },

  // Resend (Email Service)
  resend: {
    apiKey: getRequiredEnv("RESEND_API_KEY"),
    replyToEmail: getOptionalEnv("REPLY_TO_EMAIL", "noreply@tech-linkup.vercel.app"),
  },

  // Security
  security: {
    initialSetupToken: getRequiredEnv("INITIAL_SETUP_TOKEN"),
    cronSecret: getRequiredEnv("CRON_SECRET"),
  },

  // Site Configuration
  site: {
    url: getRequiredEnv("NEXT_PUBLIC_SITE_URL"),
    umamiWebsiteId: getRequiredEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID"),
  },

  // Runtime Environment
  env: {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
  },
} as const;

// Export individual configs for convenience
export const { supabase, googleMaps, resend, security, site, env } = config;

// Export default
export default config;
