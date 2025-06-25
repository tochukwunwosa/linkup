"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Event } from "@/lib/validations/event";
import { getAllActiveEvents } from "@/app/actions/event/getAllActiveEvents";
import { geocodeAddress } from "@/lib/geocode";

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
  isLoading: boolean;
  isFirstLoad: boolean;
};

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

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

  const enrichEventData = async (data: Event[]): Promise<EventWithLocation[]> => {
    const enriched = await Promise.allSettled(
      data.map(async (event: Event) => {
        if (!event.location) return { ...event, city: undefined, country: undefined };

        const key = `geo-${event.id}`;
        const cached = sessionStorage.getItem(key);
        if (cached) {
          return { ...event, ...JSON.parse(cached) };
        }

        try {
          const geo = await geocodeAddress(event.location);
          sessionStorage.setItem(key, JSON.stringify(geo));
          return { ...event, city: geo?.city, country: geo?.country };
        } catch (error) {
          console.warn(`Failed to geocode address for event ${event.id}:`, error);
          return { ...event, city: undefined, country: undefined };
        }
      })
    );

    return enriched.map((res, i) =>
      res.status === "fulfilled" ? res.value : { ...data[i], city: undefined, country: undefined }
    );
  };

  const fetchEvents = useCallback(async () => {
    try {
      const cacheKey = "cachedEvents";
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setEvents(parsed);
        setFilteredEvents(parsed);
        setIsLoading(false);
        setIsFirstLoad(false);
      }

      const data = await getAllActiveEvents();
      const enriched = await enrichEventData(data);

      const existing = localStorage.getItem(cacheKey);
      const currentIds = JSON.stringify(enriched.map((e) => e.id));
      const existingIds = existing ? JSON.stringify(JSON.parse(existing).map((e: Event) => e.id)) : null;
      if (currentIds !== existingIds) {
        localStorage.setItem(cacheKey, JSON.stringify(enriched));
        setEvents(enriched);
        setFilteredEvents(enriched);
      }

      setIsLoading(false);
      setIsFirstLoad(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to fetch events", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  useEffect(() => {
    let newFilteredEvents = [...events];

    if (userLocation && userLocation.city && userLocation.country) {
      newFilteredEvents = newFilteredEvents.filter(event => {
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
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          const endOfWeek = new Date(now);
          endOfWeek.setDate(now.getDate() - now.getDay() + 6);
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
    <EventContext.Provider value={{ isFirstLoad, isLoading, events, filters, setFilters, filteredEvents, userLocation, setUserLocation }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEventContext must be used within EventProvider");
  return ctx;
};
