"use client";

import Link from "next/link";
import { Calendar, MapPin, Trash2 } from "lucide-react";
import { formatDateRange, formatTo12Hour } from "@/lib/utils";
import { hasEventEnded } from "@/lib/date-utils";
import { SavedEvent, useSavedEvents } from "@/hooks/use-saved-events";

function SavedEventRow({ event, onRemove }: { event: SavedEvent; onRemove: () => void }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-4">
      <Link href={`/events/${event.slug}`} className="flex-1 min-w-0 group">
        <p className="font-semibold text-[#1a1b25] leading-snug group-hover:text-[#0066cc]">
          {event.title}
        </p>
        <p className="mt-1.5 flex items-center gap-2 text-[13px] text-[#64748b]">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          {formatDateRange(event.start_date, event.end_date || "")}
          {event.time ? ` · ${formatTo12Hour(event.time)} WAT` : ""}
        </p>
        <p className="mt-1 flex items-center gap-2 text-[13px] text-[#64748b]">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{event.place}</span>
        </p>
      </Link>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${event.title} from saved events`}
        className="rounded-lg p-2 text-[#64748b] hover:bg-[#f5f4f2] hover:text-[#e11d48]"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

export function SavedEventsList() {
  const { saved, remove } = useSavedEvents();

  if (saved.length === 0) {
    return (
      <div className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8 text-center">
        <p className="font-semibold text-[#1a1b25]">No saved events yet</p>
        <p className="mt-1 text-sm text-[#64748b]">
          Tap the heart on any event to save it here.
        </p>
        <Link href="/#events" className="mt-4 inline-block text-sm font-medium text-[#0066cc] hover:underline">
          Browse events
        </Link>
      </div>
    );
  }

  const byDate = [...saved].sort((a, b) => a.start_date.localeCompare(b.start_date));
  const upcoming = byDate.filter((e) => !hasEventEnded(e));
  const past = byDate.filter((e) => hasEventEnded(e)).reverse();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#64748b]">
          Upcoming ({upcoming.length})
        </h2>
        {upcoming.length > 0 ? (
          <ul className="space-y-3">
            {upcoming.map((e) => (
              <SavedEventRow key={e.slug} event={e} onRemove={() => remove(e.slug)} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#64748b]">All your saved events have ended.</p>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#64748b]">
            Past ({past.length})
          </h2>
          <ul className="space-y-3 opacity-70">
            {past.map((e) => (
              <SavedEventRow key={e.slug} event={e} onRemove={() => remove(e.slug)} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
