"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Filters from "@/components/filters";
import JsonLd from "@/components/JsonLd";
import { generateBreadcrumbSchema } from "@/lib/structured-data";

// Lazy load below-the-fold components
const UpcomingEvents = dynamic(() => import("@/components/upcoming-events"), {
  ssr: true,
});
const Footer = dynamic(() => import("@/components/footer"), {
  ssr: true,
});

export default function LinkUpLanding() {
  // Generate breadcrumb schema for homepage
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
  ]);

  return (
    <div className=" bg-gray-50 overflow-visible">
      {/* Add structured data for homepage */}
      <JsonLd data={breadcrumbSchema} id="breadcrumb" />

      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Filters */}
      <Filters />

      {/* Always render upcoming */}
      <UpcomingEvents />

      <Footer />
    </div>
  );
}
