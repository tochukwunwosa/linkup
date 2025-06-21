"use client"

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import UpcomingEvents from "@/components/upcoming-events"
import Footer from "@/components/footer"
import LiveEvents from "@/components/live-events"

export default function LinkUpLanding() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />

      {/* Conditionally render live events */}
      <LiveEvents />

      {/* Always render upcoming */}
      <UpcomingEvents />

      <Footer />
    </div>
  )
}
