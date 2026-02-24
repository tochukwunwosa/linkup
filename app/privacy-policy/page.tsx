import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <main className="min-h-screen bg-[#f5f4f2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1a1b25] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-[#1a1b25] mb-3">Privacy Policy</h1>
        <p className="text-sm text-[#64748b] mb-10">
          Effective: June 2025 · Last Updated: June 25, 2025
        </p>

        <div className="text-base leading-relaxed text-[#4a4a5a] space-y-6">
          <p>
            Hi. This is the privacy policy for <strong className="text-[#1a1b25]">TechLinkUp</strong> — a
            space built for developers and tech folks to connect, explore events,
            and stay in the loop.
          </p>

          <p>We take your privacy seriously. Here&apos;s what you should know:</p>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">What We Collect</h2>
          <p>
            Right now, the only personal information we store is your{" "}
            <strong className="text-[#1a1b25]">location</strong> (if you allow it). This helps us surface
            relevant events near you.
          </p>
          <p>When we launch user accounts, we may collect:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Your name</li>
            <li>Email address</li>
            <li>Profile photo</li>
            <li>Your location (still optional)</li>
          </ul>
          <p>
            {`We'll update this policy when those features go live, but we're telling
            you now so you're aware.`}
          </p>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">Why We Collect It</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>To help you find tech events near you.</li>
            <li>
              To eventually personalize your experience when you create a profile
              or set reminders.
            </li>
            <li>
              To understand how the platform is used and where to improve (we use{" "}
              <strong className="text-[#1a1b25]">Umami</strong> for basic analytics — it&apos;s privacy-focused and
              doesn&apos;t track you across the web).
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">How Your Data Is Stored</h2>
          <p>
            We use <strong className="text-[#1a1b25]">Supabase</strong> to store any data you give us.
            Supabase handles storage securely on their end.
          </p>
          <p>
            That said, we don&apos;t encrypt personal data ourselves just yet — it&apos;s on
            our roadmap.
          </p>
          <p>
            We also use <strong className="text-[#1a1b25]">Umami</strong> for analytics. It doesn&apos;t collect
            personally identifiable information, and we don&apos;t use cookies for
            tracking.
          </p>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">Your Rights</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>You can ask us to delete your data anytime.</li>
            <li>You can choose not to share your location.</li>
            <li>
              When signup is available, you&apos;ll be able to update or remove your
              profile.
            </li>
          </ul>
          <p>We don&apos;t sell or trade your data. Ever.</p>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">Third Parties</h2>
          <p>
            We may add services like Google Search Console or email reminders in
            the future. If that happens, we&apos;ll update this policy and let you know
            what data (if any) those services interact with.
          </p>

          <h2 className="text-xl font-semibold text-[#1a1b25] mt-10 mb-3">Questions?</h2>
          <p>
            Feel free to reach out to us directly. We&apos;re here to build something
            good — not sneak around with your information.
          </p>

          <div className="mt-10 pt-8 border-t border-[rgba(0,0,0,0.07)] text-sm text-[#64748b] space-y-2">
            <p>
              Also see our{" "}
              <Link href="/terms-of-use" className="text-[#0066cc] hover:underline">
                Terms of Use
              </Link>{" "}
              for platform guidelines.
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
