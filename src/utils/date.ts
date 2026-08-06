/**
 * Converts a Date object to a YYYY-MM-DD format string, taking into account the local time zone.
 */
export const formatToLocalDateStr = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};
