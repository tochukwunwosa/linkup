import { useEffect, useRef, useState } from "react";
import { Event } from "@/lib/validations/event";
import { useInView } from "react-intersection-observer";
import { useEventContext } from "@/context/EventContext";

export default function useInfiniteScrollEvents({
  filters,
  initialEvents = [],
  initialTotal = 0,
  initialHasMore = true
}: {
  filters: any;
  initialEvents?: Event[];
  initialTotal?: number;
  initialHasMore?: boolean;
}) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [page, setPage] = useState(initialEvents.length > 0 ? 2 : 1); // Start at page 2 if we have initial data
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [shouldFetchNext, setShouldFetchNext] = useState(false);
  const { setTotalEventsFound, userLocation } = useEventContext();
  const filtersStringRef = useRef<string>("");
  const userLocationStringRef = useRef<string>("");
  const prevPageRef = useRef<number>(initialEvents.length > 0 ? 1 : 0); // Set to 1 if we have initial data
  const [isInitialized, setIsInitialized] = useState(initialEvents.length > 0);

  // Prefetch when user scrolls near the bottom - balanced for performance
  const { ref: observerRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "600px", // Start loading 600px before reaching bottom
  });

  // Set initial total count if provided
  useEffect(() => {
    if (isInitialized && initialTotal > 0) {
      setTotalEventsFound(initialTotal);
    }
  }, [isInitialized, initialTotal, setTotalEventsFound]);

  // Load more when triggered
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setShouldFetchNext(true);
    }
  }, [inView, hasMore, loading]);

  // Refetch on filters change - use ref to avoid unnecessary rerenders
  useEffect(() => {
    const filtersString = JSON.stringify(filters);
    if (filtersString !== filtersStringRef.current) {
      filtersStringRef.current = filtersString;
      setLoading(true); // Set loading immediately to prevent flash
      setPage(1);
      setEvents([]);
      setHasMore(true);
      setShouldFetchNext(false);
      prevPageRef.current = 0; // Reset to force refetch
    }
  }, [filters]);

  // Refetch when userLocation changes (when user grants location permission)
  useEffect(() => {
    const userLocationString = JSON.stringify(userLocation);
    const hasLocationChanged = userLocationString !== userLocationStringRef.current;

    if (hasLocationChanged) {
      const wasNull = userLocationStringRef.current === "" || userLocationStringRef.current === "null";
      const isNowAvailable = userLocation !== null;

      // Update the ref
      userLocationStringRef.current = userLocationString;

      // Refetch if location became available or changed
      if (isNowAvailable) {
        setLoading(true); // Set loading immediately
        setPage(1);
        setEvents([]);
        setHasMore(true);
        setShouldFetchNext(false);
        prevPageRef.current = 0; // Reset to force refetch
      }
    }
  }, [userLocation]);

  // Trigger page increment when shouldFetchNext is true
  useEffect(() => {
    if (shouldFetchNext && hasMore && !loading) {
      setShouldFetchNext(false);
      setPage((prev) => prev + 1);
    }
  }, [shouldFetchNext, hasMore, loading]);

  // Fetch paginated data
  useEffect(() => {
    // Skip if we haven't actually changed page or if we're already on page > 1 and haven't moved
    if (prevPageRef.current === page && page !== 1) {
      return;
    }
    prevPageRef.current = page;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "9");

        // Category is array — send comma-separated or multiple entries
        if (filters.category && filters.category.length > 0) {
          filters.category.forEach((cat: string) =>
            params.append("category", cat)
          );
        }

        // Others as normal - only add if they're not default values
        if (filters.format && filters.format !== "all") {
          params.set("format", filters.format);
        }
        if (filters.location && filters.location !== "all") {
          params.set("location", filters.location);
        }
        if (userLocation?.lat && userLocation?.lng) {
          params.set("lat", userLocation.lat.toString());
          params.set("lng", userLocation.lng.toString());
          // Also send city and country for better matching
          if (userLocation.city) {
            params.set("userCity", userLocation.city);
          }
          if (userLocation.country) {
            params.set("userCountry", userLocation.country);
          }
        }
        if (filters.date && filters.date !== "all") {
          params.set("date", filters.date);
        }
        if (filters.city && filters.city.trim() !== "") {
          params.set("city", filters.city);
        }
        if (filters.country && filters.country.trim() !== "") {
          params.set("country", filters.country);
        }
        if (filters.search && filters.search.trim() !== "") {
          params.set("search", filters.search);
        }


        const res = await fetch(`/api/events?${params.toString()}`);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error Response:", res.status, errorText);
          throw new Error(`Failed to fetch events: ${res.status} ${errorText}`);
        }
        
        const json = await res.json();

        setEvents((prev) => (page === 1 ? json.data : [...prev, ...json.data]));
        setHasMore(json.hasMore);

        // Fix total count calculation - should be total from API, not just current page
        if (page === 1) {
          setTotalEventsFound(json.total || json.data?.length || 0);
        }

        // Prefetch next page immediately if we still have more
        // This creates the "instant" feel like social media
        if (json.hasMore && page === 1) {
          setTimeout(() => {
            setShouldFetchNext(true);
          }, 100);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
        setHasMore(false); // Stop trying to fetch more on error
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, filters, setTotalEventsFound, userLocation]);

  return {
    events,
    observerRef,
    hasMore,
    loading,
  };
}
