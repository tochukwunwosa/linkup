import EventsGrid from "@/components/events-grid";
import { Event } from "@/lib/validations/event";

interface UpcomingEventsProps {
  initialEvents?: Event[];
  initialTotal?: number;
  initialHasMore?: boolean;
}

export default function UpcomingEvents({
  initialEvents = [],
  initialTotal = 0,
  initialHasMore = true
}: UpcomingEventsProps) {
  return (
    <div id="events" className="py-12">
      <EventsGrid
        title="Events Near You"
        initialEvents={initialEvents}
        initialTotal={initialTotal}
        initialHasMore={initialHasMore}
      />
    </div>
  );
}
