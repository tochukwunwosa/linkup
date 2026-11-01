import { Event } from "@/lib/validations/event";
import { addDays } from "@/lib/date-utils";

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

export interface EventTiming {
  allDay: boolean;
  /** WAT "YYYYMMDDTHHMMSS" when timed, "YYYYMMDD" when all-day. */
  start: string;
  /** Exclusive end, same format as start. */
  end: string;
}

/**
 * Single-day events with a usable time get a 2-hour slot in WAT; multi-day
 * events, or ones without a time, are all-day (end date exclusive).
 */
export function eventTiming(event: Pick<Event, "start_date" | "end_date" | "time">): EventTiming {
  const start = event.start_date.slice(0, 10);
  const end = (event.end_date || event.start_date).slice(0, 10);
  const time = parseTime(event.time);

  if (time && end === start) {
    return {
      allDay: false,
      start: localDateTime(start, time[0], time[1]),
      end: localDateTime(start, time[0] + ASSUMED_DURATION_HOURS, time[1]),
    };
  }
  return { allDay: true, start: compactDate(start), end: compactDate(addDays(end, 1)) };
}

/** Plain-text description: the summary (trimmed) and a link back to the event. */
function eventDescription(event: Event, url: string): string {
  const multiDay = (event.end_date || event.start_date).slice(0, 10) !== event.start_date.slice(0, 10);
  const startsAt = parseTime(event.time) && multiDay ? `Starts ${event.time} WAT.\n\n` : "";
  const summary = (event.description ?? "").trim();
  return `${startsAt}${summary.length > 400 ? `${summary.slice(0, 400)}…` : summary}\n\nDetails: ${url}`;
}

function eventLines(event: Event, siteUrl: string, now: Date): string[] {
  const url = `${siteUrl}/events/${event.slug}`;
  const t = eventTiming(event);
  const timing = t.allDay
    ? [`DTSTART;VALUE=DATE:${t.start}`, `DTEND;VALUE=DATE:${t.end}`]
    : [`DTSTART;TZID=${TZID}:${t.start}`, `DTEND;TZID=${TZID}:${t.end}`];
  const description = eventDescription(event, url);
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

function buildCalendar(headerLines: string[], events: Event[], siteUrl: string): string {
  const now = new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TechLinkUp//Tech Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...headerLines,
    ...VTIMEZONE,
    ...events.flatMap((e) => eventLines(e, siteUrl, now)),
    "END:VCALENDAR",
  ];
  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

/** Builds a complete calendar feed for subscribing. */
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
  return buildCalendar(
    [
      `X-WR-CALNAME:${escapeIcsText(name)}`,
      `X-WR-CALDESC:${escapeIcsText(description)}`,
      `X-WR-TIMEZONE:${TZID}`,
      // Ask calendar apps to check for new events twice a day.
      "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
      "X-PUBLISHED-TTL:PT12H",
    ],
    events,
    siteUrl
  );
}

/**
 * A one-off .ics file for "Add to calendar". No calendar name or refresh
 * hints, so calendar apps add the event rather than offer a new calendar.
 */
export function buildIcsFile(event: Event, siteUrl: string): string {
  return buildCalendar([], [event], siteUrl);
}

/** Google Calendar "add event" link, with times pinned to WAT. */
export function googleCalendarUrl(event: Event, siteUrl: string): string {
  const t = eventTiming(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${t.start}/${t.end}`,
    details: eventDescription(event, `${siteUrl}/events/${event.slug}`),
    location: event.type === "Online" ? "Online" : event.location,
  });
  // Timed events are local WAT times; tell Google so visitors abroad see them correctly.
  if (!t.allDay) params.set("ctz", TZID);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
