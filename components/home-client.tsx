"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Filters from "@/components/filters";
import { Event } from "@/lib/validations/event";

// Lazy load below-the-fold components
const UpcomingEvents = dynamic(() => import("@/components/upcoming-events"), {
  ssr: false, // Disable SSR for this since we're passing server data
});
const Footer = dynamic(() => import("@/components/footer"), {
  ssr: true,
});

interface HomeClientProps {
  initialEvents: Event[];
  initialTotal: number;
  initialHasMore: boolean;
}

export default function HomeClient({
  initialEvents,
  initialTotal,
  initialHasMore,
}: HomeClientProps) {
  return (
    <div className="bg-gray-50 overflow-visible">
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Filters */}
      <Filters />

      {/* Always render upcoming */}
      <UpcomingEvents
        initialEvents={initialEvents}
        initialTotal={initialTotal}
        initialHasMore={initialHasMore}
      />

      <Footer />
    </div>
  );
}
