import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import JsonLd from "@/components/JsonLd";
import EventCard from "@/components/event-card";
import { categoryMeta, getCategoryMeta } from "@/constants/category-meta";
import { Event } from "@/lib/validations/event";

export const revalidate = 3600; // refresh every hour

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

export async function generateStaticParams() {
  return categoryMeta.map((c) => ({ slug: c.slug }));
}

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

  // Use the existing RPC for case-insensitive category search
  const { data: rawEvents } = await supabase
    .rpc("search_events_by_categories", { keywords: meta.dbKeywords });

  const events = (rawEvents ?? []) as Event[];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: `${meta.label} Events in Nigeria`, url: `${siteUrl}/category/${meta.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} id="breadcrumb" />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All events
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-3">
              <Tag className="w-4 h-4" />
              <span>Category</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {meta.label} Events in Nigeria
            </h1>
            <p className="text-gray-600 max-w-3xl leading-relaxed">
              {meta.description}
            </p>
            {events && events.length > 0 && (
              <p className="mt-3 text-sm text-gray-500">
                {events.length} upcoming event{events.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Events grid */}
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No {meta.label} events listed yet
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Know of a {meta.label} event happening in Nigeria? Submit it and we&apos;ll list it here.
              </p>
              <Link
                href="/submit-event"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Submit an Event
              </Link>
            </div>
          )}

          {/* Browse other categories */}
          <div className="mt-16">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Browse other categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {categoryMeta
                .filter((c) => c.slug !== meta.slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors bg-white"
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
