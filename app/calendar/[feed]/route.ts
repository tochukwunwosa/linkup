import { createPublicClient } from "@/lib/supabase/public";
import { getLocationMeta } from "@/constants/location-meta";
import { getCategoryMeta } from "@/constants/category-meta";
import { todayInLagos } from "@/lib/date-utils";
import { addDays, filterDigestEvents } from "@/lib/digest";
import { buildIcsFeed } from "@/lib/ics";
import { Event } from "@/lib/validations/event";

// Subscribable calendar feeds: /calendar/all.ics, /calendar/online.ics,
// /calendar/<state>.ics and /calendar/<category>.ics. Each feed is built on
// its first request and cached for an hour, so calendar apps polling them
// don't run a function each time, and deploys don't depend on the database.
export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

// Keep recently ended events so they don't vanish from calendars right away.
const KEEP_ENDED_DAYS = 30;

// Empty: build every feed on first request instead of at deploy time.
export function generateStaticParams() {
  return [];
}

// State and category slugs don't overlap; states are checked first.

function describeFeed(slug: string): { name: string; description: string; pick: (events: Event[], from: string) => Event[] } | null {
  const forever = "9999-12-31";
  if (slug === "all") {
    return {
      name: "TechLinkUp: Tech events in Nigeria",
      description: "Tech events across Nigeria from techlinkup.xyz",
      pick: (events) => events,
    };
  }
  if (slug === "online") {
    return {
      name: "TechLinkUp: Online tech events",
      description: "Online and hybrid tech events from techlinkup.xyz",
      pick: (events, from) => filterDigestEvents(events, "online", from, forever),
    };
  }
  const state = getLocationMeta(slug);
  if (state) {
    return {
      name: `TechLinkUp: Tech events in ${state.label}`,
      description: `Tech events in ${state.label}, Nigeria, from techlinkup.xyz`,
      pick: (events, from) => filterDigestEvents(events, slug, from, forever),
    };
  }
  const category = getCategoryMeta(slug);
  if (category) {
    // Same matching as the search_events_by_categories RPC: exact, case-insensitive.
    const keywords = category.dbKeywords.map((k) => k.toLowerCase());
    return {
      name: `TechLinkUp: ${category.label} events`,
      description: `${category.label} events in Nigeria from techlinkup.xyz`,
      pick: (events) =>
        events.filter((e) => (e.category ?? []).some((c) => keywords.includes(c.toLowerCase()))),
    };
  }
  return null;
}

export async function GET(_req: Request, { params }: { params: Promise<{ feed: string }> }) {
  const { feed } = await params;
  const feedInfo = describeFeed(feed.replace(/\.ics$/, ""));
  if (!feed.endsWith(".ics") || !feedInfo) {
    return new Response("Not found", { status: 404 });
  }

  const from = addDays(todayInLagos(), -KEEP_ENDED_DAYS);
  const { data, error } = await createPublicClient()
    .from("published_events")
    .select("*")
    .or(`end_date.gte.${from},and(end_date.is.null,start_date.gte.${from})`)
    .order("start_date", { ascending: true });

  if (error) {
    console.error(`[calendar/${feed}] Error fetching events:`, error);
    // Throw rather than serve an empty calendar, which would make calendar
    // apps delete every event they have. On an hourly refresh Next.js keeps
    // serving the last good version when regeneration throws.
    throw new Error(`Failed to fetch events for ${feed}`);
  }

  const body = buildIcsFeed({
    name: feedInfo.name,
    description: feedInfo.description,
    events: feedInfo.pick((data ?? []) as Event[], from),
    siteUrl,
    feed: feed.replace(/\.ics$/, ""),
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${feed}"`,
    },
  });
}
