import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

/**
 * Dynamic sitemap for SEO
 * Generates sitemap with all published events and static pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://techup-linkup.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/admin/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    // Fetch all published events
    const supabase = await createClient();
    const { data: events } = await supabase
      .from("public_events")
      .select("id, title, created_at, start_date")
      .order("created_at", { ascending: false });

    if (!events || events.length === 0) {
      return staticPages;
    }

    // Generate event entries
    // Note: Currently events don't have dedicated pages, so we link to home page with hash
    // In the future, if you create individual event pages at /events/[id], update this
    const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
      url: `${siteUrl}/#event-${event.id}`,
      lastModified: new Date(event.created_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...eventPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static pages if database query fails
    return staticPages;
  }
}
