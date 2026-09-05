/**
 * Converts a Date object to a YYYY-MM-DD format string, taking into account the local time zone.
 */
export const formatToLocalDateStr = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Checks if a given date is today or in the past (non-future).
 * Normalizes both dates to the start of the day (00:00:00.000) in local time.
 *
 * @param {Date | string | number} date - The date to check (Date object, string, or timestamp).
 * @returns {boolean} Returns true if the date is in the past or today, and false for future dates.
 *
 * @example
 * isPastOrPresentDay('2026-03-05'); // true or false depending on current date
 */
export function isPastOrPresentDay(date: Date | string | number): boolean {
    const target = new Date(date);
    const today = new Date();

    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return target <= today;
}
