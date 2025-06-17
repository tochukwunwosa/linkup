import React from 'react'
import EventsGrid from './events-grid'
import { Event } from '@/lib/validations/event'

interface LiveEventsProp {
  liveEvents: Event[]
}
export default function LiveEvents({ liveEvents }: LiveEventsProp) {
  return (
    <EventsGrid title={'Live Tech Events Near You'} filteredEvents={liveEvents} />
  )
}
