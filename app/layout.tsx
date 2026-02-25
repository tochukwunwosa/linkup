import type React from "react";
import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { siteConfig, viewport as siteViewport } from "@/lib/metadata";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/structured-data";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["700", "800"] });

export const metadata: Metadata = siteConfig;
export const viewport = siteViewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cloud.umami.is" />
        <link rel="dns-prefetch" href="https://cloud.umami.is" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        {/* Static LD+JSON — rendered in initial HTML so crawlers see them immediately */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${syne.variable}`}>
        <Script
          id="umami-script"
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
        <QueryProvider>
          <div>
            {children}
          </div>
          <Toaster richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
