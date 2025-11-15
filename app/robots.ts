import { MetadataRoute } from "next";

/**
 * Robots.txt configuration for crawler access
 * Allows all crawlers to access public pages while protecting admin routes
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://techup-linkup.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
      },
      // Special rules for major search engines
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
        crawlDelay: 0,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
        crawlDelay: 0,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
