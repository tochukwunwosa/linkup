import type { Metadata, Viewport } from "next";

const APP_NAME = "LinkUp";
const APP_DEFAULT_TITLE = "LinkUp";
const APP_TITLE_TEMPLATE = "%s | LinkUp";
const APP_DESCRIPTION =
  "LinkUp is your ultimate platform for discovering and connecting with tech events happening around you.";

// Viewport configuration (required by Next.js 15+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0066cc" },
    { media: "(prefers-color-scheme: dark)", color: "#0066cc" },
  ],
};

export const siteConfig: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/assets/images/linkup-og-image-1200x600.jpg",
        alt: "LinkUp OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/assets/images/linkup-og-image-1200x600.jpg",
        alt: "LinkUp Twitter Image",
      },
    ],
  },
  icons: {
    icon: "/assets/Logo/linkup-logo.png",
    shortcut: "/favicon.ico",
  },
};

export function createMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    ...siteConfig,
    ...overrides,
  };
}

//Usage
// import { createMetadata } from "@/lib/metadata";

// export const metadata = createMetadata({
//   title: "Custom Page Title",
//   description: "Custom page description",
// });
