import { discoverEventUrls } from "./discovery";

// Luma event pages live at short alphanumeric codes off the domain root
// (e.g. lu.ma/0r4q2gkj), which also carries a full Event JSON-LD block.
// Verified against a live fetch of the /discover and /lagos pages.
const LISTING_URLS = ["https://lu.ma/discover", "https://lu.ma/lagos"];

const EVENT_URL_PATTERN = /^https:\/\/lu\.ma\/[a-z0-9]{6,12}$/i;

// The same 6-12 char shape also matches a handful of static Luma routes;
// exclude the ones observed on the pages above.
const STATIC_PATHS = new Set(["discover", "signin", "pricing", "create", "explore", "settings", "lagos"]);

export async function fetchCandidateUrls(): Promise<string[]> {
  const urls = await discoverEventUrls(
    LISTING_URLS.map((listingUrl) => ({ listingUrl, hrefPattern: EVENT_URL_PATTERN }))
  );
  return urls.filter((url) => !STATIC_PATHS.has(url.replace("https://lu.ma/", "").toLowerCase()));
}
