import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { EventSubmission } from "@/lib/validations/event";
import Link from "next/link";
import { Calendar, MapPin, Clock, Tag, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { getCategoryColors } from "@/lib/category-color";
import { formatTo12Hour } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Event Preview | TechLinkUp",
  robots: { index: false, follow: false },
};

export default async function SubmissionPreviewPage({
  params,
}: {
  params: Promise<{ trackingId: string }>;
}) {
  const { trackingId } = await params;
  const supabase = await createClient();

  const { data: submission } = await supabase
    .rpc("get_submission_by_tracking_id", { p_tracking_id: trackingId.toUpperCase() })
    .single<EventSubmission>();

  if (!submission) return notFound();

  // Check if the event is still publicly listed (future events only)
  let isPubliclyListed = false;
  if (submission.published_event_id) {
    const { data } = await supabase
      .from("public_events")
      .select("id")
      .eq("id", submission.published_event_id)
      .maybeSingle();
    isPubliclyListed = !!data;
  }

  const colors = getCategoryColors(submission.category);
  const typeLabel = submission.type === "In-person & Online" ? "Hybrid" : submission.type;

  const formattedStartDate = new Date(submission.start_date).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = submission.end_date
    ? new Date(submission.end_date).toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const priceDisplay =
    submission.price?.toLowerCase() === "free"
      ? "Free"
      : submission.price_amount
      ? formatCurrency(Number(submission.price_amount), submission.currency || "NGN")
      : submission.price || "See event page";

  return (
    <main className="min-h-screen bg-[#f5f4f2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back link */}
        <Link
          href="/my-submissions"
          className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1a1b25] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to my submissions
        </Link>

        {/* Status banner — only for approved submissions */}
        {submission.submission_status === "approved" && (
          <div
            className={`flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 mb-6 border ${
              isPubliclyListed
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isPubliclyListed ? "text-emerald-800" : "text-amber-800"
              }`}
            >
              {isPubliclyListed
                ? "Your event is live on TechLinkUp"
                : "This event is no longer publicly listed"}
            </p>
            {isPubliclyListed && submission.published_event_id && (
              <Link
                href={`/events/${submission.published_event_id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
              >
                View public listing
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

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
            {/* Type badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white leading-none">
                {typeLabel}
              </span>
            </div>

            {/* Category badges */}
            {submission.category && submission.category.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {submission.category.map((cat) => (
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
              {submission.title}
            </h1>
          </div>
        </div>

        {/* Content grid */}
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-6 lg:items-start">

          {/* Sidebar */}
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
                      {formatTo12Hour(submission.time)}
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
                    <p className="text-sm font-semibold text-[#1a1b25]">{submission.location}</p>
                    {submission.city && (
                      <p className="text-xs text-[#64748b] mt-0.5">
                        {submission.city}
                        {submission.country ? `, ${submission.country}` : ""}
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

                {/* Visit Event Website CTA */}
                {submission.link && (
                  <>
                    <div className="h-px bg-[rgba(0,0,0,0.06)]" />
                    <a
                      href={submission.link}
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
            {submission.description && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <h2 className="font-display text-lg font-bold text-[#1a1b25] mb-4">
                  About this event
                </h2>
                <p className="text-[#4a4a5a] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {submission.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer nav */}
        <div className="text-center pt-8">
          <Link
            href="/my-submissions"
            className="text-sm text-[#64748b] hover:text-[#1a1b25] transition-colors"
          >
            ← Back to my submissions
          </Link>
        </div>
      </div>
    </main>
  );
}
