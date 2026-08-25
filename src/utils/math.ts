/**
 * Calculates the distribution of stars for a rating display.
 * * @param rating - The rating value (e.g., 4.5). Accepts number, string, or null/undefined.
 * @param maxStars - Total number of stars to display (defaults to 5).
 * @returns An object containing the count of full, half, and empty stars.
 */
export const getStarStats = (rating: number | string | undefined | null, maxStars: number = 5) => {
    const val = clamp(Number(rating) || 0, 0, maxStars);

    const full = Math.floor(val);
    const half = val % 1 >= 0.1 && full < maxStars;
    const empty = Math.max(0, maxStars - full - (half ? 1 : 0));

    return {
        full,
        half,
        empty,
    };
};

/**
 * Clamps a number between a specified minimum and maximum value.
 * * @param val - The value to clamp.
 * @param min - The lower bound.
 * @param max - The upper bound.
 */
export const clamp = (val: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, val));
};
