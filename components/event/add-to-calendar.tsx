"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, CalendarDays, Download } from "lucide-react";
import { addToGoogleCalendar, addToAppleCalendar } from "@/lib/utils";
import { Event } from "@/lib/validations/event";

interface AddToCalendarProps {
  event: Event;
  solidColor: string;
}

export function AddToCalendar({ event, solidColor }: AddToCalendarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all hover:opacity-80 active:scale-[0.98]"
          style={{ borderColor: solidColor, color: solidColor }}
        >
          <Calendar className="w-4 h-4" />
          Add to Calendar
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onClick={() => addToGoogleCalendar(event)}
        >
          <CalendarDays className="w-4 h-4 text-[#4285F4]" />
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onClick={() => addToAppleCalendar(event)}
        >
          <Download className="w-4 h-4 text-[#555]" />
          Download .ics
          <span className="ml-auto text-[10px] text-[#94a3b8]">Apple / Outlook</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
