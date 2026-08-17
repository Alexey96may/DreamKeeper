/**
 * Converts a single value, an array, or null/undefined into a strict array.
 */
export const normalizeToArray = <T>(val: T | T[] | null | undefined): T[] => {
    if (Array.isArray(val)) return val;
    if (val !== null && val !== undefined) return [val];
    return [];
};
