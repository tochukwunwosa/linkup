import type { Metadata, Viewport } from "next";

const APP_NAME = "TechLinkUp";
const APP_DEFAULT_TITLE = "TechLinkUp - Community-Driven Tech Event Discovery in Nigeria";
const APP_TITLE_TEMPLATE = "%s | TechLinkUp";
const APP_DESCRIPTION =
  "Discover tech events across Nigeria — conferences, meetups, hackathons, and workshops in Lagos, Abuja, and all 36 states. Submit your event for free.";

export const APP_KEYWORDS = [
  // Core keywords
  "tech events in Nigeria",
  "Nigerian tech events",
  "tech community Nigeria",
  "tech conferences Nigeria",
  "tech meetups in Nigeria",
  "developer events Nigeria",
  "startup events Nigeria",
  "tech workshops Nigeria",
  "Nigeria tech ecosystem",
  "community events platform",
  "find tech events Nigeria",
  "upcoming tech events Nigeria",
  "hackathons Nigeria",
  "AI events Nigeria",
  "developer community Nigeria",
  "coding bootcamp events Nigeria",
  "design meetups Nigeria",
  "product management events Nigeria",
  "startup networking events Nigeria",

  // Lagos & South West
  "Lagos tech events",
  "Ikeja tech events",
  "Ogun tech events",
  "Abeokuta tech events",
  "Oyo tech events",
  "Ibadan tech events",
  "Osun tech events",
  "Osogbo tech events",
  "Ekiti tech events",
  "Ado-Ekiti tech events",
  "Ondo tech events",
  "Akure tech events",

  // Abuja & North Central
  "Abuja tech events",
  "Abuja developer events",
  "Nasarawa tech events",
  "Lafia tech events",
  "Plateau tech events",
  "Jos tech events",
  "Kogi tech events",
  "Lokoja tech events",
  "Niger tech events",
  "Minna tech events",
  "Kwara tech events",
  "Ilorin tech events",

  // South East
  "Anambra tech events",
  "Awka tech events",
  "Enugu tech events",
  "Abia tech events",
  "Umuahia tech events",
  "Ebonyi tech events",
  "Abakaliki tech events",
  "Imo tech events",
  "Owerri tech events",

  // South South
  "Rivers tech events",
  "Port Harcourt tech events",
  "Delta tech events",
  "Asaba tech events",
  "Bayelsa tech events",
  "Yenagoa tech events",
  "Edo tech events",
  "Benin City tech events",
  "Cross River tech events",
  "Calabar tech events",
  "Akwa Ibom tech events",
  "Uyo tech events",

  // North West
  "Kano tech events",
  "Kaduna tech events",
  "Katsina tech events",
  "Jigawa tech events",
  "Dutse tech events",
  "Sokoto tech events",
  "Kebbi tech events",
  "Birnin Kebbi tech events",
  "Zamfara tech events",
  "Gusau tech events",

  // North East
  "Gombe tech events",
  "Adamawa tech events",
  "Yola tech events",
  "Borno tech events",
  "Maiduguri tech events",
  "Taraba tech events",
  "Jalingo tech events",
  "Yobe tech events",
  "Damaturu tech events",

  // Long-tail niche keywords (high conversion)
  "best tech events in Nigeria",
  "where to find tech events in Nigeria",
  "Nigeria startup ecosystem events",
  "tech conferences near me Nigeria",
  "local tech communities Nigeria",
  "Nigeria dev community events",
  "tech event discovery platform Nigeria",
  "free tech events Nigeria",
  "paid tech events Nigeria",
  "Nigeria technology meetups",
  "software engineering events Nigeria",
  "frontend developer meetups Nigeria",
  "backend developer meetups Nigeria",
  "React developer events Nigeria",
  "AI and ML events Nigeria",
  "web3 events Nigeria",
  "blockchain events Nigeria",
  "women in tech events Nigeria",
  "youth tech events Nigeria",
];


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
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
  alternates: {
    canonical: "/",
  },
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
        url: "/linkup-og-image-1200x630.avif",
        width: 1200,
        height: 630,
        alt: "TechLinkUp - Community-Driven Tech Event Discovery in Nigeria",
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
        url: "/linkup-og-image-1200x630.avif",
        width: 1200,
        height: 630,
        alt: "TechLinkUp - Community-Driven Tech Event Discovery in Nigeria",
      },
    ],
  },
  icons: {
    icon: "/logo.png",
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
