"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin } from "lucide-react";
import AnimatedCard from "./animated-card";
import EventCard from "./event-card";
import { SkeletonGrid } from "./event-card-skeleton-grid";
import Link from "next/link";
import { useEventContext } from "@/context/EventContext";
import { Event } from "@/lib/validations/event";

interface EventsNearYouProps {
  maxEvents?: number;
  showViewAll?: boolean;
}

export default function EventsNearYou({
  maxEvents = 4,
  showViewAll = true
}: EventsNearYouProps) {
  const { filters, userLocation } = useEventContext();

  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch nearby events
  const fetchNearbyEvents = useCallback(async () => {
    if (!userLocation?.lat || !userLocation?.lng) return;

    setLoading(true);
    try {
      const response = await fetch('/api/events/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          radius: 50,
          limit: maxEvents,
          ...filters,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch nearby events');

      const data = await response.json();
      setNearbyEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching nearby events:', error);
      setNearbyEvents([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation, filters, maxEvents]);


  // Fetch events when location is available or filters change
  useEffect(() => {
    if (userLocation?.lat && userLocation?.lng) {
      fetchNearbyEvents();
    }
  }, [userLocation, filters, fetchNearbyEvents]);

  // Location permission prompt - uses your existing modal system
  const LocationPrompt = () => (
    <AnimatedCard>
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Find Events Near You
        </h3>
        <p className="text-gray-600 mb-4">
          Location access is needed to discover events in your area.
          {userLocation?.city && ` Currently showing events near ${userLocation.city}`}
        </p>
        <p className="text-sm text-gray-500">
          Your location permission is handled automatically when you first visit the site.
        </p>
      </div>
    </AnimatedCard>
  );

  // Don't render anything if no location and no events
  if (!userLocation && !loading && nearbyEvents.length === 0) {
    return <LocationPrompt />;
  }


  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <MapPin className="w-6 h-6 text-blue-600 mr-2" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Events Near You
              </h2>
              {userLocation?.city && (
                <p className="text-sm text-gray-600 mt-1">
                  in {userLocation.city}, {userLocation.country}
                </p>
              )}
            </div>
          </div>

          {showViewAll && nearbyEvents.length > 0 && (
            <Link
              href="/events/nearby"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View all nearby events
              <span className="ml-1">→</span>
            </Link>
          )}
        </div>

        {/* Show loading state */}
        {loading && <SkeletonGrid count={maxEvents} />}

        {/* Show nearby events */}
        {nearbyEvents.length > 0 && (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                {nearbyEvents.length} event{nearbyEvents.length !== 1 ? 's' : ''} within 50km
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {nearbyEvents.map((event, index) => (
                <AnimatedCard key={event.id} delay={index * 100}>
                  <EventCard
                    event={event}
                  />
                </AnimatedCard>
              ))}
            </div>
          </>
        )}

        {/* Empty state for when location is available but no events found */}
        {userLocation && !loading && nearbyEvents.length === 0 && (
          <AnimatedCard>
            <div className="text-center py-8">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No events found nearby
              </h3>
              <p className="text-gray-600 mb-4">
                Try expanding your search radius or check back later for new events in {userLocation.city}.
              </p>
              {showViewAll && (
                <Link
                  href="/events"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
                >
                  View all events
                </Link>
              )}
            </div>
          </AnimatedCard>
        )}
      </div>
    </section>
  );
}