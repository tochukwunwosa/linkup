import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid } from "date-fns";
import { Event } from "./validations/event";

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
  // Combine date + time into full timestamp
  const now = new Date();
  const startDateString = event.start_date.split("T")[0];
  const start = new Date(`${startDateString}T${event.time}`);

  // Event is live for 10 hours from start time
  const end = new Date(start.getTime() + 10 * 60 * 60 * 1000); // 10 hours after start

  const isLive = now >= start && now <= end;
  return isLive;
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
