import { MetadataRoute } from "next";

export const revalidate = 3600; // revalidate every hour

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://tech-linkup.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // ---- OPTIONAL DYNAMIC EVENT PAGES ----
  // When you create /events/[id], uncomment this:
  //
  // const eventPages = events.map(event => ({
  //   url: `${siteUrl}/events/${event.id}`,
  //   lastModified: new Date(event.updated_at).toISOString(),
  //   changeFrequency: "weekly",
  //   priority: 0.7,
  // }));
  //
  // return [...staticPages, ...eventPages];

  return staticPages;
}
