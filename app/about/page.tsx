import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

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


export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/">
        <Button variant="ghost" className="mb-6 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <h1 className="text-4xl font-bold mb-4 text-gray-900">About TechLinkUp</h1>
      <p className="text-lg text-gray-600 mb-12">
        Connecting Nigeria&apos;s tech community, one event at a time.
      </p>

      {/* Mission Statement */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          TechLinkUp is a <strong>community-driven platform</strong> built to help tech enthusiasts,
          developers, designers, and innovators across Nigeria discover and connect through events.
          We believe that the best way to grow a thriving tech ecosystem is by bringing people together—whether
          it&apos;s at conferences, meetups, workshops, or hackathons.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Our platform is powered by the community, for the community. Anyone can submit events,
          track their submissions, and help build a comprehensive calendar of tech happenings across Nigeria.
        </p>
      </div>

      {/* What We Offer */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community-Driven</h3>
            <p className="text-gray-600">
              Events are submitted and curated by the community. We&apos;re all in this together,
              building the best resource for tech events in Nigeria.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nationwide Coverage</h3>
            <p className="text-gray-600">
              From Lagos to Abuja, Port Harcourt to Enugu—discover tech events happening
              across all 36 states and major cities in Nigeria.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simple, clean interface. Filter by location, category, or date. Submit your own
              events in minutes. No complicated processes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Built for the Ecosystem</h3>
            <p className="text-gray-600">
              We&apos;re committed to supporting Nigeria&apos;s growing tech ecosystem by making it
              easier for people to find opportunities to learn, network, and collaborate.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="mb-12 pb-12 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          TechLinkUp was born out of a simple frustration: it was too hard to find tech events
          happening across Nigeria. Events were scattered across social media, WhatsApp groups,
          and word-of-mouth—there was no single, reliable source.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          We set out to change that by building a platform where the community could come together
          to share and discover events. Today, TechLinkUp serves thousands of tech enthusiasts across
          Nigeria, helping them find conferences, meetups, workshops, and more.
        </p>
        <p className="text-gray-700 leading-relaxed">
          We&apos;re just getting started. Our vision is to become the go-to platform for tech events
          across Africa, empowering communities to connect, learn, and grow together.
        </p>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Join the Community</h2>
        <p className="text-gray-600 mb-6">
          Whether you&apos;re organizing events or just looking to attend, TechLinkUp is built for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/submit-event">
            <Button size="lg" className="w-full sm:w-auto">
              Submit Your Event
            </Button>
          </Link>
          <Link href="/#events">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Browse Events
            </Button>
          </Link>
        </div>
        <p className="text-gray-500 text-sm mt-6">
          Have questions? <Link href="/contact" className="text-blue-600 hover:underline">Get in touch</Link> with our team.
        </p>
      </div>
    </main>
  );
}
