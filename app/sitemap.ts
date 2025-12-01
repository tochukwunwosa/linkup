import { NextResponse } from "next/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<NextResponse> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/submit-event`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/my-submissions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map((route) => {
      const lastmod =
        route.lastModified instanceof Date
          ? route.lastModified.toISOString()
          : route.lastModified
            ? new Date(route.lastModified).toISOString()
            : new Date().toISOString();
      return `<url>
  <loc>${route.url}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>${route.changeFrequency}</changefreq>
  <priority>${route.priority}</priority>
</url>`;
    })
    .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
