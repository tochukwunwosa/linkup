import { siteConfig } from "@/lib/metadata";

type SitemapPage = {
  loc: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
};

// Helper to ensure full URLs without double slashes
const joinUrl = (base: string, path: string) => new URL(path, base).toString();

export async function GET() {
  const siteUrl = siteConfig.metadataBase?.toString() || "https://tech-linkup.vercel.app";

  const pages: SitemapPage[] = [
    { loc: joinUrl(siteUrl, "/"), changefreq: "daily", priority: 1, lastmod: new Date().toISOString() },
    { loc: joinUrl(siteUrl, "about"), changefreq: "monthly", priority: 0.7 },
    { loc: joinUrl(siteUrl, "contact"), changefreq: "monthly", priority: 0.7 },
  ];

  // Optional: fetch dynamic events
  // const events = await fetchEvents();
  // events.forEach(e => pages.push({
  //   loc: joinUrl(siteUrl, `/events/${e.id}`),
  //   changefreq: "weekly",
  //   lastmod: e.updatedAt,
  //   priority: 0.8,
  // }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `<url>
    <loc>${page.loc}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
