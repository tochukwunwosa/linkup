import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid } from "date-fns";
import { Event } from "./validations/event";
import { DateTime } from "luxon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to format date ranges
export function formatDateRange(
  start: Date | string,
  end?: Date | string
): string {
  const start_date = typeof start === "string" ? new Date(start) : start;
  const endDate = end ? (typeof end === "string" ? new Date(end) : end) : null;

  if (!isValid(start_date)) return "";
  if (endDate && !isValid(endDate)) return format(start_date, "d MMMM, yyyy");

  const sameDay =
    endDate &&
    start_date.getDate() === endDate.getDate() &&
    start_date.getMonth() === endDate.getMonth() &&
    start_date.getFullYear() === endDate.getFullYear();

  const sameMonthYear =
    endDate &&
    start_date.getMonth() === endDate.getMonth() &&
    start_date.getFullYear() === endDate.getFullYear();

  const sameYear =
    endDate && start_date.getFullYear() === endDate.getFullYear();

  if (!endDate || sameDay) {
    return format(start_date, "d MMMM, yyyy");
  }

  if (sameMonthYear) {
    return `${start_date.getDate()} - ${format(endDate, "d MMMM yyyy")}`;
  }

  if (sameYear) {
    return `${format(start_date, "d MMM")} - ${format(endDate, "d MMMM yyyy")}`;
  }

  return `${format(start_date, "d MMMM, yyyy")} - ${format(
    endDate,
    "d MMMM, yyyy"
  )}`;
}

// Helper function to convert time to 24 hour format
export function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.trim().split(" ");
  const [hours, minutes] = time.split(":");

  if (!hours || !minutes || !modifier) return "";

  let hrs = parseInt(hours, 10);

  if (modifier.toLowerCase() === "pm" && hrs !== 12) {
    hrs += 12;
  }
  if (modifier.toLowerCase() === "am" && hrs === 12) {
    hrs = 0;
  }

  return `${String(hrs).padStart(2, "0")}:${minutes}`;
}

export const isLiveEvent = ({ event }: { event: Event }) => {
  if (!event.start_date) return false;

  const now = new Date();
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : startDate; // fallback to startDate

  // Today's date components
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  // Daily event window: 8 AM to 6 PM
  const todayStart = new Date(year, month, date, 8, 0);
  const todayEnd = new Date(year, month, date, 18, 0);

  // Check date range
  const isBetweenDates = now >= startDate && now <= endDate;
  const isInTimeWindow = now >= todayStart && now <= todayEnd;

  return isBetweenDates && isInTimeWindow;
};


export const getFirstName = (name: string): string => {
  return name.split(" ")[0] || "";
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const addToGoogleCalendar = (event: Event) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    alert(
      "Your event will open in Google Calendar. Make sure you're signed in."
    );
  }

  const startDate = new Date(`${event.start_date}T08:00`); // 8 AM
  const endDate = event.end_date
    ? new Date(`${event.end_date}T18:00`) // 6 PM on end date
    : new Date(`${event.start_date}T18:00`); // 6 PM on same day

  const formatForGoogle = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${formatForGoogle(startDate)}/${formatForGoogle(
    endDate
  )}&details=${encodeURIComponent(
    event.description
  )}&location=${encodeURIComponent(event.location || "")}`;

  window.open(calendarUrl, "_blank");
};

export const addToAppleCalendar = (event: Event) => {
  const startDate = new Date(`${event.start_date}T08:00`);
  const endDate = event.end_date
    ? new Date(`${event.end_date}T18:00`)
    : new Date(`${event.start_date}T18:00`);

  const formatDateForICS = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LinkUp Events//Calendar Event//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@linkup.com`,
    `DTSTAMP:${formatDateForICS(new Date())}`,
    `DTSTART:${formatDateForICS(startDate)}`,
    `DTEND:${formatDateForICS(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location || ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


/**
 * Converts stored event time from WAT (Africa/Lagos) to user's local time
 * Returns time only (not date)
 */
export function convertWATToLocalTime(start_date: string, time: string) {
  const [hour, minute] = time.split(":").map(Number);

  const watDateTime = DateTime.fromISO(start_date, {
    zone: "Africa/Lagos",
  }).set({
    hour,
    minute,
  });

  const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDateTime = watDateTime.setZone(userZone);

  return {
    wat: watDateTime.toLocaleString(DateTime.TIME_SIMPLE),   // e.g. "2:00 PM"
    local: localDateTime.toLocaleString(DateTime.TIME_SIMPLE),
    userZone,
  };
}

/**
 *  Get the user distance
*/
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Radius of Earth in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

