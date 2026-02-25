'use client'
import { memo } from 'react'
import { Event } from '@/lib/validations/event'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { formatDateRange, isLiveEvent, formatTo12Hour } from '@/lib/utils'
import { getCurrencySymbol } from '@/lib/format-currency'
import { getCategoryColors } from '@/lib/category-color'

function EventCard({ event }: { event: Event }) {
  const colors = getCategoryColors(event.category)
  const live = isLiveEvent({ event })
  const typeLabel = event.type === 'In-person & Online' ? 'Hybrid' : event.type

  return (
    <Link
      href={`/events/${event.id}`}
      className="card-lime-bar group relative flex flex-col h-full rounded-xl border border-[rgba(0,0,0,0.07)] bg-white transition-all duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc] focus-visible:ring-offset-2 hover:border-[#0066cc]/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,102,204,0.08)] hover:-translate-y-0.5"
      aria-label={event.title}
    >
      {/* Gradient header band */}
      <div
        className="relative h-10 flex items-center justify-between px-3 flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${colors.solid}, ${colors.light})` }}
        aria-hidden="true"
      >
        {live ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white leading-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            LIVE
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white leading-none">
          {typeLabel}
        </span>
      </div>

      {/* Card body */}
      <article className="flex-1 flex flex-col p-4 pl-5 gap-2.5">
        {/* Category pill */}
        {event.category[0] && (
          <span
            className="self-start text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full leading-none"
            style={{ background: colors.overlay, color: colors.solid }}
          >
            {event.category[0]}
          </span>
        )}

        {/* Title */}
        <h3 className="font-semibold text-[#1a1b25] text-base leading-snug line-clamp-2 group-hover:text-[#0066cc] transition-colors duration-200">
          {event.title}
        </h3>

        {/* Details */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center gap-2 text-[12px] text-[#64748b]">
            <Calendar
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: colors.solid, opacity: 0.7 }}
            />
            <span>
              {formatDateRange(event.start_date, event.end_date || '')}
              {event.time ? ` · ${formatTo12Hour(event.time)}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#64748b]">
            <MapPin
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: colors.solid, opacity: 0.7 }}
            />
            <span className="truncate">{event.city || event.location}</span>
          </div>

          {event.price && (
            <div className="flex items-center gap-2 text-[12px]">
              {event.price === 'Free' ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(201,247,47,0.18)] text-[#4a6800] border border-[rgba(201,247,47,0.5)]">
                  Free
                </span>
              ) : (
                <span className="text-[#64748b] font-medium">
                  {event.price_amount
                    ? `${getCurrencySymbol(event.currency || 'NGN')}${parseFloat(event.price_amount).toLocaleString()}`
                    : event.price}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

export default memo(EventCard)
