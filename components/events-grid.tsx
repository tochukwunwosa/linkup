"use client"




import { Event } from "@/lib/validations/event"
import EventCard from './event-card'
import { Calendar } from "lucide-react";
import AnimatedCard from "./animated-card";
import { SkeletonGrid } from "./event-card-skeleton-grid";
import useInfiniteScrollEvents from "@/hooks/useInfinteScrollEvent";

interface UpcomingEventsProp {
  title: string;
  events: Event[];
  isLoading: boolean
}

export default function EventsGrid({ title, events, isLoading }: UpcomingEventsProp) {
  const { visibleEvents, observerRef } = useInfiniteScrollEvents(events, 10, 4);

  return (

    <section id="events" className="mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-muted-foreground text-xs">{events.length} {events.length > 1 ? "events" : "event"} found</p>
        </div>

        {isLoading ? (
          <SkeletonGrid count={3} />
        ) :
          events.length > 0 ?
            (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleEvents.map((event, index) => (
                  <AnimatedCard key={event.id} delay={index * 100}>
                    <EventCard event={event} />
                  </AnimatedCard>
                ))}
                <div ref={observerRef} className="h-1 w-full col-span-full"></div>
              </div>
            )

            :
            (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Calendar className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more events.</p>
              </div>
            )
        }
      </div>
    </section>

  )
}

