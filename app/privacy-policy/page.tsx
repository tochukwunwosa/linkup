import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - TechLinkUp",
  description: "Read TechLinkUp's privacy policy to understand how we collect, use, and protect your data on our tech event discovery platform.",
  alternates: {
    canonical: "https://techlinkup.xyz/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy - TechLinkUp",
    description: "Read TechLinkUp's privacy policy to understand how we collect, use, and protect your data.",
    url: "https://techlinkup.xyz/privacy-policy",
    images: [
      {
        url: "/linkup-og-image-1200x600.webp",
        width: 1200,
        height: 630,
        alt: "TechLinkUp Privacy Policy",
      },
    ],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-base leading-relaxed text-gray-800">
      <Link href="/">
        <Button variant="ghost" className="mb-6 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        Effective: June 2025 · Last Updated: June 25, 2025
      </p>

      <p className="mb-6">
        Hi. This is the privacy policy for <strong>TechLinkUp</strong> — a
        space built for developers and tech folks to connect, explore events,
        and stay in the loop.
      </p>

      <p className="mb-6">We take your privacy seriously. Here’s what you should know:</p>

      <h2 className="text-xl font-semibold mt-10 mb-4">What We Collect</h2>
      <p className="mb-4">
        Right now, the only personal information we store is your{" "}
        <strong>location</strong> (if you allow it). This helps us surface
        relevant events near you.
      </p>
      <p className="mb-4">When we launch user accounts, we may collect:</p>
      <ul className="list-disc list-inside mb-6 space-y-1">
        <li>Your name</li>
        <li>Email address</li>
        <li>Profile photo</li>
        <li>Your location (still optional)</li>
      </ul>
      <p className="mb-6">
        {`We'll update this policy when those features go live, but we’re telling
        you now so you're aware.`}
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Why We Collect It</h2>
      <ul className="list-disc list-inside mb-6 space-y-1">
        <li>To help you find tech events near you.</li>
        <li>
          To eventually personalize your experience when you create a profile
          or set reminders.
        </li>
        <li>
          To understand how the platform is used and where to improve (we use{" "}
          <strong>Umami</strong> for basic analytics —{` it's privacy-focused and
          doesn’t track you across the web)`}.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-10 mb-4">How Your Data Is Stored</h2>
      <p className="mb-4">
        We use <strong>Supabase</strong> to store any data you give us.
        Supabase handles storage securely on their end.
      </p>
      <p className="mb-4">
        That said, we don’t encrypt personal data ourselves just yet — it’s on
        our roadmap.
      </p>
      <p className="mb-6">
        We also use <strong>Umami</strong> for analytics. It doesn’t collect
        personally identifiable information, and we don’t use cookies for
        tracking.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Your Rights</h2>
      <ul className="list-disc list-inside mb-6 space-y-1">
        <li>You can ask us to delete your data anytime.</li>
        <li>You can choose not to share your location.</li>
        <li>
          When signup is available, you’ll be able to update or remove your
          profile.
        </li>
      </ul>
      <p className="mb-6">We don’t sell or trade your data. Ever.</p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Third Parties</h2>
      <p className="mb-6">
        We may add services like Google Search Console or email reminders in
        the future. If that happens, we’ll update this policy and let you know
        what data (if any) those services interact with.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Questions?</h2>
      <p className="mb-6">
        Feel free to reach out to us directly. We&apos;re here to build something
        good — not sneak around with your information.
      </p>

      <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
        <p>
          Also see our <Link href="/terms-of-use" className="text-blue-600 hover:underline">Terms of Use</Link> for platform guidelines.
        </p>
        <p className="mt-2">
          Have questions? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link>.
        </p>
      </div>
    </main>
  );
}
