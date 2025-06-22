"use client"

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import UpcomingEvents from "@/components/upcoming-events"
import Footer from "@/components/footer"
import Filters from "@/components/filters"

export default function LinkUpLanding() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />


      {/* Filters */}
      <Filters />

      {/* Conditionally render live events */}
      {/* <LiveEvents /> */}

      {/* Always render upcoming */}
      <UpcomingEvents />

      <Footer />
    </div>
  )
}
