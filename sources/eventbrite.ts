import { discoverEventUrls } from "./discovery";

// Eventbrite's location+category browse pages are server-rendered with
// direct <a href> links to individual event pages, each of which carries a
// SocialEvent/Event JSON-LD block. Verified against a live fetch of the
// Lagos "tech" category page.
const LISTING_URLS = [
  "https://www.eventbrite.com/d/nigeria--lagos/tech/",
  "https://www.eventbrite.com/d/nigeria--abuja/tech/",
];

const EVENT_URL_PATTERN = /^https:\/\/www\.eventbrite\.com\/e\/[a-z0-9-]+-tickets-\d+\/?$/i;

export async function fetchCandidateUrls(): Promise<string[]> {
  return discoverEventUrls(LISTING_URLS.map((listingUrl) => ({ listingUrl, hrefPattern: EVENT_URL_PATTERN })));
}
