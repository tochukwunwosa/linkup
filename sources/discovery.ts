import * as cheerio from "cheerio";
import { fetchHtml } from "./genericExtractor";

export type DiscoveryRule = {
  listingUrl: string;
  hrefPattern: RegExp; // tested against the absolute URL with query/hash stripped
};

// Shared listing-page link discovery used by every connector: fetch a
// listing/search page, scan its anchor tags, and keep hrefs matching a
// source-specific event-URL shape. Validated against real HTML from
// Eventbrite, Luma, Meetup, and the Bevy platform (GDG/Startup Grind) — all
// four render their event links as plain server-side <a href> tags even
// though the surrounding page is a JS-hydrated SPA.
export async function discoverEventUrls(rules: DiscoveryRule[]): Promise<string[]> {
  const results = await Promise.all(
    rules.map(async (rule) => {
      const html = await fetchHtml(rule.listingUrl);
      if (!html) return [];

      const $ = cheerio.load(html);
      const found = new Set<string>();

      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;
        try {
          const absolute = new URL(href, rule.listingUrl).toString().split("?")[0].split("#")[0];
          if (rule.hrefPattern.test(absolute)) found.add(absolute);
        } catch {
          // malformed href — ignore
        }
      });

      return Array.from(found);
    })
  );

  return Array.from(new Set(results.flat()));
}
