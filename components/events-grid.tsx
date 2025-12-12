"use client";

import React from "react";
import { Calendar } from "lucide-react";
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
        <div className="mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
        </div>

        {loading && events.length === 0 ? (
          <SkeletonGrid count={3} />
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => {
                // Place observer trigger after 6th-to-last item
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
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  <span className="text-sm">Loading more events...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No events found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any events matching your filters. Try adjusting your search or filters to discover more events.
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
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
