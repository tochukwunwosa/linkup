import React from 'react'
import EventsGrid from './events-grid'
import { Event } from '@/lib/validations/event'

interface UpcomingEventsProp {
  upcomingEvents: Event[],
  addToCalendar: (event: Event) => void
}

export default function UpcomingEvents({ addToCalendar, upcomingEvents }: UpcomingEventsProp) {
  return (
    <EventsGrid title='Upcoming Tech Events near You' filteredEvents={upcomingEvents} addToCalendar={addToCalendar} />
  )
}
