export const dreamValueFormatter = (val: number, max: number | string) => {
    if (val === 0) return 'Не важно';
    return `${val} / ${max}`;
};

/**
 * Converts a comma-separated string into an array of trimmed strings
 */
export const parseCommaSeparated = (str: string | null | undefined): string[] => {
    if (!str) return [];
    return str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
};

/**
 * Converts an array of strings into a single comma-separated string
 */
export const formatCommaSeparated = (arr: string[] | null | undefined): string => {
    return (arr ?? []).join(', ');
};
