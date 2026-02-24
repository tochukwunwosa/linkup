import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use - TechLinkUp",
  description: "Read TechLinkUp's terms of use to understand the guidelines for using our tech event discovery platform.",
  alternates: {
    canonical: "https://techlinkup.xyz/terms-of-use",
  },
  openGraph: {
    title: "Terms of Use - TechLinkUp",
    description: "Read TechLinkUp's terms of use to understand the guidelines for using our platform.",
    url: "https://techlinkup.xyz/terms-of-use",
    images: [
      {
        url: "/linkup-og-image-1200x600.webp",
        width: 1200,
        height: 630,
        alt: "TechLinkUp Terms of Use",
      },
    ],
  },
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-[#f5f4f2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1a1b25] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-[#1a1b25] mb-3">Terms of Use</h1>
        <p className="text-sm text-[#64748b] mb-10">
          Effective: June 2025 · Last Updated: June 25, 2025
        </p>

        <div className="text-base leading-relaxed text-[#4a4a5a] space-y-6">
          <p>
            Welcome to <strong className="text-[#1a1b25]">TechLinkUp</strong>.{" "}
            {`If you're here, you're probably trying to
            find or share tech events — and that's exactly what we built this for.`}{" "}
            These are the basic terms that guide how things work around here.
          </p>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">What This Platform Is</h2>
          <p>
            TechLinkUp is a simple place to find and share tech-related events.
            Over time, we&apos;ll be adding more — things like profiles, reminders, and
            notifications to help you keep track of what matters to you.
          </p>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">Using the Platform</h2>
          <p>For now, you don&apos;t need an account to browse events.</p>
          <p>
            When signups launch, creating an account means a few basic things:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>You&apos;ll give us real info, like your name and email — not fake ones.</li>
            <li>If you make a profile, don&apos;t use it to harass or mess with people. Just be decent.</li>
            <li>Please don&apos;t flood the platform with junk, promotions, or anything misleading.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">What You Can Expect From Us</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>We&apos;ll keep the platform functional and straightforward.</li>
            <li>We won&apos;t give away your personal information without your knowledge.</li>
            <li>If we make changes that affect your account or data, we&apos;ll say so plainly and upfront.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">Your Content</h2>
          <p>
            If, later on, you post something (like an event or profile), it&apos;s still
            yours. We&apos;re not taking ownership of your work.
          </p>
          <p>
            But by posting it here, you&apos;re okay with us showing it publicly on the
            platform. That&apos;s how people will find it. Whatever you share — you&apos;re
            responsible for it.
          </p>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">Age Guidance</h2>
          <p>
            We&apos;re not enforcing any age restrictions right now. But if you&apos;re under
            13, please check in with a parent or guardian before using TechLinkUp.
          </p>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">Things We Can&apos;t Guarantee</h2>
          <p>
            We want this to work well. But it&apos;s a work in progress. Sometimes things
            might be down or not work the way they should.
          </p>
          <p>
            We&apos;ll do what we can to keep it stable and useful, but we can&apos;t promise
            perfection.
          </p>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">Updates to These Terms</h2>
          <p>
            These terms will likely change as the platform grows. If something major
            shifts, we&apos;ll make it clear before the changes go live.
          </p>

          <div className="mt-10 pt-8 border-t border-[rgba(0,0,0,0.07)] text-sm text-[#64748b] space-y-2">
            <p>
              Also see our{" "}
              <Link href="/privacy-policy" className="text-[#0066cc] hover:underline">
                Privacy Policy
              </Link>{" "}
              to understand how we handle your data.
            </p>
            <p>
              Have questions?{" "}
              <Link href="/contact" className="text-[#0066cc] hover:underline">
                Contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
