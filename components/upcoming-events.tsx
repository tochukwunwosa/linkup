import EventsGrid from "@/components/events-grid"
import { useEventContext } from "@/components/context/EventContext"

export default function UpcomingEvents() {
  const { events } = useEventContext()

  return <EventsGrid title="Tech Events near You" events={events}  />
}
