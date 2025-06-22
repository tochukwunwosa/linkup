"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users, ExternalLink, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDateRange, isLiveEvent } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LiveEventBadge } from '@/components/live-event-badge'

import { Event } from "@/lib/validations/event"

interface UpcomingEventsProp {
  title: string;
  events: Event[];
}

export default function EventsGrid({ title, events }: UpcomingEventsProp) {

  const addToGoogleCalendar = (event: Event) => {
    const start_date = new Date(`${event.start_date} ${event.time}`).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    const endDate =
      new Date(new Date(`${event.start_date} ${event.end_date} ${event.time}`).getTime() + 2 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z"
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start_date}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
    window.open(calendarUrl, "_blank")
  }

  const addToAppleCalendar = (event: Event) => {
    const startDate = new Date(`${event.start_date} ${event.time}`)
    const endDate = event.end_date
      ? new Date(`${event.end_date} ${event.time}`)
      : new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours default

    const formatDateForICS = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//LinkUp Events//Calendar Event//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@linkup.com`,
      `DTSTART:${formatDateForICS(startDate)}`,
      `DTEND:${formatDateForICS(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n")

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div id="events">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-muted-foreground text-xs">{events.length} {events.length > 1 ? "events" : "event"} found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-primary text-background hover:!bg-secondary hover:text-background cursor-pointer"
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
                    </DropdownMenu>
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

