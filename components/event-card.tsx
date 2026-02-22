'use client'
import { memo } from 'react'
import { Event } from '@/lib/validations/event'
import Link from 'next/link'
import { Calendar, MapPin, Banknote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDateRange, isLiveEvent } from '@/lib/utils'
import { getCurrencySymbol } from '@/lib/format-currency'
import { LiveEventBadge } from '@/components/live-event-badge'

function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block h-full rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      aria-label={event.title}
    >
      <article className="p-4 flex flex-col gap-3 h-full transition-transform duration-200 group-hover:scale-[1.01] group-hover:-translate-y-0.5">
        {/* Top row: type badge + live badge */}
        <div className="flex items-center gap-2">
          {isLiveEvent({ event }) && <LiveEventBadge event={event} />}
          <Badge
            variant={event.type === 'Online' ? 'secondary' : 'default'}
            className="text-xs"
          >
            {event.type}
          </Badge>
          {event.category[0] && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[120px]">
              {event.category[0]}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        {/* Details */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDateRange(event.start_date, event.end_date || '')}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.city || event.location}</span>
          </div>

          {event.price && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Banknote className="w-4 h-4 flex-shrink-0" />
              <span>
                {event.price === 'Free'
                  ? 'Free'
                  : event.price_amount
                  ? `${getCurrencySymbol(event.currency || 'NGN')}${parseFloat(event.price_amount).toLocaleString()}`
                  : event.price}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

export default memo(EventCard)
