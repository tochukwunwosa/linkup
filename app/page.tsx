"use client"

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import UpcomingEvents from "@/components/upcoming-events"
import Footer from "@/components/footer"
import Filters from "@/components/filters"
import JsonLd from "@/components/JsonLd"
import { generateBreadcrumbSchema } from "@/lib/structured-data"

export default function LinkUpLanding() {
  // Generate breadcrumb schema for homepage
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://tech-linkup.vercel.app"

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
  ])

  return (
    <div className=" bg-gray-50 overflow-visible">
      {/* Add structured data for homepage */}
      <JsonLd data={breadcrumbSchema} id="breadcrumb" />

      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Filters */}
      <Filters />

      {/* <EventsNearYou maxEvents={4} showViewAll={true} /> */}
      {/* <UpcomingEvents maxEvents={8} showViewAll={true} /> */}

      {/* Always render upcoming */}
      <UpcomingEvents />

      <Footer />
    </div>
  )
}
