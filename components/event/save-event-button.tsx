"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Event } from "@/lib/validations/event";
import { toSavedEvent, useSavedEvents } from "@/hooks/use-saved-events";

interface SaveEventButtonProps {
  event: Event;
  /** "icon" for cards, "full" (with label) for the event page. */
  variant?: "icon" | "full";
  className?: string;
}

export function SaveEventButton({ event, variant = "icon", className }: SaveEventButtonProps) {
  const { isSaved, toggle } = useSavedEvents();
  const saved = isSaved(event.slug);

  const handleClick = (e: React.MouseEvent) => {
    // Cards sit next to a full-card link; don't let the click navigate.
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggle(toSavedEvent(event));
    toast.success(nowSaved ? "Saved. Find it under Saved in the menu." : "Removed from saved events.");
  };

  const label = saved ? `Remove ${event.title} from saved events` : `Save ${event.title}`;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        aria-label={label}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
          saved
            ? "border-[#e11d48]/30 bg-[#e11d48]/5 text-[#e11d48]"
            : "border-[rgba(0,0,0,0.10)] text-[#1a1b25] hover:bg-[#f5f4f2]",
          className
        )}
      >
        <Heart className={cn("h-4 w-4", saved && "fill-current")} />
        {saved ? "Saved" : "Save event"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]",
        saved ? "text-[#e11d48]" : "text-[#64748b] hover:text-[#e11d48]",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-current")} />
    </button>
  );
}
