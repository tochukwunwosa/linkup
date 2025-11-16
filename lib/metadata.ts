import type { Metadata, Viewport } from "next";

const APP_NAME = "LinkUp";
const APP_DEFAULT_TITLE = "LinkUp - Community-Driven Tech Event Discovery in Nigeria";
const APP_TITLE_TEMPLATE = "%s | LinkUp";
const APP_DESCRIPTION =
  "Discover and connect with tech events across Nigeria through our community-driven platform.";
const APP_KEYWORDS = [
  "Nigeria tech events",
  "tech community Nigeria",
  "community-driven events",
  "tech conferences Nigeria",
  "tech meetups",
  "Nigerian tech ecosystem",
  "developer events Nigeria",
  "startup events",
  "tech workshops Nigeria",
  "Lagos tech events",
  "Abuja tech events",
  "community events platform",
  "Abia tech events",
  "Umuahia tech events",
  "Adamawa tech events",
  "Yola tech events",
  "Akwa Ibom tech events",
  "Uyo tech events",
  "Anambra tech events",
  "Awka tech events",
  "Bauchi tech events",
  "Bauchi tech events",
  "Bayelsa tech events",
  "Yenagoa tech events",
  "Benue tech events",
  "Makurdi tech events",
  "Borno tech events",
  "Maiduguri tech events",
  "Cross River tech events",  
  "Calabar tech events",
  "Delta tech events",
  "Asaba tech events",
  "Ebonyi tech events",
  "Abakaliki tech events",
  "Edo tech events", 
  "Benin City tech events",
  "Ekiti tech events", 
  "Ado-Ekiti tech events",
  "Enugu tech events", 
  "Enugu tech events",
  "Gombe tech events", 
  "Gombe tech events",
  "Imo tech events", 
  "Owerri tech events",
  "Jigawa tech events",
  "Dutse tech events",
  "Kaduna tech events",
  "Kaduna tech events",
  "Kano tech events",
  "Kano tech events",
  "Katsina tech events",
  "Katsina tech events",
  "Kebbi tech events",
  "Birnin Kebbi tech events",
  "Kogi tech events",
  "Lokoja tech events",
  "Kwara tech events",
  "Ilorin tech events",
  "Lagos tech events",
  "Ikeja tech events",
  "Nasarawa tech events",
  "Lafia tech events",
  "Niger tech events",
  "Minna tech events",
  "Ogun tech events",
  "Abeokuta tech events",
  "Ondo tech events",
  "Akure tech events",
  "Osun tech events",
  "Osogbo tech events",
  "Oyo tech events",
  "Ibadan tech events",
  "Plateau tech events",
  "Jos tech events",
  "Rivers tech events",
  "Port Harcourt tech events",
  "Sokoto tech events",
  "Sokoto tech events",
  "Taraba tech events",
  "Jalingo tech events",
  "Yobe tech events",
  "Damaturu tech events",
  "Zamfara tech events",
  "Gusau tech events",
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
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
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
        url: "/assets/images/linkup-og-image-1200x600.webp",
        width: 1200,
        height: 630,
        alt: "LinkUp - Community-Driven Tech Event Discovery in Nigeria",
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
        url: "/assets/images/linkup-og-image-1200x600.webp",
        width: 1200,
        height: 630,
        alt: "LinkUp - Community-Driven Tech Event Discovery in Nigeria",
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
