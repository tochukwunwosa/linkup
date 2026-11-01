import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EmailAlertsSignup } from "@/components/email-alerts-signup";
import { locationMeta } from "@/constants/location-meta";

export const metadata: Metadata = {
  title: "Weekly Tech Event Emails | TechLinkUp",
  description:
    "Get a free email every Monday with the week's tech events in your state: meetups, conferences, hackathons and workshops across Nigeria.",
  alternates: { canonical: "/email-alerts" },
};

const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  confirmed: {
    title: "You're subscribed 🎉",
    body: "Your first email arrives on Monday morning, if there are events in your state that week.",
  },
  invalid: {
    title: "That link didn't work",
    body: "It may have expired (links last 7 days) or already been used. Sign up again below to get a new one.",
  },
  unsubscribed: {
    title: "You've been unsubscribed",
    body: "We've deleted your email address and won't send you any more event emails.",
  },
};

export default async function EmailAlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const message = status ? STATUS_MESSAGES[status] : undefined;
  const states = locationMeta.map(({ slug, label }) => ({ slug, label }));

  return (
    <main className="min-h-screen bg-[#f5f4f2]">
      <PageHero
        backHref="/"
        backLabel="All events"
        eyebrow="Email alerts"
        title="Tech events in your inbox"
        subtitle="One email every Monday with the week's tech events in your state. No spam, unsubscribe any time."
      >
        <Mail className="w-3.5 h-3.5" />
      </PageHero>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {message && (
          <div className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <p className="font-semibold text-[#1a1b25]">{message.title}</p>
            <p className="mt-1 text-sm text-[#4a4a5a]">{message.body}</p>
          </div>
        )}
        {status !== "confirmed" && <EmailAlertsSignup states={states} />}
      </div>
    </main>
  );
}
