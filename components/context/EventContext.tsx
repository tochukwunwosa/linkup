"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Event } from "@/lib/validations/event";
import { getAllActiveEvents } from "@/app/actions/event/getAllActiveEvents";
import { geocodeAddress } from "@/lib/geocode";

// Add user location type
interface UserLocation {
  city: string;
  country: string;
  lat?: number;
  lng?: number;
}

type EventWithLocation = Event & { city?: string; country?: string };

type EventContextType = {
  events: EventWithLocation[];
  filters: {
    category: string;
    format: string;
    location: string;
    date: string;
  };
  setFilters: (filters: Partial<EventContextType["filters"]>) => void;
  filteredEvents: EventWithLocation[];
  userLocation: UserLocation | null;
  setUserLocation: (loc: UserLocation) => void;
};

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<EventWithLocation[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithLocation[]>([]);
  const [filters, setFiltersState] = useState({
    category: "all",
    format: "all",
    location: "all",
    date: "all",
  });
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const setFilters = (partial: Partial<typeof filters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  };

  // Enrich events with city/country after fetching
  const fetchEvents = useCallback(async () => {
    try {
      const data = await getAllActiveEvents();

      // Enrich each event with city/country, but don't fail if geocoding fails
      const enriched = await Promise.allSettled(
        data.map(async (event: Event) => {
          if (!event.location) return { ...event, city: undefined, country: undefined };

          try {
            const geo = await geocodeAddress(event.location);
            return { ...event, city: geo?.city, country: geo?.country };
          } catch (error) {
            console.warn(`Failed to geocode address for event ${event.id}:`, error);
            return { ...event, city: undefined, country: undefined };
          }
        })
      );

      // Extract successful results and handle rejected ones
      const successfulEvents = enriched
        .map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.warn(`Failed to process event ${data[index]?.id}:`, result.reason);
            return { ...data[index], city: undefined, country: undefined };
          }
        })
        .filter(Boolean);

      setEvents(successfulEvents);
      setFilteredEvents(successfulEvents);
    } catch (error) {
      console.error("Failed to fetch events", error);
      // Don't clear existing events on error, just log it
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  useEffect(() => {
    let newFilteredEvents = [...events];

    // Location-based filtering (skip if no userLocation)
    if (userLocation && userLocation.city && userLocation.country) {
      newFilteredEvents = newFilteredEvents.filter(event => {
        // Match by city or country
        return (
          (event.city && event.city.toLowerCase() === userLocation.city.toLowerCase()) ||
          (event.country && event.country.toLowerCase() === userLocation.country.toLowerCase())
        );
      });
    }

    if (filters.category !== 'all') {
      newFilteredEvents = newFilteredEvents.filter(event => event.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.format !== 'all') {
      newFilteredEvents = newFilteredEvents.filter(event => {
        if (filters.format === 'online') return event.type === 'Online';
        if (filters.format === 'in-person') return event.type.includes('In-person');
        return true;
      });
    }

    if (filters.location !== 'all') {
      newFilteredEvents = newFilteredEvents.filter(event => event.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    if (filters.date !== 'all') {
      const now = new Date();
      newFilteredEvents = newFilteredEvents.filter(event => {
        const eventDate = new Date(event.start_date);
        if (filters.date === 'today') return eventDate.toDateString() === now.toDateString();
        if (filters.date === 'week') {
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        }
        if (filters.date === 'month') {
          return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    setFilteredEvents(newFilteredEvents);
  }, [filters, events, userLocation]);

  

  return (
    <EventContext.Provider value={{ events, filters, setFilters, filteredEvents, userLocation, setUserLocation }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEventContext must be used within EventProvider");
  return ctx;
};
