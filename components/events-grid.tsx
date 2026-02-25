"use client";

import React from "react";
import { Calendar, Sparkles } from "lucide-react";
import AnimatedCard from "./animated-card";
import EventCard from "./event-card";
import { SkeletonGrid } from "./event-card-skeleton-grid";
import useInfiniteScrollEvents from "@/hooks/useInfinteScrollEvent";
import { useEventContext } from "@/context/EventContext";
import { Event } from "@/lib/validations/event";

interface EventsGridProps {
  title: string;
  initialEvents?: Event[];
  initialTotal?: number;
  initialHasMore?: boolean;
}

export default function EventsGrid({
  title,
  initialEvents = [],
  initialTotal = 0,
  initialHasMore = true
}: EventsGridProps) {
  const { filters, setFilters } = useEventContext();

  const {
    events,
    observerRef,
    loading,
    hasMore
  } = useInfiniteScrollEvents({
    filters,
    initialEvents,
    initialTotal,
    initialHasMore
  });

  return (
    <section id="events" className="mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#1a1b25]">
              {title}
            </h2>
            {initialTotal > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0066cc]/[0.08] text-[#0066cc] text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                {initialTotal} events
              </span>
            )}
          </div>
          <div className="hidden sm:block h-px flex-1 max-w-[200px] ml-6 bg-gradient-to-r from-[rgba(0,0,0,0.08)] to-transparent" />
        </div>

        {loading && events.length === 0 ? (
          <SkeletonGrid count={3} />
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => {
                const shouldPlaceObserver = hasMore && index === Math.max(0, events.length - 6);

                return (
                  <React.Fragment key={event.id}>
                    <AnimatedCard delay={index * 100}>
                      <EventCard event={event} />
                    </AnimatedCard>
                    {shouldPlaceObserver && (
                      <div ref={observerRef} className="absolute h-1 w-1 pointer-events-none" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {loading && events.length > 0 && (
              <div className="flex justify-center items-center py-8">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0066cc]/[0.08] text-[#0066cc]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0066cc] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0066cc]" />
                  </span>
                  <span className="text-sm font-medium">Loading more events…</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0066cc]/[0.07] ring-1 ring-[#0066cc]/[0.12] mb-6">
              <Calendar className="h-9 w-9 text-[#0066cc]/70" />
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#c9f72f] border-2 border-[#f5f4f2]"
                aria-hidden="true"
              />
            </div>
            <h3 className="font-display text-xl font-bold text-[#1a1b25] mb-2">
              No events found
            </h3>
            <p className="text-[#64748b] text-sm mb-7 max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t find any events matching your filters. Try adjusting your search or clearing filters to discover more events.
            </p>
            <button
              onClick={() => {
                setFilters({
                  category: [],
                  format: "all",
                  location: "all",
                  date: "all",
                  city: "",
                  country: "",
                  search: ""
                });
              }}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#c9f72f] hover:bg-[#dbff45] text-[#1a1b25] text-sm font-semibold transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
