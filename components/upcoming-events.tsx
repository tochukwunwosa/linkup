import React from 'react'
import EventsGrid from './events-grid'

interface MockEvent {
  id: number;
  time: string;
  title: string;
  type: "Online" | "In-person" | "In-person & Online";
  description: string;
  location: string;
  start_date: string;
  publish_status: string;
  category: string;
  price?: string | undefined;
  endDate?: string | undefined;
  price_amount?: string | undefined;

}

interface UpcomingEventsProp {
  upcomingEvents: MockEvent[],
  addToCalendar: (event: MockEvent) => void
}

export default function UpcomingEvents({ addToCalendar, upcomingEvents }: UpcomingEventsProp) {
  return (
    <EventsGrid title='Upcoming Tech Events near You' filteredEvents={upcomingEvents} addToCalendar={addToCalendar} />
  )
}
