'use client'
import { Event } from '@/lib/validations/event'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, ExternalLink, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addToGoogleCalendar, convertWATToLocalTime, formatDateRange, isLiveEvent } from '@/lib/utils'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LiveEventBadge } from '@/components/live-event-badge'
import { getCurrencySymbol } from '@/lib/format-currency'

export default function EventCard({ event }: { event: Event }) {
  const { wat, local, userZone } = convertWATToLocalTime(event.start_date, event.time)
  return (
    <Card key={event.id} className="max-w-md w-full h-full flex flex-col justify-between rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">

      <CardHeader className="p-4">
        <div className="flex items-start flex-wrap">
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.category}</p>
          </div>
          <div className='ml-auto flex items-center gap-px '>
            {isLiveEvent({ event }) ? <LiveEventBadge event={event} /> : null}

            <Badge variant={event.type === "Online" ? "secondary" : "default"}>
              {event.type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDateRange(event.start_date, event.end_date || "")}</span>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{wat}</span>
            </div>
            {!local && (
              <div className="pl-6 text-xs text-muted-foreground">
                Your Time: {local} ({userZone})
              </div>
            )}
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>

          {event.price === 'Paid' && event.price_amount && (
            <div className="flex items-center text-sm">
              <Banknote className="w-4 h-4 mr-2" />
              <span>
                {getCurrencySymbol(event.currency || 'NGN')}
                {parseFloat(event.price_amount).toLocaleString()}
              </span>
            </div>
          )}

          {event.price === 'Free' && (
            <div className="flex items-center text-sm">
              <Banknote className="w-4 h-4 mr-2" />
              <span>Free</span>
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
        </div>
      </CardContent>
      <CardFooter className='flex items-center gap-2'>
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
            Read more
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
