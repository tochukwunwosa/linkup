import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EventCard from "@/components/event-card";
import { getCategoryColors } from "@/lib/category-color";
import { categoryMeta } from "@/constants/category-meta";
import { Event } from "@/lib/validations/event";

interface RelatedEventsProps {
  events: Event[];
  primaryCategory: string;
}

export function RelatedEvents({ events, primaryCategory }: RelatedEventsProps) {
  if (!events.length) return null;

  const colors = getCategoryColors([primaryCategory]);

  // Find a matching category page slug for the "browse all" link
  const meta = categoryMeta.find((m) =>
    m.dbKeywords.some((k) => primaryCategory.toLowerCase().includes(k.toLowerCase()))
  );

  return (
    <section className="mt-10" aria-labelledby="related-events-heading">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="related-events-heading"
          className="font-display text-lg font-bold text-[#1a1b25]"
          style={{ borderLeft: `3px solid ${colors.solid}`, paddingLeft: "10px" }}
        >
          More events like this
        </h2>
        {meta && (
          <Link
            href={`/category/${meta.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: colors.solid }}
          >
            Browse all {meta.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
