import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "About Us - TechLinkUp",
  description: "Learn about TechLinkUp, Nigeria's community-driven platform for discovering tech events, conferences, meetups, and workshops across all 36 states.",
  alternates: {
    canonical: "https://techlinkup.xyz/about",
  },
  openGraph: {
    title: "About Us - TechLinkUp",
    description: "Learn about TechLinkUp, Nigeria's community-driven platform for discovering tech events, conferences, meetups, and workshops across all 36 states.",
    url: "https://techlinkup.xyz/about",
    images: [
      {
        url: "/linkup-og-image-1200x600.webp",
        width: 1200,
        height: 630,
        alt: "TechLinkUp - Discover Tech Events in Nigeria",
      },
    ],
  },
};

const features = [
  {
    title: "Community-Driven",
    body: "Events are submitted and curated by the community. We're all in this together, building the best resource for tech events in Nigeria.",
  },
  {
    title: "Nationwide Coverage",
    body: "From Lagos to Abuja, Port Harcourt to Enugu — discover tech events happening across all 36 states and major cities in Nigeria.",
  },
  {
    title: "Easy to Use",
    body: "Simple, clean interface. Filter by location, category, or date. Submit your own events in minutes. No complicated processes.",
  },
  {
    title: "Built for the Ecosystem",
    body: "We're committed to supporting Nigeria's growing tech ecosystem by making it easier for people to find opportunities to learn, network, and collaborate.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f5f4f2]">
      <PageHero
        backHref="/"
        backLabel="Home"
        title="About TechLinkUp"
        subtitle="Connecting Nigeria's tech community, one event at a time."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold text-[#1a1b25] mb-4">Our Mission</h2>
          <p className="text-[#4a4a5a] leading-relaxed mb-4">
            TechLinkUp is a <strong className="text-[#1a1b25]">community-driven platform</strong> built to help tech enthusiasts,
            developers, designers, and innovators across Nigeria discover and connect through events.
            We believe that the best way to grow a thriving tech ecosystem is by bringing people together—whether
            it&apos;s at conferences, meetups, workshops, or hackathons.
          </p>
          <p className="text-[#4a4a5a] leading-relaxed">
            Our platform is powered by the community, for the community. Anyone can submit events,
            track their submissions, and help build a comprehensive calendar of tech happenings across Nigeria.
          </p>
        </section>

        {/* What We Offer */}
        <section>
          <h2 className="text-2xl font-bold text-[#1a1b25] mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow"
              >
                <h3 className="font-semibold text-[#1a1b25] mb-2">{f.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="border-b border-[rgba(0,0,0,0.07)] pb-12">
          <h2 className="text-2xl font-bold text-[#1a1b25] mb-4">Our Story</h2>
          <div className="pl-4 border-l-2 border-[#c9f72f]/50 space-y-4">
            <p className="text-[#4a4a5a] leading-relaxed">
              TechLinkUp was born out of a simple frustration: it was too hard to find tech events
              happening across Nigeria. Events were scattered across social media, WhatsApp groups,
              and word-of-mouth—there was no single, reliable source.
            </p>
            <p className="text-[#4a4a5a] leading-relaxed">
              We set out to change that by building a platform where the community could come together
              to share and discover events. Today, TechLinkUp serves thousands of tech enthusiasts across
              Nigeria, helping them find conferences, meetups, workshops, and more.
            </p>
            <p className="text-[#4a4a5a] leading-relaxed">
              We&apos;re just getting started. Our vision is to become the go-to platform for tech events
              across Africa, empowering communities to connect, learn, and grow together.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-[#1a1b25] mb-3">Join the Community</h2>
          <p className="text-[#64748b] mb-8">
            Whether you&apos;re organizing events or just looking to attend, TechLinkUp is built for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit-event"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#c9f72f] hover:bg-[#b8e020] text-[#1a1b25] font-semibold transition-colors text-sm"
            >
              Submit Your Event
            </Link>
            <Link
              href="/#events"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[rgba(0,0,0,0.12)] bg-white hover:border-[#0066cc]/30 hover:text-[#0066cc] text-[#4a4a5a] font-semibold transition-colors text-sm"
            >
              Browse Events
            </Link>
          </div>
          <p className="text-[#64748b] text-sm mt-6">
            Have questions?{" "}
            <Link href="/contact" className="text-[#0066cc] hover:underline">
              Get in touch
            </Link>{" "}
            with our team.
          </p>
        </section>
      </div>
    </main>
  );
}
