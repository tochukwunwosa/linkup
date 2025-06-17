import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDateRange } from '@/lib/utils'
import { LiveEventBadge } from './live-event-badge'

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
  title: string;
  filteredEvents: MockEvent[],
  addToCalendar?: (event: MockEvent) => void
}

export default function EventsGrid({ addToCalendar, filteredEvents, title }: UpcomingEventsProp) {
  return (
    <section id="events" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{filteredEvents.length} events found</p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200 border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge
                    variant={event.type === "Online" ? "secondary" : "default"}
                    className={
                      event.type === "Online" ? "bg-orange-100 text-orange-800" : "bg-indigo-100 text-primary"
                    }
                  >
                    {event.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      event.price === "Free" ? "border-green-300 text-green-700" : "border-orange-300 text-orange-700"
                    }
                  >
                    {event.price}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-accent-foreground mb-2">{event.title}</h3>
                <p className="text-foreground/60 text-sm">{event.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3 mb-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {/* start date */}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDateRange(event.start_date, event.endDate || "")}
                    </div>
                    {/* at */}
                    <p className="text-gray-600 ">at</p>
                    {/* time */}
                    <div className="flex items-center ">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>

                    <LiveEventBadge event={event} />
                  </div>
                  {/* location */}
                  <div className="flex items-center text-gray-600 ">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  {/* type */}
                  <div className="flex items-center text-gray-600 ">
                    <Users className="h-4 w-4 mr-2" />
                    {event.type}
                  </div>
                </div>

                <div className="flex gap-2">
                  {addToCalendar ? <Button
                    onClick={() => addToCalendar(event)}
                    className="flex-1 bg-primary hover:bg-primary/80 text-background"
                    size="sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                    : null
                  }
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more events.</p>
          </div>
        )}
      </div>
    </section>
  )
}
