const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

const urls = [
  { loc: siteUrl, changefreq: "daily", priority: "1.0" },
  { loc: `${siteUrl}/about`, changefreq: "monthly", priority: "0.8" },
  { loc: `${siteUrl}/contact`, changefreq: "monthly", priority: "0.7" },
  { loc: `${siteUrl}/submit-event`, changefreq: "weekly", priority: "0.9" },
  { loc: `${siteUrl}/my-submissions`, changefreq: "weekly", priority: "0.6" },
  { loc: `${siteUrl}/privacy-policy`, changefreq: "yearly", priority: "0.3" },
  { loc: `${siteUrl}/terms-of-use`, changefreq: "yearly", priority: "0.3" },
];

export async function GET() {
  const lastmod = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200",
      "X-Robots-Tag": "noindex",
    },
  });
}
