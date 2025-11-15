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
    name: "LinkUp",
    alternateName: "Tech LinkUp",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://techup-linkup.vercel.app",
    logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://techup-linkup.vercel.app"}/assets/Logo/linkup-logo.png`,
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
    process.env.NEXT_PUBLIC_APP_URL || "https://techup-linkup.vercel.app";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LinkUp - Community-Driven Tech Event Discovery in Nigeria",
    alternateName: "Tech LinkUp",
    url: siteUrl,
    description:
      "Discover and connect with tech events across Nigeria through our community-driven platform",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Event schema for individual events
 */
export function generateEventSchema(event: EventType) {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://techup-linkup.vercel.app";

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
    url: event.link || `${siteUrl}/#event-${event.id}`,
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
  } = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: new Date(
      `${event.start_date}T${event.time || "00:00"}`
    ).toISOString(),
    eventAttendanceMode,
    eventStatus: "https://schema.org/EventScheduled",
    location,
    organizer: {
      "@type": "Organization",
      name: "LinkUp",
      url: siteUrl,
    },
    offers,
  };

  // Add end date if available
  if (event.end_date) {
    schema.endDate = new Date(
      `${event.end_date}T${event.time || "23:59"}`
    ).toISOString();
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
    process.env.NEXT_PUBLIC_APP_URL || "https://techup-linkup.vercel.app";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.title,
        url: event.link || `${siteUrl}/#event-${event.id}`,
        startDate: new Date(
          `${event.start_date}T${event.time || "00:00"}`
        ).toISOString(),
      },
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
