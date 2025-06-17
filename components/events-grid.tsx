import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDateRange } from '@/lib/utils'
// import { LiveEventBadge } from './live-event-badge'
import { Event } from '@/lib/validations/event'

interface UpcomingEventsProp {
  title: string;
  filteredEvents: Event[],
  addToCalendar?: (event: Event) => void
}

export default function EventsGrid({ title, filteredEvents, addToCalendar }: UpcomingEventsProp) {
  return (
    <section id="events" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{filteredEvents.length} events found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.category}</p>
                  </div>
                  <Badge variant={event.type === "Online" ? "secondary" : "default"}>
                    {event.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDateRange(event.start_date, event.endDate || "")}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  {event.price && (
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{event.price} {event.price_amount}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  {addToCalendar && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCalendar(event)}
                      className="flex-1"
                    >
                      Add to Calendar
                    </Button>
                  )}
                  {event.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(event.link, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Register
                    </Button>
                  )}
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
