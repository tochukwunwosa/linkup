import { isLiveEvent } from "@/lib/utils"
import EventsGrid from "@/components/events-grid"
import { useEventContext } from "@/components/context/EventContext"

export default function LiveEvents() {
  const { filteredEvents } = useEventContext()
  const liveEvents = filteredEvents.filter((e) => isLiveEvent({ event: e }))

  if (liveEvents.length === 0) return null

  return <EventsGrid title="Live Events Near You" events={liveEvents} />
}
