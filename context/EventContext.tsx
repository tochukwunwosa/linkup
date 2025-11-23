"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Filters } from "@/lib/filter-helper";

type UserLocation = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};

interface EventContextType {
  filters: Filters;
  setFilters: (update: Partial<Filters>) => void;
  totalEventsFound: number;
  setTotalEventsFound: (count: number) => void;
  userLocation: UserLocation | null;
  setUserLocation: (loc: UserLocation | null) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [filters, setRawFilters] = useState<Filters>({
    category: [],
    format: "all",
    location: "all",
    date: "all",
    city: "",
    country: "",
    search: "",
  });

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [totalEventsFound, setTotalEventsFound] = useState(0);

  // Use useCallback to prevent setFilters from being recreated on every render
  const setFilters = useCallback((update: Partial<Filters>) => {
    setRawFilters((prev) => ({ ...prev, ...update }));
  }, []);

  return (
    <EventContext.Provider
      value={{
        filters,
        setFilters,
        totalEventsFound,
        setTotalEventsFound,
        userLocation,
        setUserLocation,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within EventProvider");
  }
  return context;
}