import { discoverEventUrls } from "./discovery";

// CcHub does NOT have a confirmed dedicated events listing page —
// cchubnigeria.com/events/ 404s, and the homepage's server-rendered HTML
// carries no obvious event links (unlike Eventbrite/Luma/Meetup/Bevy, whose
// listing pages were verified live). This connector is a best-effort stub:
// it scans the homepage for any same-domain link mentioning "event" and
// will likely return zero results until someone finds CcHub's actual
// events page (they may run events primarily through Eventbrite/Luma
// instead, which the other connectors would already pick up).
const LISTING_URLS = ["https://cchubnigeria.com/"];

const EVENT_URL_PATTERN = /^https:\/\/(www\.)?cchubnigeria\.com\/.*event.*$/i;

export async function fetchCandidateUrls(): Promise<string[]> {
  return discoverEventUrls(LISTING_URLS.map((listingUrl) => ({ listingUrl, hrefPattern: EVENT_URL_PATTERN })));
}
