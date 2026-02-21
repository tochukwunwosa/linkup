import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { generateEventSchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import JsonLd from "@/components/JsonLd";
import { Event } from "@/lib/validations/event";
import Link from "next/link";
import { Calendar, MapPin, Clock, Tag, ExternalLink, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

function formatTo12Hour(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return time24;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

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
      images: [
        {
          url: "/linkup-og-image-1200x600.webp",
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: ["/linkup-og-image-1200x600.webp"],
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

  const eventSchema = generateEventSchema(event);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Events", url: `${siteUrl}/#events` },
    { name: event.title, url: `${siteUrl}/events/${event.id}` },
  ]);

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

  return (
    <>
      <JsonLd data={eventSchema} id="event-schema" />
      <JsonLd data={breadcrumbSchema} id="breadcrumb-schema" />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all events
          </Link>

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            {/* Category badges */}
            {event.category && event.category.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {event.category.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700"
                  >
                    <Tag className="w-3 h-3" />
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {event.title}
            </h1>

            {/* Type badge */}
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 mb-6">
              {event.type}
            </span>

            {/* Key details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formattedStartDate}
                  </p>
                  {formattedEndDate && (
                    <p className="text-sm text-gray-500">
                      to {formattedEndDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900">{formatTo12Hour(event.time)}</p>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.location}
                  </p>
                  {event.city && (
                    <p className="text-sm text-gray-500">
                      {event.city}
                      {event.country ? `, ${event.country}` : ""}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-base mt-0.5 flex-shrink-0">
                  ₦
                </span>
                <p className="text-sm font-medium text-gray-900">
                  {priceDisplay}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About this event
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {/* CTA */}
          {event.link && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Register / Learn More
              </h2>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Visit Event Website
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Footer nav */}
          <div className="text-center pt-4">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              ← Discover more tech events in Nigeria
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
