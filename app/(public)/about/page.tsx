import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Users2, Map, Zap, Layers } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "About Us - TechLinkUp",
  description:
    "Learn about TechLinkUp, Nigeria's community-driven platform for discovering tech events, conferences, meetups, and workshops across all 36 states.",
  alternates: {
    canonical: "https://techlinkup.xyz/about",
  },
  openGraph: {
    title: "About Us - TechLinkUp",
    description:
      "Learn about TechLinkUp, Nigeria's community-driven platform for discovering tech events, conferences, meetups, and workshops across all 36 states.",
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
    icon: Users2,
    title: "Community-Driven",
    body: "Events are submitted and curated by the community. We're all in this together, building the best resource for tech events in Nigeria.",
  },
  {
    icon: Map,
    title: "Nationwide Coverage",
    body: "From Lagos to Abuja, Port Harcourt to Enugu — discover tech events happening across all 36 states and major cities in Nigeria.",
  },
  {
    icon: Zap,
    title: "Easy to Use",
    body: "Simple, clean interface. Filter by location, category, or date. Submit your own events in minutes. No complicated processes.",
  },
  {
    icon: Layers,
    title: "Built for the Ecosystem",
    body: "We're committed to supporting Nigeria's growing tech ecosystem by making it easier for people to find opportunities to learn, network, and collaborate.",
  },
];


const steps = [
  {
    number: "01",
    title: "Submit",
    body: "Anyone in the community can submit a tech event. Fill out a simple form with your event details — takes under 5 minutes.",
  },
  {
    number: "02",
    title: "Review",
    body: "Our team reviews each submission within 1–2 business days to ensure quality and relevance to Nigeria's tech community.",
  },
  {
    number: "03",
    title: "Discover",
    body: "Approved events go live on the platform where thousands of tech enthusiasts can discover, bookmark, and attend.",
  },
];

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: statsData } = await supabase
    .from("public_stats")
    .select("*")
    .single();

  const stats = [
    { value: `${statsData?.published_events ?? 150}+`, label: "Events Listed" },
    { value: `${statsData?.cities_covered ?? 36}`, label: "Cities Covered" },
    { value: "10+", label: "Tech Categories" },
  ];

  return (
    <main className="min-h-screen bg-[#f5f4f2]">
      <PageHero
        backHref="/"
        backLabel="Home"
        eyebrow="Our Mission"
        title="About TechLinkUp"
        subtitle="Connecting Nigeria's tech community, one event at a time."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold text-[#1a1b25] mb-4">
            Our Mission
          </h2>
          <p className="text-[#4a4a5a] leading-relaxed mb-4">
            TechLinkUp is a{" "}
            <strong className="text-[#1a1b25]">community-driven platform</strong>{" "}
            built to help tech enthusiasts, developers, designers, and innovators
            across Nigeria discover and connect through events. We believe that
            the best way to grow a thriving tech ecosystem is by bringing people
            together — whether it&apos;s at conferences, meetups, workshops, or
            hackathons.
          </p>
          <p className="text-[#4a4a5a] leading-relaxed">
            Our platform is powered by the community, for the community. Anyone
            can submit events, track their submissions, and help build a
            comprehensive calendar of tech happenings across Nigeria. The more
            people contribute, the richer the ecosystem becomes for everyone.
          </p>
        </section>

        {/* Stats strip */}
        <section>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-5 text-center"
              >
                <p className="text-3xl font-bold text-[#0066cc] mb-1">
                  {s.value}
                </p>
                <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Offer */}
        <section>
          <h2 className="text-2xl font-bold text-[#1a1b25] mb-6">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c9f72f] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                <div className="inline-flex p-2 rounded-lg bg-[#0066cc]/[0.07] mb-4">
                  <f.icon className="h-5 w-5 text-[#0066cc]" />
                </div>
                <h3 className="font-semibold text-[#1a1b25] mb-2">{f.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="border-b border-[rgba(0,0,0,0.07)] pb-12">
          <h2 className="text-2xl font-bold text-[#1a1b25] mb-4">Our Story</h2>
          <div className="pl-4 border-l-2 border-[#0066cc]/30 space-y-4">
            <p className="text-[#4a4a5a] leading-relaxed">
              TechLinkUp was born out of a simple frustration: it was too hard to
              find tech events happening across Nigeria. Events were scattered
              across social media, WhatsApp groups, and word-of-mouth — there was
              no single, reliable source.
            </p>
            <p className="text-[#4a4a5a] leading-relaxed">
              We set out to change that by building a platform where the community
              could come together to share and discover events. Today, TechLinkUp
              serves thousands of tech enthusiasts across Nigeria, helping them
              find conferences, meetups, workshops, and more.
            </p>
            <p className="text-[#4a4a5a] leading-relaxed">
              We&apos;re just getting started. Our vision is to become the go-to
              platform for tech events across Africa, empowering communities to
              connect, learn, and grow together.
            </p>
          </div>
        </section>

        {/* How it Works */}
        <section>
          <h2 className="text-2xl font-bold text-[#1a1b25] mb-6">
            How It Works
          </h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-5 rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-5"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #0066cc 0%, #6b46c1 100%)",
                  }}
                >
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1b25] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <div
            className="rounded-2xl border border-[rgba(0,0,0,0.07)] p-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,102,204,0.04) 0%, rgba(201,247,47,0.06) 100%)",
            }}
          >
            <h2 className="text-2xl font-bold text-[#1a1b25] mb-3">
              Join the Community
            </h2>
            <p className="text-[#64748b] mb-8 max-w-sm mx-auto">
              Whether you&apos;re organizing events or just looking to attend,
              TechLinkUp is built for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/submit-event"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#c9f72f] hover:bg-[#b8e020] text-[#1a1b25] font-semibold transition-colors text-sm"
              >
                Submit Your Event
              </Link>
              <Link
                href="/"
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
          </div>
        </section>
      </div>
    </main>
  );
}
