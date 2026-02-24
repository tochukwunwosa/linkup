import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import JsonLd from "@/components/JsonLd";
import EventCard from "@/components/event-card";
import { locationMeta, getLocationMeta } from "@/constants/location-meta";
import { Event } from "@/lib/validations/event";
import { PageHero } from "@/components/page-hero";

export const revalidate = 3600; // refresh every hour
export const dynamic = "force-dynamic"; // always fetch fresh data

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const meta = getLocationMeta(state);
  if (!meta) return {};

  const title = `Tech Events in ${meta.label}, Nigeria | TechLinkUp`;
  const description = `Discover upcoming tech events, conferences, meetups, hackathons, and workshops in ${meta.label}, Nigeria. Find and attend the best tech events near you.`;

  return {
    title,
    description,
    alternates: { canonical: `/location/${meta.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/location/${meta.slug}`,
      images: [{ url: "/linkup-og-image-1200x600.webp", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const meta = getLocationMeta(state);
  if (!meta) return notFound();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_events")
    .select("*")
    .or(`location.ilike.*${meta.searchTerm}*,city.ilike.*${meta.searchTerm}*`)
    .order("start_date", { ascending: true });

  if (error) {
    console.error(`[location/${meta.slug}] Error fetching events:`, error);
  }

  const events = (data ?? []) as Event[];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: `Tech Events in ${meta.label}`, url: `${siteUrl}/location/${meta.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} id="breadcrumb" />

      <main className="min-h-screen bg-[#f5f4f2]">
        <PageHero
          backHref="/"
          backLabel="All events"
          eyebrow="Nigeria"
          title={`Tech Events in ${meta.label}`}
          subtitle={meta.description}
        >
          <MapPin className="w-3.5 h-3.5" />
        </PageHero>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {events.length > 0 && (
            <p className="text-sm text-[#64748b] mb-8">
              {events.length} upcoming event{events.length !== 1 ? "s" : ""} in {meta.label}
            </p>
          )}

          {/* Events grid */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white">
              <MapPin className="w-12 h-12 text-[#0066cc]/20 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#1a1b25] mb-2">
                No events yet in {meta.label}
              </h2>
              <p className="text-[#64748b] mb-6 max-w-md mx-auto">
                Be the first to bring a tech event to {meta.label}. Submit your event and we&apos;ll list it here.
              </p>
              <Link
                href="/submit-event"
                className="inline-flex items-center gap-2 bg-[#c9f72f] hover:bg-[#b8e020] text-[#1a1b25] font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Submit an Event
              </Link>
            </div>
          )}

          {/* Browse other locations */}
          <div className="mt-14">
            <h2 className="text-base font-semibold text-[#1a1b25] mb-4">
              Browse events in other states
            </h2>
            <div className="flex flex-wrap gap-2">
              {locationMeta
                .filter((l) => l.slug !== meta.slug)
                .slice(0, 18)
                .map((l) => (
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
        </div>
      </main>
    </>
  );
}
