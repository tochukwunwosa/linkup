import { getPaginatedFilteredEvents } from "@/app/actions/event/getPaginatedFilteredEvents";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const rawCategory = searchParams.get("category") || "";
  const category = rawCategory
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter((c) => c);

  const filters = {
    category,
    format: searchParams.get("format") || "all",
    location: searchParams.get("location") || "all",
    date: searchParams.get("date") || "all",
    city: searchParams.get("city") || "",
    country: searchParams.get("country") || "",
  };

  // 🧭 Optional user location (for sorting by distance)
  const userLat = parseFloat(searchParams.get("lat") || "");
  const userLng = parseFloat(searchParams.get("lng") || "");

  const userLocation =
    !isNaN(userLat) && !isNaN(userLng) ? { lat: userLat, lng: userLng } : null;

  const { data, hasMore } = await getPaginatedFilteredEvents({
    page,
    limit,
    filters,
    userLocation,
  });

  return Response.json({ data, hasMore });
}
