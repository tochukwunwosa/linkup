import { useEffect, useRef, useState } from "react";
import { Event } from "@/lib/validations/event";
import { useInView } from "react-intersection-observer";
import { useEventContext } from "@/context/EventContext";

export default function useInfiniteScrollEvents({ filters }: { filters: any }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [shouldFetchNext, setShouldFetchNext] = useState(false);
  const { setTotalEventsFound, userLocation } = useEventContext();
  const filtersStringRef = useRef<string>("");
  const userLocationStringRef = useRef<string>("");
  const prevPageRef = useRef<number>(1);

  // Much more aggressive prefetching - trigger 1500px before observer
  const { ref: observerRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "1500px", // Start loading much earlier
  });

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
        console.log("User location detected, re-sorting events by proximity:", userLocation);
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

        console.log("Fetching page:", page, "with params:", params.toString());

        const res = await fetch(`/api/events?${params.toString()}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to fetch events");
        }

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
