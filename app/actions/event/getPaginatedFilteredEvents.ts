import {
  getEndOfDay,
  getEndOfMonth,
  getEndOfWeek,
  getStartOfDay,
  getStartOfMonth,
  getStartOfWeek,
} from "@/lib/filter-helper";
import { createClient } from "@/lib/supabase/server";
import { haversineDistance } from "@/lib/utils";
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
    const { data, error } = await supabase.from("public_events").select("*");

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
  if (userLocation && userLocation.lat && userLocation.lng) {
    console.log("Sorting events by user proximity:", userLocation);

    const userCity = userLocation.city?.toLowerCase();
    const userCountry = userLocation.country?.toLowerCase();
    const userLat = userLocation.lat;
    const userLng = userLocation.lng;

    const cityEvents: Event[] = [];
    const countryEvents: Event[] = [];
    const nearbyEvents: (Event & { distance?: number })[] = [];
    const otherEvents: Event[] = [];

    for (const event of filteredResults) {
      const eventCity = event.city?.toLowerCase();
      const eventCountry = event.country?.toLowerCase();

      if (userCity && eventCity === userCity) {
        cityEvents.push(event);
      } else if (userCountry && eventCountry === userCountry) {
        countryEvents.push(event);
      } else if (
        userLat !== undefined &&
        userLng !== undefined &&
        event.lat &&
        event.lng
      ) {
        const distance = haversineDistance(
          userLat,
          userLng,
          event.lat,
          event.lng
        );
        if (distance <= 1000) {
          // 1000 km threshold for "nearby"
          nearbyEvents.push({ ...event, distance });
        } else {
          otherEvents.push(event);
        }
      } else {
        otherEvents.push(event);
      }
    }

    // Sort each group
    cityEvents.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    countryEvents.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    nearbyEvents.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    otherEvents.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

    // Merge all groups: city first, then country, nearby, others
    filteredResults = [
      ...cityEvents,
      ...countryEvents,
      ...nearbyEvents,
      ...otherEvents,
    ];

    console.log(`Events sorted by proximity: ${cityEvents.length} in city, ${countryEvents.length} in country, ${nearbyEvents.length} nearby, ${otherEvents.length} others`);
  } else {
    console.log("No user location available, showing events in default order");
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
