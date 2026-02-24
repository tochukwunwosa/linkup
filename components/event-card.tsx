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
      className="card-lime-bar group relative block h-full rounded-xl border border-[rgba(0,0,0,0.07)] bg-white transition-all duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc] focus-visible:ring-offset-2 hover:border-[#0066cc]/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,102,204,0.08)] hover:-translate-y-0.5"
      aria-label={event.title}
    >
      <article className="relative p-4 pl-5 flex flex-col gap-3 h-full">
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
            <span className="text-[11px] font-medium text-[#6b46c1] bg-[#6b46c1]/[0.08] px-2 py-0.5 rounded-full truncate max-w-[120px] leading-none">
              {event.category[0]}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[#1a1b25] text-base leading-snug line-clamp-2 group-hover:text-[#0066cc] transition-colors duration-200">
          {event.title}
        </h3>

        {/* Details */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center gap-2 text-[13px] text-[#64748b]">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#0066cc]/60" />
            <span>{formatDateRange(event.start_date, event.end_date || '')}</span>
          </div>

          <div className="flex items-center gap-2 text-[13px] text-[#64748b]">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#0066cc]/60" />
            <span className="truncate">{event.city || event.location}</span>
          </div>

          {event.price && (
            <div className="flex items-center gap-2 text-[13px] text-[#64748b]">
              <Banknote className="w-3.5 h-3.5 flex-shrink-0 text-[#0066cc]/60" />
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

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-xl"
          style={{background:"linear-gradient(135deg, rgba(0,102,204,0.025) 0%, transparent 60%)"}}
          aria-hidden="true"
        />
      </article>
    </Link>
  )
}

export default memo(EventCard)
