"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/hero";
import Filters from "@/components/filters";
import { Event } from "@/lib/validations/event";

// Lazy load below-the-fold components
const UpcomingEvents = dynamic(() => import("@/components/upcoming-events"), {
  ssr: false, // Disable SSR for this since we're passing server data
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
    <div className=" ">
      <Hero initialTotal={initialTotal} />

      <Filters />

      <UpcomingEvents
        initialEvents={initialEvents}
        initialTotal={initialTotal}
        initialHasMore={initialHasMore}
      />
    </div>
  );
}
