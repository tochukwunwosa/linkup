// UTM tags for links we send out, so Umami can show which channel brought a
// visitor. Pages declare canonical URLs, so tagged links don't create
// duplicate pages for search engines.
//
// Naming: source = where the link lives, medium = the kind of channel,
// campaign = which message or feature.

export interface Utm {
  source: string;
  medium: string;
  campaign: string;
  /** Optional detail, e.g. which calendar feed. */
  content?: string;
}

export const UTM = {
  whatsappChannel: { source: "whatsapp", medium: "channel", campaign: "weekly_digest" },
  weeklyEmail: { source: "email", medium: "email", campaign: "weekly_digest" },
  organiserConfirmation: { source: "email", medium: "email", campaign: "organiser_confirmation" },
  organiserApproved: { source: "email", medium: "email", campaign: "organiser_approved" },
  organiserRejected: { source: "email", medium: "email", campaign: "organiser_rejected" },
  calendarFeed: { source: "calendar", medium: "calendar_feed", campaign: "calendar_subscription" },
  addToCalendar: { source: "calendar", medium: "add_to_calendar", campaign: "event" },
} satisfies Record<string, Utm>;

/** Share links: source is where the link was shared. */
export const shareUtm = (source: "whatsapp" | "x" | "copy" | "native"): Utm => ({
  source,
  medium: "share",
  campaign: "event_share",
});

/** Adds UTM parameters to an absolute URL, keeping any existing query. */
export function withUtm(url: string, utm: Utm): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", utm.source);
  u.searchParams.set("utm_medium", utm.medium);
  u.searchParams.set("utm_campaign", utm.campaign);
  if (utm.content) u.searchParams.set("utm_content", utm.content);
  return u.toString();
}
