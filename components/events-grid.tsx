"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addToGoogleCalendar, formatDateRange, isLiveEvent } from '@/lib/utils'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LiveEventBadge } from '@/components/live-event-badge'

import { Event } from "@/lib/validations/event"

interface UpcomingEventsProp {
  title: string;
  events: Event[];
}

export default function EventsGrid({ title, events }: UpcomingEventsProp) {

  return (
    <div id="events">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-muted-foreground text-xs">{events.length} {events.length > 1 ? "events" : "event"} found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: Event) => (
              <Card key={event.id} className="max-w-md overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-start flex-wrap">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.category}</p>
                    </div>
                    <div className='ml-auto flex items-center gap-px '>
                      {isLiveEvent({ event }) ? <LiveEventBadge /> : null}

                      <Badge variant={event.type === "Online" ? "secondary" : "default"}>
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDateRange(event.start_date, event.end_date || "")}</span>
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
                        {/* make accomodation for currency or remove the price and leave paid or free */}
                        <span>{event.price}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="max-w-fit mx-auto flex-1 bg-primary text-background hover:!bg-secondary hover:text-background cursor-pointer  transition-colors duration-300 ease-in-out"
                        >
                          Add to Calendar
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => addToGoogleCalendar(event)}>
                          Google Calendar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addToAppleCalendar(event)}>
                          Apple Calendar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToGoogleCalendar(event)}
                      className="w-fit mx-auto flex-1 bg-primary text-background hover:!bg-secondary hover:text-background cursor-pointer  transition-colors duration-300 ease-in-out"
                    >
                      Add to Calendar                      
                      <ExternalLink className="w-4 h-4 mr-2" />
                    </Button>
                    {event.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 w-fit hover:bg-secondary hover:text-background cursor-pointer transition-colors duration-300 ease-in-out"
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

          {events.length === 0 && (
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
    </div>
  )
}

