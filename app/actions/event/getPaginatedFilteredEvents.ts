import {
  getEndOfDay,
  getEndOfMonth,
  getEndOfWeek,
  getStartOfDay,
  getStartOfMonth,
  getStartOfWeek,
} from "@/lib/filter-helper";
import { createClient } from "@/lib/supabase/server";
import { Event } from "@/lib/validations/event";

type Filters = {
  category: string[];
  format: string;
  location: string;
  date: string;
  city: string;
  country: string;
};

type UserLocation = {
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
};

export async function getPaginatedFilteredEvents({
  page = 1,
  limit = 10,
  filters,
  userLocation,
}: {
  page: number;
  limit: number;
  filters: Filters;
  userLocation?: UserLocation | null;
}) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  let results: Event[] = [];

  // Get initial dataset based on category filter
  if (filters.category.length > 0) {
    // Use RPC for category filtering
    const { data: categoryMatched, error } = await supabase.rpc(
      "search_events_by_categories",
      {
        keywords: filters.category,
      }
    );

    if (error) {
      console.error("RPC error:", error);
      return { data: [], hasMore: false, total: 0 };
    }

    results = categoryMatched as Event[];
  } else {
    // Get all events if no category filter
    const { data, error } = await supabase
      .from("public_events")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return { data: [], hasMore: false, total: 0 };
    }

    results = data as Event[];
  }

  // Apply all other filters in-memory
  let filteredResults = results;

  // Format filter
  if (filters.format !== "all") {
    filteredResults = filteredResults.filter((e) =>
      e.type.toLowerCase().includes(filters.format.toLowerCase())
    );
  }

  // Location filter
  if (filters.location !== "all") {
    filteredResults = filteredResults.filter((e) =>
      e.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  // City filter
  if (filters.city) {
    filteredResults = filteredResults.filter((e) =>
      e.city?.toLowerCase().includes(filters.city.toLowerCase())
    );
  }

  // Country filter
  if (filters.country) {
    filteredResults = filteredResults.filter((e) =>
      e.country?.toLowerCase().includes(filters.country.toLowerCase())
    );
  }

  // Date filter
  const now = new Date();
  if (filters.date !== "all") {
    filteredResults = filteredResults.filter((e) => {
      const start = new Date(e.start_date);

      let rangeStart: Date;
      let rangeEnd: Date;

      switch (filters.date) {
        case "today":
          rangeStart = getStartOfDay(now);
          rangeEnd = getEndOfDay(now);
          break;
        case "week":
          rangeStart = getStartOfWeek(now);
          rangeEnd = getEndOfWeek(now);
          break;
        case "month":
          rangeStart = getStartOfMonth(now);
          rangeEnd = getEndOfMonth(now);
          break;
        default:
          return true;
      }

      return start >= rangeStart && start <= rangeEnd;
    });
  }

  // Sort by user proximity
  if (userLocation?.city || userLocation?.country) {
    filteredResults = filteredResults.sort((a, b) => {
      const aCityMatch =
        a.city?.toLowerCase() === userLocation?.city?.toLowerCase();
      const bCityMatch =
        b.city?.toLowerCase() === userLocation?.city?.toLowerCase();
      const aCountryMatch =
        a.country?.toLowerCase() === userLocation?.country?.toLowerCase();
      const bCountryMatch =
        b.country?.toLowerCase() === userLocation?.country?.toLowerCase();

      if (aCityMatch && !bCityMatch) return -1;
      if (!aCityMatch && bCityMatch) return 1;
      if (aCountryMatch && !bCountryMatch) return -1;
      if (!aCountryMatch && bCountryMatch) return 1;

      return 0;
    });
  }

  // Apply pagination
  const totalResults = filteredResults.length;
  const paginatedResults = filteredResults.slice(offset, offset + limit);
  const hasMore = totalResults > offset + limit;

  return {
    data: paginatedResults,
    hasMore,
    total: totalResults,
  };
}
