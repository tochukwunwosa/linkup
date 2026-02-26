import JsonLd from "@/components/JsonLd";
import { generateBreadcrumbSchema, generateEventListSchema } from "@/lib/structured-data";
import { getPaginatedFilteredEvents } from "@/app/actions/event/getPaginatedFilteredEvents";
import HomeClient from "@/components/home-client";

export default async function LinkUpLanding() {
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

  // ItemList schema so Google understands this page is a list of events
  const itemListSchema = generateEventListSchema(data);

  return (
    <>
      {/* Preload LCP hero image — explicit preload needed because the Image is inside a client component chain */}
      <link rel="preload" as="image" href="/assets/images/wceu.webp" fetchPriority="high" />

      <div className="bg-[#070809] overflow-visible">
        <JsonLd data={breadcrumbSchema} id="breadcrumb" />
        <JsonLd data={itemListSchema} id="event-list" />

        <HomeClient
          initialEvents={data}
          initialTotal={total}
          initialHasMore={hasMore}
        />
      </div>
    </>
  );
}
