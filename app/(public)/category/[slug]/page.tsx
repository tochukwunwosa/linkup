import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import JsonLd from "@/components/JsonLd";
import EventCard from "@/components/event-card";
import { categoryMeta, getCategoryMeta } from "@/constants/category-meta";
import { Event } from "@/lib/validations/event";
import { PageHero } from "@/components/page-hero";

export const revalidate = 3600; // refresh every hour
export const dynamic = "force-dynamic"; // always fetch fresh data

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  if (!meta) return {};

  const title = `${meta.label} Events in Nigeria | TechLinkUp`;
  const description = `Find upcoming ${meta.label} events, conferences, workshops, and meetups in Nigeria. Connect with the Nigerian ${meta.label} community on TechLinkUp.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${meta.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/category/${meta.slug}`,
      images: [{ url: "/linkup-og-image-1200x600.webp", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  if (!meta) return notFound();

  const supabase = await createClient();

  const { data: rawEvents, error } = await supabase
    .rpc("search_events_by_categories", { keywords: meta.dbKeywords });

  if (error) {
    console.error(`[category/${meta.slug}] Error fetching events:`, error);
  }

  const events = (rawEvents ?? []) as Event[];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: `${meta.label} Events in Nigeria`, url: `${siteUrl}/category/${meta.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} id="breadcrumb" />

      <main className="min-h-screen bg-[#f5f4f2]">
        <PageHero
          backHref="/"
          backLabel="All events"
          eyebrow="Category"
          title={`${meta.label} Events in Nigeria`}
          subtitle={meta.description}
        >
          <Tag className="w-3.5 h-3.5" />
        </PageHero>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {events.length > 0 && (
            <p className="text-sm text-[#64748b] mb-8">
              {events.length} upcoming event{events.length !== 1 ? "s" : ""}
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
              <Tag className="w-12 h-12 text-[#0066cc]/20 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#1a1b25] mb-2">
                No {meta.label} events listed yet
              </h2>
              <p className="text-[#64748b] mb-6 max-w-md mx-auto">
                Know of a {meta.label} event happening in Nigeria? Submit it and we&apos;ll list it here.
              </p>
              <Link
                href="/submit-event"
                className="inline-flex items-center gap-2 bg-[#c9f72f] hover:bg-[#b8e020] text-[#1a1b25] font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Submit an Event
              </Link>
            </div>
          )}

          {/* Browse other categories */}
          <div className="mt-14">
            <h2 className="text-base font-semibold text-[#1a1b25] mb-4">
              Browse other categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {categoryMeta
                .filter((c) => c.slug !== meta.slug)
                .map((c) => (
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
      </main>
    </>
  );
}
