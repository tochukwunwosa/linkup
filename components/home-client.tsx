"use client";

import Hero from "@/components/hero";
import Filters from "@/components/filters";
import UpcomingEvents from "@/components/upcoming-events";
import { Event } from "@/lib/validations/event";

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
    <div>
      <Hero initialTotal={initialTotal} />

      <div className="relative" style={{background:"linear-gradient(180deg, #f5f4f2 0%, #f7f6f4 100%)"}}>

      <Filters />

      <UpcomingEvents
        initialEvents={initialEvents}
        initialTotal={initialTotal}
        initialHasMore={initialHasMore}
      />
      </div>
    </div>
  );
}
