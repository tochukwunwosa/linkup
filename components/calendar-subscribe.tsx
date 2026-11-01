"use client";

import { CalendarPlus, Link2 } from "lucide-react";
import { toast } from "sonner";

interface CalendarSubscribeProps {
  /** Feed slug: "all", "online", a state slug or a category slug. */
  feed: string;
  label: string;
}

const host = (process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz").replace(/^https?:\/\//, "");

export function CalendarSubscribe({ feed, label }: CalendarSubscribeProps) {
  const path = `${host}/calendar/${feed}.ics`;
  const webcalUrl = `webcal://${path}`;
  // Google Calendar subscribes to a webcal URL passed as cid.
  const googleUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${path}`);
      toast.success("Calendar link copied. Paste it into your calendar app's \"subscribe\" option.");
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  const buttonClass =
    "inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.10)] bg-white px-3.5 py-1.5 text-sm text-[#4a4a5a] hover:border-[#0066cc]/30 hover:text-[#0066cc] transition-colors";

  return (
    <div className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="mb-1 flex items-center gap-2">
        <CalendarPlus className="h-5 w-5 text-[#0066cc]" />
        <h2 className="text-base font-semibold text-[#1a1b25]">Add {label} events to your calendar</h2>
      </div>
      <p className="mb-4 text-sm text-[#64748b]">
        Subscribe once and new events appear in your calendar automatically. Times are in WAT.
      </p>
      <div className="flex flex-wrap gap-2">
        <a href={googleUrl} target="_blank" rel="noopener noreferrer" className={buttonClass}>
          Google Calendar
        </a>
        <a href={webcalUrl} className={buttonClass}>
          Apple / Outlook
        </a>
        <button type="button" onClick={handleCopy} className={buttonClass}>
          <Link2 className="h-3.5 w-3.5" />
          Copy link
        </button>
      </div>
    </div>
  );
}
