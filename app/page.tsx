"use client"

import { useState } from "react"
import { mockEvents } from "@/lib/mock-data"
import Navbar from "@/components/navbar"
import Filters from "@/components/filters"
import Hero from "@/components/hero"
import UpcomingEvents from "@/components/upcoming-events"
import Footer from "@/components/footer"
import LiveEvents from "@/components/live-events"
import { isLiveEvent } from "@/lib/utils"
import { Event } from "@/lib/validations/event"

export default function LinkUpLanding() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedFormat, setSelectedFormat] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")

  const filteredEvents = mockEvents.filter((event) => {
    if (selectedCategory !== "all" && event.category.toLowerCase() !== selectedCategory.toLowerCase()) return false
    if (selectedFormat !== "all" && event.type.toLowerCase() !== selectedFormat.toLowerCase()) return false
    if (selectedLocation !== "all" && !event.location.toLowerCase().includes(selectedLocation.toLowerCase()))
      return false
    return true
  })

  const now = new Date();

  const liveEvents: Event[] = filteredEvents.filter((event) => isLiveEvent({ event }));

  const upcomingEvents = filteredEvents.filter((event) => {
    const start = new Date(event.start_date);
    return start > now;
  });


  const addToCalendar = (event: (typeof mockEvents)[0]) => {
    const start_date = new Date(`${event.start_date} ${event.time}`).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    const endDate =
      new Date(new Date(`${event.start_date} ${event.endDate} ${event.time}`).getTime() + 2 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z"
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start_date}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
    window.open(calendarUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Filters */}
      <Filters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedDate={selectedDate} setSelectedDate={setSelectedDate}
      />

      {/* Live Event Feed */}
      <LiveEvents liveEvents={liveEvents} />

      {/* Upwcoming Event Feed */}
      <UpcomingEvents addToCalendar={addToCalendar} upcomingEvents={upcomingEvents} />

      {/* Footer */}
      <Footer />
    </div>
  )
}
