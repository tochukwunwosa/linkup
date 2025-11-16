/**
 * Date utility functions to handle timezone-safe date formatting
 * Prevents date shifting issues when converting between timezones
 */

/**
 * Converts a Date object to YYYY-MM-DD format without timezone conversion
 * This prevents the common issue where dates shift by one day due to timezone offsets
 *
 * @param date - Date object or ISO string
 * @returns String in YYYY-MM-DD format
 *
 * @example
 * formatDateToYYYYMMDD(new Date('2025-12-04')) // "2025-12-04"
 * formatDateToYYYYMMDD('2025-12-04T00:00:00.000Z') // "2025-12-04"
 */
export function formatDateToYYYYMMDD(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  // Extract year, month, and day in local timezone
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Parses a date string or Date object and returns it as YYYY-MM-DD
 * Useful for ensuring dates from forms are in the correct format for database storage
 *
 * @param date - Date object, ISO string, or YYYY-MM-DD string
 * @returns String in YYYY-MM-DD format, or null if invalid
 */
export function parseDateSafe(date: Date | string | null | undefined): string | null {
  if (!date) return null;

  try {
    return formatDateToYYYYMMDD(date);
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}
