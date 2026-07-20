import { discoverEventUrls } from "./discovery";

// Startup Grind also runs on the Bevy community platform (same shape as
// GDG's /events/details/<slug>/ pages, each carrying Event JSON-LD).
// Verified against a live fetch of the Lagos chapter page.
const CHAPTER_SLUGS = ["lagos"];

const EVENT_URL_PATTERN = /^https:\/\/www\.startupgrind\.com\/events\/details\/[a-z0-9-]+\/?$/i;

export async function fetchCandidateUrls(): Promise<string[]> {
  const listingUrls = CHAPTER_SLUGS.map((slug) => `https://www.startupgrind.com/${slug}/`);
  return discoverEventUrls(listingUrls.map((listingUrl) => ({ listingUrl, hrefPattern: EVENT_URL_PATTERN })));
}
