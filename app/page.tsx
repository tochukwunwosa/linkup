import JsonLd from "@/components/JsonLd";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { getPaginatedFilteredEvents } from "@/app/actions/event/getPaginatedFilteredEvents";
import HomeClient from "@/components/home-client";

export default async function LinkUpLanding() {
  // Generate breadcrumb schema for homepage
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
  ]);

  // Fetch initial events server-side for SEO
  const { data, hasMore, total } = await getPaginatedFilteredEvents({
    page: 1,
    limit: 9,
    filters: {
      category: [],
      format: "all",
      location: "all",
      date: "all",
      city: "",
      country: "",
      search: "",
    },
    userLocation: null,
  });

  return (
    <div className="bg-gray-50 overflow-visible">
      {/* Add structured data for homepage */}
      <JsonLd data={breadcrumbSchema} id="breadcrumb" />

      <HomeClient
        initialEvents={data}
        initialTotal={total}
        initialHasMore={hasMore}
      />
    </div>
  );
}
