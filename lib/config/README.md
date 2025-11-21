# Configuration Management

This folder contains the centralized configuration system for the Tech Linkup application.

## Overview

All environment variables and API keys are managed through the `config` object exported from `lib/config/index.ts`. This provides:

- **Type safety**: All config values are typed
- **Centralized access**: Single source of truth for all environment variables
- **Better error messages**: Clear errors when required env vars are missing
- **Easier refactoring**: Change env var names in one place

## Usage

### Importing the config

```typescript
import { config } from "@/lib/config";

// Or import specific sections
import { googleMaps, resend, supabase } from "@/lib/config";
```

### Accessing configuration values

```typescript
// Google Maps API
const apiKey = config.googleMaps.serverKey;
const clientKey = config.googleMaps.clientKey;

// Supabase
const supabaseUrl = config.supabase.url;
const anonKey = config.supabase.anonKey;

// Email service
const resendKey = config.resend.apiKey;
const replyTo = config.resend.replyToEmail;

// Security
const cronSecret = config.security.cronSecret;
const setupToken = config.security.initialSetupToken;

// Site info
const siteUrl = config.site.url;
const umamiId = config.site.umamiWebsiteId;

// Environment checks
if (config.env.isDevelopment) {
  // Development-only code
}
```

## Configuration Structure

```typescript
config = {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  googleMaps: {
    clientKey: string;  // Optional, for client-side usage
    serverKey: string;  // Required, for server-side API calls
  };
  resend: {
    apiKey: string;
    replyToEmail: string;  // Has default fallback
  };
  security: {
    initialSetupToken: string;
    cronSecret: string;
  };
  site: {
    url: string;
    umamiWebsiteId: string;
  };
  env: {
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
  };
};
```

## Required Environment Variables

The following environment variables are required and will throw an error if missing:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_MAPS_SERVER_KEY`
- `RESEND_API_KEY`
- `INITIAL_SETUP_TOKEN`
- `CRON_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`

## Optional Environment Variables

- `NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_KEY` - For client-side Google Maps usage (future use)
- `REPLY_TO_EMAIL` - Custom reply-to email (defaults to noreply@tech-linkup.vercel.app)

## Best Practices

### ✅ DO

```typescript
import { config } from "@/lib/config";

const apiKey = config.googleMaps.serverKey;
```

### ❌ DON'T

```typescript
// Don't access process.env directly
const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY;
```

## Adding New Configuration

To add a new configuration value:

1. Add the environment variable to `.env.example`
2. Add it to `lib/config/index.ts`:

```typescript
export const config = {
  // ... existing config
  myNewService: {
    apiKey: getRequiredEnv("MY_NEW_SERVICE_API_KEY"),
    endpoint: getOptionalEnv("MY_NEW_SERVICE_ENDPOINT", "https://default.com"),
  },
};
```

3. Update this README with the new configuration
4. Use it in your code: `config.myNewService.apiKey`

## Error Handling

If a required environment variable is missing, the application will throw an error at startup:

```
Error: Missing required environment variable: GOOGLE_MAPS_SERVER_KEY
```

This fail-fast approach ensures configuration issues are caught early.
