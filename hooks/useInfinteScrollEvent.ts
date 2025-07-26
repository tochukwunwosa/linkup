import { useEffect, useRef, useState } from "react";
import { Event } from "@/lib/validations/event";
import { useInView } from "react-intersection-observer";
import { useEventContext } from "@/context/EventContext";

export default function useInfiniteScrollEvents({ filters }: { filters: any }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setTotalEventsFound, userLocation } = useEventContext();

  // Trigger earlier - when 200px from bottom instead of exactly at bottom
  const { ref: observerRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "200px", // Trigger 200px before the element comes into view
  });

  // Load more when triggered
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  // Refetch on filters change
  useEffect(() => {
    setPage(1);
    setEvents([]);
    setHasMore(true);
  }, [JSON.stringify(filters)]);

  // Fetch paginated data
  useEffect(() => {
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

        console.log("Fetching with params:", params.toString()); // Debug log

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
      } catch (err) {
        console.error("Failed to fetch events", err);
        setHasMore(false); // Stop trying to fetch more on error
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, JSON.stringify(filters), setTotalEventsFound]);

  return {
    events,
    observerRef,
    hasMore,
    loading,
  };
}
