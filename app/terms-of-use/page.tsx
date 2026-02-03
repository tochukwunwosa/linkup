import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use - LinkUp",
  description: "Read LinkUp's terms of use to understand the guidelines for using our tech event discovery platform.",
  alternates: {
    canonical: "https://techlinkup.xyz/terms-of-use",
  },
  openGraph: {
    title: "Terms of Use - LinkUp",
    description: "Read LinkUp's terms of use to understand the guidelines for using our platform.",
    url: "https://techlinkup.xyz/terms-of-use",
    images: [
      {
        url: "/linkup-og-image-1200x600.webp",
        width: 1200,
        height: 630,
        alt: "LinkUp Terms of Use",
      },
    ],
  },
};

export default function TermsOfUsePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-base leading-relaxed text-gray-800">
      <Link href="/">
        <Button variant="ghost" className="mb-6 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-8">
        Effective: June 2025 · Last Updated: June 25, 2025
      </p>

      <p className="mb-6">
        Welcome to <strong>Tech LinkUp</strong>. {`If you're here, you're probably trying to
        find or share tech events — and that’s exactly what we built this for.`}
        These are the basic terms that guide how things work around here.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">What This Platform Is</h2>
      <p className="mb-6">
        Tech LinkUp is a simple place to find and share tech-related events.
        Over time, we’ll be adding more — things like profiles, reminders, and
        notifications to help you keep track of what matters to you.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Using the Platform</h2>
      <p className="mb-4">For now, you don’t need an account to browse events.</p>
      <p className="mb-4">
        When signups launch, creating an account means a few basic things:
      </p>
      <ul className="list-disc list-inside mb-6 space-y-1">
        <li>You’ll give us real info, like your name and email — not fake ones.</li>
        <li>If you make a profile, don’t use it to harass or mess with people. Just be decent.</li>
        <li>Please don’t flood the platform with junk, promotions, or anything misleading.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-10 mb-4">What You Can Expect From Us</h2>
      <ul className="list-disc list-inside mb-6 space-y-1">
        <li>We’ll keep the platform functional and straightforward.</li>
        <li>We won’t give away your personal information without your knowledge.</li>
        <li>If we make changes that affect your account or data, we’ll say so plainly and upfront.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-10 mb-4">Your Content</h2>
      <p className="mb-4">
        If, later on, you post something (like an event or profile), it’s still
        yours. We’re not taking ownership of your work.
      </p>
      <p className="mb-6">
        But by posting it here, you’re okay with us showing it publicly on the
        platform. That’s how people will find it. Whatever you share — you’re
        responsible for it.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Age Guidance</h2>
      <p className="mb-6">
        We’re not enforcing any age restrictions right now. But if you’re under
        13, please check in with a parent or guardian before using Tech LinkUp.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Things We Can’t Guarantee</h2>
      <p className="mb-6">
        We want this to work well. But it’s a work in progress. Sometimes things
        might be down or not work the way they should.
      </p>
      <p className="mb-6">
        We’ll do what we can to keep it stable and useful, but we can’t promise
        perfection.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Updates to These Terms</h2>
      <p className="mb-6">
        These terms will likely change as the platform grows. If something major
        shifts, we&apos;ll make it clear before the changes go live.
      </p>

      <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
        <p>
          Also see our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> to understand how we handle your data.
        </p>
        <p className="mt-2">
          Have questions? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link>.
        </p>
      </div>
    </main>
  );
}
