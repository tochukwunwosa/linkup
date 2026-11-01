import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Precache the offline page; it is the fallback when a page can't load.
  additionalPrecacheEntries: [
    { url: "/offline", revision: process.env.VERCEL_GIT_COMMIT_SHA ?? crypto.randomUUID() },
    // Saved events are stored on the device, so this page can work offline too.
    { url: "/saved", revision: process.env.VERCEL_GIT_COMMIT_SHA ?? crypto.randomUUID() },
  ],
  reloadOnOnline: true,
  // A service worker in dev caches stale code and gets in the way.
  disable: process.env.NODE_ENV === "development",
});


const nextConfig: NextConfig = {
  // Explicitly set Turbopack root to silence warning about multiple lockfiles
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [new URL("https://res.cloudinary.com/**"), new URL("https://techlinkup.xyz/**")],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons", "recharts", "date-fns"],
  },
  env: {
    // Only expose NEXT_PUBLIC_ variables here - server secrets are accessed via process.env directly
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_KEY,
  },
  async headers() {
    return [
      {
        // Exclude sitemap.xml and robots.txt from security headers
        source: "/((?!sitemap\\.xml|robots\\.txt).*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' cloud.umami.is",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://maps.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=3600",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
  async redirects() {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'www.techlinkup.xyz',
            },
          ],
          destination: 'https://techlinkup.xyz/:path*',
          permanent: true,
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'tech-linkup.vercel.app',
            },
          ],
          destination: 'https://techlinkup.xyz/:path*',
          permanent: true,
        },
      ];
    },
};

// Required environment variables for MVP
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_UMAMI_WEBSITE_ID",
  "RESEND_API_KEY",
  "CRON_SECRET",
  "INITIAL_SETUP_TOKEN",
  "GOOGLE_MAPS_SERVER_KEY",
  "NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_KEY"
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is missing`);
  }
});

export default withSerwist(nextConfig);
