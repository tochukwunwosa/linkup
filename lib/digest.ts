import { Event } from "@/lib/validations/event";
import { formatCurrency } from "@/lib/format-currency";
import { formatTo12Hour } from "@/lib/utils";
import { locationMeta } from "@/constants/location-meta";

// Weekly "this week in tech" digest: the WhatsApp Channel post and the
// weekly email alerts.

// The WhatsApp builder offers these; email alerts use any location-meta slug.
export type DigestArea = "all" | "online" | "lagos" | "abuja";

export const DIGEST_AREAS: { value: DigestArea; label: string }[] = [
  { value: "all", label: "All of Nigeria" },
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "online", label: "Online" },
];

// Keep posts short enough to read on a phone; the rest go behind a link.
export const DIGEST_MAX_EVENTS = 8;

export { addDays } from "@/lib/date-utils";

/**
 * Events running at any point in [from, to] (inclusive), for the chosen area:
 * "all", "online", or a state slug from location-meta.
 */
export function filterDigestEvents(
  events: Event[],
  area: DigestArea | string,
  from: string,
  to: string
): Event[] {
  const searchTerm = locationMeta.find((l) => l.slug === area)?.searchTerm.toLowerCase();

  return events
    .filter((e) => {
      const start = e.start_date.slice(0, 10);
      const end = (e.end_date || e.start_date).slice(0, 10);
      return start <= to && end >= from;
    })
    .filter((e) => {
      if (area === "all") return true;
      if (area === "online") return e.type !== "In-person";
      // Same matching as /location/[state]
      return (
        !!searchTerm &&
        e.type !== "Online" &&
        `${e.location} ${e.city ?? ""}`.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => a.start_date.localeCompare(b.start_date) || a.time.localeCompare(b.time));
}

/** Events for one email subscriber: their state, plus online events if chosen. */
export function eventsForSubscriber(
  events: Event[],
  state: string,
  includeOnline: boolean,
  from: string,
  to: string
): Event[] {
  const inState = filterDigestEvents(events, state, from, to);
  if (!includeOnline) return inState;

  const ids = new Set(inState.map((e) => e.id));
  const online = filterDigestEvents(events, "online", from, to).filter((e) => !ids.has(e.id));
  return [...inState, ...online].sort(
    (a, b) => a.start_date.localeCompare(b.start_date) || a.time.localeCompare(b.time)
  );
}

export function formatDay(date: string): string {
  return new Date(`${date.slice(0, 10)}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function formatPrice(event: Event): string {
  if (!event.price || event.price.toLowerCase() === "free") return "Free";
  const amount = Number(event.price_amount);
  return event.price_amount && !isNaN(amount)
    ? formatCurrency(amount, event.currency || "NGN")
    : "Paid";
}

/** Builds the WhatsApp message. Uses *bold*, which WhatsApp renders. */
export function buildWhatsAppDigest({
  events,
  area,
  from,
  to,
  siteUrl,
}: {
  events: Event[];
  area: DigestArea;
  from: string;
  to: string;
  siteUrl: string;
}): string {
  const label = DIGEST_AREAS.find((a) => a.value === area)?.label ?? "Nigeria";
  const where = area === "online" ? "online" : area === "all" ? "in Nigeria" : `in ${label}`;
  const moreUrl =
    area === "lagos" || area === "abuja" ? `${siteUrl}/location/${area}` : siteUrl;

  const header = `*Tech events this week ${where}* 🗓️\n${formatDay(from)} – ${formatDay(to)} · times in WAT`;

  if (events.length === 0) {
    return `${header}\n\nNo events listed yet this week. Know one? Add it here:\n${siteUrl}/submit-event`;
  }

  const shown = events.slice(0, DIGEST_MAX_EVENTS);
  const items = shown.map((e, i) => {
    // Multi-day events show their range, so an ongoing event doesn't look past.
    const end = e.end_date?.slice(0, 10);
    const day =
      end && end !== e.start_date.slice(0, 10)
        ? `${formatDay(e.start_date)} – ${formatDay(end)}`
        : formatDay(e.start_date);
    const time = e.time ? ` · ${formatTo12Hour(e.time)}` : "";
    const place = e.type === "Online" ? "Online" : e.city || e.location;
    return [
      `*${i + 1}. ${e.title}*`,
      `📅 ${day}${time}`,
      `📍 ${place}`,
      `💰 ${formatPrice(e)}`,
      `🔗 ${siteUrl}/events/${e.slug}`,
    ].join("\n");
  });

  const remaining = events.length - shown.length;
  const footer =
    remaining > 0
      ? `Plus ${remaining} more event${remaining === 1 ? "" : "s"}: ${moreUrl}`
      : `See all events: ${moreUrl}`;

  return [header, ...items, footer, `Running a tech event? Submit it here: ${siteUrl}/submit-event`].join("\n\n");
}
