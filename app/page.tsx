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
    <div className="bg-gray-50 overflow-visible">
      {/*
        Explicit preload for the hero background — the LCP element.
        Next.js Image `priority` does not reliably emit a <link rel="preload">
        when the Image is nested inside client components. This server-rendered
        hint ensures the browser starts fetching the image immediately, before
        any JS executes, which directly improves LCP.
        The srcset below matches the breakpoints Next.js Image uses for fill images.
      */}
      <link
        rel="preload"
        as="image"
        fetchPriority="high"
        href="/_next/image?url=%2Fassets%2Fimages%2Fwceu.webp&w=828&q=60"
        imageSrcSet="/_next/image?url=%2Fassets%2Fimages%2Fwceu.webp&w=640&q=60 640w, /_next/image?url=%2Fassets%2Fimages%2Fwceu.webp&w=828&q=60 828w, /_next/image?url=%2Fassets%2Fimages%2Fwceu.webp&w=1080&q=60 1080w"
        imageSizes="100vw"
      />
      <JsonLd data={breadcrumbSchema} id="breadcrumb" />
      <JsonLd data={itemListSchema} id="event-list" />

      <HomeClient
        initialEvents={data}
        initialTotal={total}
        initialHasMore={hasMore}
      />
    </div>
  );
}
