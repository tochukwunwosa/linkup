"use client"

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import UpcomingEvents from "@/components/upcoming-events"
import Footer from "@/components/footer"
import Filters from "@/components/filters"

export default function LinkUpLanding() {

  return (
    <div className=" bg-gray-50 overflow-visible">
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
