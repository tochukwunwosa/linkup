import { Event } from "@/lib/validations/event";
import { addDays } from "@/lib/digest";

// iCalendar (RFC 5545) feeds people can subscribe to from Google, Apple or
// Outlook calendars. Event dates and times are stored in WAT (Africa/Lagos).

const TZID = "Africa/Lagos";
const ASSUMED_DURATION_HOURS = 2; // events store a start time only

// Nigeria has no daylight saving, so one fixed offset is the whole zone.
const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TZID}`,
  "BEGIN:STANDARD",
  "DTSTART:19700101T000000",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0100",
  "TZNAME:WAT",
  "END:STANDARD",
  "END:VTIMEZONE",
];

/** Escapes text values: backslash, semicolon, comma and newlines. */
export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Folds a content line at 75 octets (UTF-8), continuing lines with a space. */
export function foldIcsLine(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    // The first line may hold 75 octets; continuation lines start with a space.
    const limit = parts.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

const compactDate = (date: string) => date.slice(0, 10).replace(/-/g, "");

const utcStamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

/** "HH:MM" -> [hours, minutes], or null if the stored time isn't usable. */
function parseTime(time: string): [number, number] | null {
  const match = /^(\d{1,2}):(\d{2})/.exec(time?.trim() ?? "");
  if (!match) return null;
  const [h, m] = [Number(match[1]), Number(match[2])];
  return h < 24 && m < 60 ? [h, m] : null;
}

/** Local WAT date-time "YYYYMMDDTHHMMSS", rolling over midnight if needed. */
function localDateTime(date: string, hours: number, minutes: number): string {
  const extraDays = Math.floor(hours / 24);
  const day = compactDate(addDays(date.slice(0, 10), extraDays));
  const hh = String(hours % 24).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${day}T${hh}${mm}00`;
}

function eventLines(event: Event, siteUrl: string, now: Date): string[] {
  const url = `${siteUrl}/events/${event.slug}`;
  const start = event.start_date.slice(0, 10);
  const end = (event.end_date || event.start_date).slice(0, 10);
  const time = parseTime(event.time);
  const multiDay = end !== start;

  // Single-day events with a time get a timed slot; anything else is all-day.
  const timing =
    time && !multiDay
      ? [
          `DTSTART;TZID=${TZID}:${localDateTime(start, time[0], time[1])}`,
          `DTEND;TZID=${TZID}:${localDateTime(start, time[0] + ASSUMED_DURATION_HOURS, time[1])}`,
        ]
      : [`DTSTART;VALUE=DATE:${compactDate(start)}`, `DTEND;VALUE=DATE:${compactDate(addDays(end, 1))}`];

  const startsAt = time && multiDay ? `Starts ${event.time} WAT.\n\n` : "";
  const summary = (event.description ?? "").trim();
  const description = `${startsAt}${summary.length > 400 ? `${summary.slice(0, 400)}…` : summary}\n\nDetails: ${url}`;
  const updated = event.updated_at ? new Date(event.updated_at) : now;

  return [
    "BEGIN:VEVENT",
    `UID:${event.slug}@techlinkup.xyz`,
    `DTSTAMP:${utcStamp(now)}`,
    `LAST-MODIFIED:${utcStamp(updated)}`,
    ...timing,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.type === "Online" ? "Online" : event.location)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `URL:${url}`,
    "END:VEVENT",
  ];
}

/** Builds a complete calendar feed. */
export function buildIcsFeed({
  name,
  description,
  events,
  siteUrl,
}: {
  name: string;
  description: string;
  events: Event[];
  siteUrl: string;
}): string {
  const now = new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TechLinkUp//Tech Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(name)}`,
    `X-WR-CALDESC:${escapeIcsText(description)}`,
    `X-WR-TIMEZONE:${TZID}`,
    // Ask calendar apps to check for new events twice a day.
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
    ...VTIMEZONE,
    ...events.flatMap((e) => eventLines(e, siteUrl, now)),
    "END:VCALENDAR",
  ];
  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}
