import { discoverEventUrls } from "./discovery";

// GDG chapters run on Google's Bevy-based community platform. Each chapter
// page links to /events/details/<slug>/ pages carrying Event JSON-LD.
// Verified against live fetches of gdg-lagos and gdg-abuja; add more
// Nigerian chapter slugs here as they're confirmed reachable
// (community.dev slugs vary per chapter and aren't all guessable).
const CHAPTER_SLUGS = ["gdg-lagos", "gdg-abuja"];

const EVENT_URL_PATTERN = /^https:\/\/gdg\.community\.dev\/events\/details\/[a-z0-9-]+\/?$/i;

export async function fetchCandidateUrls(): Promise<string[]> {
  const listingUrls = CHAPTER_SLUGS.map((slug) => `https://gdg.community.dev/${slug}/`);
  return discoverEventUrls(listingUrls.map((listingUrl) => ({ listingUrl, hrefPattern: EVENT_URL_PATTERN })));
}
