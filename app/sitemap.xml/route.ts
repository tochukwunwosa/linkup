import { siteConfig } from "@/lib/metadata";

type SitemapPage = {
  loc: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
};

export async function GET() {
  const siteUrl = siteConfig.metadataBase?.toString() ?? "https://tech-linkup.vercel.app";

  const pages: SitemapPage[] = [
    { loc: siteUrl, changefreq: "daily", priority: 1, lastmod: new Date().toISOString() },
    { loc: `${siteUrl}/about`, changefreq: "monthly", priority: 0.7 },
    { loc: `${siteUrl}/contact`, changefreq: "monthly", priority: 0.7 },
  ];

   // dynamically fetch events from DB
  // const events = await fetchEvents();
  // events.forEach(e => pages.push({
  //   loc: `${siteUrl}/events/${e.id}`,
  //   changefreq: "weekly",
  //   lastmod: e.updatedAt,
  //   priority: 0.8,
  // }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${page.loc}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
    )
    .join("")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
