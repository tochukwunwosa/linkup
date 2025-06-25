import EventsGrid from "@/components/events-grid"
import { useEventContext } from "@/components/context/EventContext"

export default function UpcomingEvents() {
  const { events, isLoading } = useEventContext()

  return (
    <div className="pt-12">
      <EventsGrid title="Tech Events near You" events={events} isLoading={isLoading} />
    </div>
  )
}
