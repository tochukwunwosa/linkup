/**
 * Structured Data (JSON-LD) Helpers for SEO
 * Generates schema.org markup for rich snippets in search results
 */

import { Event as EventType } from "./validations/event";


/**
 * Generate Organization schema for the site
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TechLinkUp",
    alternateName: "TechLinkUp",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz"}/assets/Logo/LinkUp-Logo-80x35.png`,
    description:
      "Community-driven platform for discovering and connecting with tech events across Nigeria",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
    },
    sameAs: [
      // Add social media profiles when available
      // "https://twitter.com/linkup",
      // "https://linkedin.com/company/linkup",
    ],
  };
}

/**
 * Generate WebSite schema for search box
 */
export function generateWebSiteSchema() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TechLinkUp - Community-Driven Tech Event Discovery in Nigeria",
    alternateName: "TechLinkUp",
    url: siteUrl,
    description:
      "Discover and connect with tech events across Nigeria through our community-driven platform",
    // No SearchAction: Google retired the sitelinks search box, and its
    // template made Google crawl /?search={search_term_string} as a page.
  };
}

/**
 * ISO 8601 date-time for an event date and "HH:MM" time in WAT (UTC+1).
 * Falls back to the date alone when the time isn't usable (e.g. "TBA").
 */
function toWatDateTime(date: string, time?: string | null, fallbackTime?: string): string {
  const day = date.slice(0, 10);
  const match = /^(\d{1,2}):(\d{2})/.exec((time || fallbackTime || "").trim());
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return day;
  return `${day}T${match[1].padStart(2, "0")}:${match[2]}:00+01:00`;
}

/**
 * Generate Event schema for individual events
 */
export function generateEventSchema(event: EventType) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

  // Determine event attendance mode
  let eventAttendanceMode = "https://schema.org/OfflineEventAttendanceMode";
  if (event.type === "Online") {
    eventAttendanceMode = "https://schema.org/OnlineEventAttendanceMode";
  } else if (event.type === "In-person & Online") {
    eventAttendanceMode = "https://schema.org/MixedEventAttendanceMode";
  }

  // Build location object
  let location:
    | {
        "@type": "Place";
        name: string;
        address?: {
          "@type": "PostalAddress";
          addressLocality?: string;
          addressCountry?: string;
        };
        geo?: {
          "@type": "GeoCoordinates";
          latitude: number;
          longitude: number;
        };
      }
    | {
        "@type": "VirtualLocation";
        url: string;
      };

  if (event.type === "Online") {
    location = {
      "@type": "VirtualLocation",
      url: event.link || siteUrl,
    };
  } else {
    location = {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city || undefined,
        addressCountry: event.country || "Nigeria",
      },
    };

    // Add geo coordinates if available
    if (event.lat && event.lng) {
      location.geo = {
        "@type": "GeoCoordinates",
        latitude: parseFloat(event.lat.toString()),
        longitude: parseFloat(event.lng.toString()),
      };
    }
  }

  // Build offers object (price information)
  const offers: {
    "@type": "Offer";
    url?: string;
    price?: string;
    priceCurrency?: string;
    availability?: string;
    validFrom?: string;
  } = {
    "@type": "Offer",
    url: event.link || `${siteUrl}/events/${event.slug}`,
    availability: "https://schema.org/InStock",
    validFrom: event.start_date || new Date().toISOString(),
  };

  // Add price if available
  if (event.price_amount && event.price_amount !== "0") {
    offers.price = event.price_amount;
    offers.priceCurrency = event.currency || "NGN";
  } else if (event.price?.toLowerCase().includes("free")) {
    offers.price = "0";
    offers.priceCurrency = event.currency || "NGN";
  }

  const schema: {
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    eventAttendanceMode: string;
    eventStatus: string;
    location:
      | {
          "@type": "Place";
          name: string;
          address?: {
            "@type": "PostalAddress";
            addressLocality?: string;
            addressCountry?: string;
          };
          geo?: {
            "@type": "GeoCoordinates";
            latitude: number;
            longitude: number;
          };
        }
      | {
          "@type": "VirtualLocation";
          url: string;
        };
    organizer: {
      "@type": string;
      name: string;
      url: string;
    };
    offers: {
      "@type": "Offer";
      url?: string;
      price?: string;
      priceCurrency?: string;
      availability?: string;
      validFrom?: string;
    };
    url?: string;
    category?: string[];
    image: string[];
  } = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    // Stored times are WAT. new Date() here would read them as server time
    // (UTC on Vercel) and shift every event by an hour, and throw on "TBA".
    startDate: toWatDateTime(event.start_date, event.time),
    // Same image as the share preview, at a stable URL (see events/[slug]/og.png).
    image: [`${siteUrl}/events/${event.slug}/og.png`],
    eventAttendanceMode,
    eventStatus: "https://schema.org/EventScheduled",
    location,
    organizer: {
      "@type": "Organization",
      name: "TechLinkUp",
      url: siteUrl,
    },
    offers,
  };

  // Add end date if available
  if (event.end_date) {
    // End time isn't stored; end of the last day keeps endDate after startDate.
    schema.endDate = toWatDateTime(event.end_date, "23:59");
  }

  // Add event URL if available
  if (event.link) {
    schema.url = event.link;
  }

  // Add categories if available
  if (event.category && event.category.length > 0) {
    schema.category = event.category;
  }

  return schema;
}

/**
 * Generate ItemList schema for event listings
 */
export function generateEventListSchema(events: EventType[]) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tech Events in Nigeria",
    url: siteUrl,
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/events/${event.slug}`,
      name: event.title,
    })),
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
