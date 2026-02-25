"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/hero";
import Filters from "@/components/filters";
import { CategoryBrowseStrip } from "@/components/category-browse-strip";
import { SkeletonGrid } from "@/components/event-card-skeleton-grid";
import { Event } from "@/lib/validations/event";

const UpcomingEvents = dynamic(() => import("@/components/upcoming-events"), {
  loading: () => <SkeletonGrid count={6} />,
  ssr: false,
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
    <div>
      <Hero initialTotal={initialTotal} />

      <div className="relative" style={{background:"linear-gradient(180deg, #f5f4f2 0%, #f7f6f4 100%)"}}>
        <CategoryBrowseStrip />
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
