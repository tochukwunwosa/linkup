import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { createPublicClient } from "@/lib/supabase/public";
import { generateBreadcrumbSchema, generateEventListSchema } from "@/lib/structured-data";
import { hasEventEnded } from "@/lib/date-utils";
import { formatDateRange } from "@/lib/utils";
import JsonLd from "@/components/JsonLd";
import EventCard from "@/components/event-card";
import { PageHero } from "@/components/page-hero";
import { Event } from "@/lib/validations/event";
import { locationMeta } from "@/constants/location-meta";
import { categoryMeta } from "@/constants/category-meta";

// Static and cached so crawlers get a fast, complete page; refreshed hourly.
export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

const title = "All Tech Events in Nigeria – Upcoming & Past";
const description =
  "Browse every tech event listed on TechLinkUp: upcoming conferences, meetups, hackathons and workshops across Nigeria, plus an archive of past events.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/events" },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/events`,
    images: [{ url: "/linkup-og-image-1200x600.webp", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title, description },
};

// Supabase caps a single select at 1000 rows, so page through the view.
const PAGE_SIZE = 1000;

async function getAllPublishedEvents(): Promise<Event[]> {
  const supabase = createPublicClient();
  const all: Event[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("published_events")
      .select("*")
      .order("start_date", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error("[events] Error fetching events:", error);
      break;
    }
    all.push(...((data ?? []) as Event[]));
    if (!data || data.length < PAGE_SIZE) break;
  }

  return all;
}

/** Groups past events (already newest first) under "Month YYYY" headings. */
function groupByMonth(events: Event[]) {
  const groups = new Map<string, Event[]>();
  for (const event of events) {
    const key = event.start_date.slice(0, 7); // YYYY-MM
    const list = groups.get(key);
    if (list) list.push(event);
    else groups.set(key, [event]);
  }
  return [...groups.entries()].map(([key, items]) => ({
    key,
    label: new Date(`${key}-01T12:00:00Z`).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
    items,
  }));
}

export default async function AllEventsPage() {
  const events = await getAllPublishedEvents();

  const upcoming = events.filter((e) => !hasEventEnded(e));
  const past = events.filter((e) => hasEventEnded(e)).reverse();
  const pastByMonth = groupByMonth(past);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "All Tech Events", url: `${siteUrl}/events` },
  ]);
  const itemListSchema = {
    ...generateEventListSchema(upcoming),
    name: "Upcoming Tech Events in Nigeria",
    url: `${siteUrl}/events`,
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} id="breadcrumb" />
      <JsonLd data={itemListSchema} id="event-list" />

      <main className="min-h-screen bg-[#f5f4f2]">
        <PageHero
          backHref="/"
          backLabel="Home"
          eyebrow="Nigeria"
          title="All Tech Events"
          subtitle="Every tech event listed on TechLinkUp, from what's coming up to what's already happened."
        >
          <CalendarDays className="w-3.5 h-3.5" />
        </PageHero>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Upcoming & ongoing */}
          <section aria-labelledby="upcoming-heading">
            <h2 id="upcoming-heading" className="text-2xl font-semibold text-[#1a1b25] mb-2">
              Upcoming & ongoing events
            </h2>
            <p className="text-sm text-[#64748b] mb-8">
              {upcoming.length} event{upcoming.length !== 1 ? "s" : ""} coming up
            </p>

            {upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white">
                <p className="text-[#64748b] mb-6">No upcoming events right now. Check back soon.</p>
                <Link
                  href="/submit-event"
                  className="inline-flex items-center gap-2 bg-[#c9f72f] hover:bg-[#b8e020] text-[#1a1b25] font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  Submit an Event
                </Link>
              </div>
            )}
          </section>

          {/* Past events archive */}
          {pastByMonth.length > 0 && (
            <section aria-labelledby="past-heading" className="mt-16">
              <h2 id="past-heading" className="text-2xl font-semibold text-[#1a1b25] mb-2">
                Past events
              </h2>
              <p className="text-sm text-[#64748b] mb-8">
                {past.length} tech event{past.length !== 1 ? "s" : ""} held across Nigeria
              </p>

              <div className="space-y-10">
                {pastByMonth.map((group) => (
                  <div key={group.key}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#64748b] mb-3">
                      {group.label}
                    </h3>
                    <ul className="divide-y divide-[rgba(0,0,0,0.06)] rounded-xl border border-[rgba(0,0,0,0.07)] bg-white">
                      {group.items.map((event) => (
                        <li key={event.id}>
                          <Link
                            href={`/events/${event.slug}`}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3 hover:bg-[#fafafa] transition-colors"
                          >
                            <span className="font-medium text-[#1a1b25] hover:text-[#0066cc]">
                              {event.title}
                            </span>
                            <span className="text-xs text-[#64748b] sm:text-right sm:shrink-0">
                              {formatDateRange(event.start_date, event.end_date || "")}
                              {(event.city || event.location) && ` · ${event.city || event.location}`}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Internal links to the hub pages */}
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold text-[#1a1b25] mb-4">Browse by state</h2>
              <div className="flex flex-wrap gap-2">
                {locationMeta.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/location/${l.slug}`}
                    className="text-sm px-3.5 py-1.5 rounded-full border border-[rgba(0,0,0,0.10)] text-[#4a4a5a] bg-white hover:border-[#0066cc]/30 hover:text-[#0066cc] transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1a1b25] mb-4">Browse by category</h2>
              <div className="flex flex-wrap gap-2">
                {categoryMeta.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="text-sm px-3.5 py-1.5 rounded-full border border-[rgba(0,0,0,0.10)] text-[#4a4a5a] bg-white hover:border-[#0066cc]/30 hover:text-[#0066cc] transition-colors"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
