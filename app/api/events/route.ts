import { getPaginatedFilteredEvents } from "@/app/actions/event/getPaginatedFilteredEvents";

export async function GET(req: Request) {
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
  };

  const { data, hasMore } = await getPaginatedFilteredEvents({
    page,
    limit,
    filters,
  });

  return Response.json({ data, hasMore });
}
