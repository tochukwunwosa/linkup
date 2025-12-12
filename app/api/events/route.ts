import { getPaginatedFilteredEvents } from "@/app/actions/event/getPaginatedFilteredEvents";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Collect all `category` params (supporting multiple values)
    const category = searchParams.getAll("category");

    const filters = {
      category: category.length > 0 ? category : [], // if empty, means "all"
      format: searchParams.get("format") || "all",
      location: searchParams.get("location") || "all",
      date: searchParams.get("date") || "all",
      city: searchParams.get("city") || "",
      country: searchParams.get("country") || "",
      search: searchParams.get("search") || "",
    };

    // Extract user location from query params
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const userLocationCity = searchParams.get("userCity");
    const userLocationCountry = searchParams.get("userCountry");

    const userLocation = lat && lng ? {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      city: userLocationCity || undefined,
      country: userLocationCountry || undefined,
    } : null;

    const { data, hasMore, total } = await getPaginatedFilteredEvents({
      page,
      limit,
      filters,
      userLocation,
    });

    return Response.json({ data, hasMore, total });
  } catch (error) {
    console.error("Error in /api/events:", error);
    return Response.json(
      { error: "Failed to fetch events", data: [], hasMore: false, total: 0 },
      { status: 500 }
    );
  }
}
