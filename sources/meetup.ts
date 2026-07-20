import { discoverEventUrls } from "./discovery";

// Meetup's /find search results are server-rendered with direct links to
// individual event pages (which carry Event JSON-LD). categoryId=546 is
// Meetup's "Tech" category. Verified against a live fetch for Lagos.
const LISTING_URLS = [
  "https://www.meetup.com/find/?location=ng--Lagos&source=EVENTS&categoryId=546",
  "https://www.meetup.com/find/?location=ng--Abuja&source=EVENTS&categoryId=546",
];

const EVENT_URL_PATTERN = /^https:\/\/www\.meetup\.com\/[a-z0-9-]+\/events\/\d+\/?$/i;

export async function fetchCandidateUrls(): Promise<string[]> {
  return discoverEventUrls(LISTING_URLS.map((listingUrl) => ({ listingUrl, hrefPattern: EVENT_URL_PATTERN })));
}
