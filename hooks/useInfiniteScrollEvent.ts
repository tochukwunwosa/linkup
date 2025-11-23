import { useEffect } from "react";
import { Event } from "@/lib/validations/event";
import { useInView } from "react-intersection-observer";
import { useEventContext } from "@/context/EventContext";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";

interface FetchEventsResponse {
  data: Event[];
  hasMore: boolean;
  total: number;
}

async function fetchEvents({
  page,
  filters,
  userLocation,
}: {
  page: number;
  filters: any;
  userLocation: any;
}): Promise<FetchEventsResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "9");

  // Category is array — send comma-separated or multiple entries
  if (filters.category && filters.category.length > 0) {
    filters.category.forEach((cat: string) => params.append("category", cat));
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

  console.log("Fetching page:", page, "with params:", params.toString());

  const res = await fetch(`/api/events?${params.toString()}`);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error Response:", res.status, errorText);
    throw new Error(`Failed to fetch events: ${res.status} ${errorText}`);
  }

  return res.json();
}

export default function useInfiniteScrollEvents({ filters }: { filters: any }) {
  const { setTotalEventsFound, userLocation } = useEventContext();

  // Much more aggressive prefetching - trigger 1500px before observer
  const { ref: observerRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "1500px", // Start loading much earlier
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["events", filters, userLocation],
    queryFn: ({ pageParam }) =>
      fetchEvents({ page: pageParam, filters, userLocation }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    placeholderData: keepPreviousData, // Keep previous data while loading new results
  });

  // Update total events count when data changes
  useEffect(() => {
    if (data?.pages?.[0]?.total !== undefined) {
      setTotalEventsFound(data.pages[0].total);
    }
  }, [data, setTotalEventsFound]);

  // Load more when observer comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into a single array of events
  const events = data?.pages.flatMap((page) => page.data) ?? [];

  // Only show skeleton on initial load, not when filters change
  const loading = isLoading;

  return {
    events,
    observerRef,
    hasMore: hasNextPage ?? false,
    loading,
    isFetching, // Use this to show a subtle loading indicator without clearing the list
  };
}
