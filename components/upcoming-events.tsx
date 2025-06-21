import EventsGrid from "@/components/events-grid"
import { useEventContext } from "@/components/context/EventContext"

export default function UpcomingEvents() {
  const { filteredEvents } = useEventContext()
  const now = new Date()

  const upcomingEvents = filteredEvents.filter((event) => {
    const startDateString = event.start_date.split("T")[0]
    const start = new Date(`${startDateString}T${event.time}`)
    return start > now
  })

  return <EventsGrid title="Upcoming Tech Events near You" events={upcomingEvents} />
}
