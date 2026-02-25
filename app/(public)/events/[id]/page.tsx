import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { generateEventSchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import JsonLd from "@/components/JsonLd";
import { Event } from "@/lib/validations/event";
import Link from "next/link";
import { Calendar, MapPin, Clock, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { getCategoryColors } from "@/lib/category-color";
import { isLiveEvent, formatTo12Hour } from "@/lib/utils";
import { AddToCalendar } from "@/components/event/add-to-calendar";
import { ShareButtons } from "@/components/event/share-buttons";
import { RelatedEvents } from "@/components/event/related-events";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("public_events")
    .select("*")
    .eq("id", id)
    .single<Event>();

  if (!event) return {};

  const title = `${event.title} – ${event.city || event.location} | TechLinkUp`;
  const description = event.description
    ? event.description.slice(0, 155)
    : `${event.title} is a tech event happening in ${event.city || event.location}, Nigeria.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/events/${event.id}`,
    },
    openGraph: {
      title: event.title,
      description,
      url: `${siteUrl}/events/${event.id}`,
      type: "website",
      // opengraph-image.tsx is auto-discovered by Next.js
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("public_events")
    .select("*")
    .eq("id", id)
    .single<Event>();

  if (!event) return notFound();

  // Fetch related events from the same categories, excluding this event
  const { data: relatedRaw } = await supabase
    .rpc("search_events_by_categories", { keywords: event.category ?? [] })
    .neq("id", event.id)
    .limit(3);

  const relatedEvents: Event[] = (relatedRaw ?? []) as Event[];

  const eventSchema = generateEventSchema(event);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Events", url: `${siteUrl}/#events` },
    { name: event.title, url: `${siteUrl}/events/${event.id}` },
  ]);

  const colors = getCategoryColors(event.category);
  const live = isLiveEvent({ event });
  const typeLabel = event.type === "In-person & Online" ? "Hybrid" : event.type;

  const formattedStartDate = new Date(event.start_date).toLocaleDateString(
    "en-NG",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );
  const formattedEndDate = event.end_date
    ? new Date(event.end_date).toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const priceDisplay =
    event.price?.toLowerCase() === "free"
      ? "Free"
      : event.price_amount
      ? formatCurrency(Number(event.price_amount), event.currency || "NGN")
      : event.price || "See event page";

  const eventUrl = `${siteUrl}/events/${event.id}`;

  return (
    <>
      <JsonLd data={eventSchema} id="event-schema" />
      <JsonLd data={breadcrumbSchema} id="breadcrumb-schema" />

      <main className="min-h-screen bg-[#f5f4f2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1a1b25] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all events
          </Link>

          {/* Gradient banner */}
          <div
            className="relative rounded-2xl overflow-hidden mb-6"
            style={{ background: `linear-gradient(135deg, ${colors.solid}, ${colors.light})` }}
          >
            {/* Grain overlay */}
            <div
              className="hero-grain absolute inset-0 pointer-events-none"
              aria-hidden="true"
            />
            {/* Bottom depth shadow */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 p-6 sm:p-8">
              {/* Top badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {live && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-white/20 px-2.5 py-1 text-xs font-semibold text-white leading-none">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    LIVE NOW
                  </span>
                )}
                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white leading-none">
                  {typeLabel}
                </span>
              </div>

              {/* Category badges */}
              {event.category && event.category.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {event.category.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/15 text-white"
                    >
                      <Tag className="w-3 h-3" />
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Content grid — aside first in DOM for mobile-first order */}
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-6 lg:items-start">

            {/* Sidebar — stacks above description on mobile */}
            <aside className="mb-6 lg:mb-0 lg:col-start-2 lg:row-start-1">
              <div className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                {/* Color accent strip */}
                <div
                  className="h-1.5"
                  style={{ background: `linear-gradient(90deg, ${colors.solid}, ${colors.light})` }}
                  aria-hidden="true"
                />

                <div className="p-5 flex flex-col gap-4">
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.overlay }}
                    >
                      <Calendar className="w-4 h-4" style={{ color: colors.solid }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] leading-none mb-1">
                        Date
                      </p>
                      <p className="text-sm font-semibold text-[#1a1b25]">{formattedStartDate}</p>
                      {formattedEndDate && (
                        <p className="text-xs text-[#64748b] mt-0.5">to {formattedEndDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.overlay }}
                    >
                      <Clock className="w-4 h-4" style={{ color: colors.solid }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] leading-none mb-1">
                        Time
                      </p>
                      <p className="text-sm font-semibold text-[#1a1b25]">
                        {formatTo12Hour(event.time)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.overlay }}
                    >
                      <MapPin className="w-4 h-4" style={{ color: colors.solid }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] leading-none mb-1">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-[#1a1b25]">{event.location}</p>
                      {event.city && (
                        <p className="text-xs text-[#64748b] mt-0.5">
                          {event.city}
                          {event.country ? `, ${event.country}` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.overlay }}
                    >
                      <Tag className="w-4 h-4" style={{ color: colors.solid }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] leading-none mb-1">
                        Price
                      </p>
                      {priceDisplay === "Free" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(201,247,47,0.18)] text-[#4a6800] border border-[rgba(201,247,47,0.5)]">
                          Free
                        </span>
                      ) : (
                        <p className="text-sm font-bold text-[#1a1b25]">{priceDisplay}</p>
                      )}
                    </div>
                  </div>

                  {/* Add to Calendar */}
                  <AddToCalendar event={event} solidColor={colors.solid} />

                  {/* CTA button */}
                  {event.link && (
                    <>
                      <div className="h-px bg-[rgba(0,0,0,0.06)]" />
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-4 py-3 rounded-xl transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98]"
                        style={{ background: colors.solid }}
                      >
                        Visit Event Website
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </aside>

            {/* Main description */}
            <div className="lg:col-start-1 lg:row-start-1">
              {event.description && (
                <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                  <h2 className="font-display text-lg font-bold text-[#1a1b25] mb-4">
                    About this event
                  </h2>
                  <p className="text-[#4a4a5a] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                    {event.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Share buttons */}
          <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.07)]">
            <ShareButtons
              title={event.title}
              url={eventUrl}
              city={event.city ?? undefined}
            />
          </div>

          {/* Related events */}
          <RelatedEvents
            events={relatedEvents}
            primaryCategory={event.category?.[0] ?? ""}
          />

          {/* Footer nav */}
          <div className="text-center pt-8">
            <Link
              href="/"
              className="text-sm text-[#64748b] hover:text-[#1a1b25] transition-colors"
            >
              ← Discover more tech events in Nigeria
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
