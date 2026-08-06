import { describe, it, expect } from 'vitest';
import { formatToLocalDateStr } from './date';

describe('formatToLocalDateStr', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('formats a standard date correctly', () => {
        const date = new Date(2026, 4, 15);
        expect(formatToLocalDateStr(date)).toBe('2026-05-15');
    });

    it('returns current local date when no argument is provided', () => {
        const mockDate = new Date(2026, 4, 15, 12, 0, 0);
        vi.setSystemTime(mockDate);

        expect(formatToLocalDateStr()).toBe('2026-05-15');
    });

    it('pads single-digit months and days with leading zeros', () => {
        const date = new Date(2026, 0, 5);
        expect(formatToLocalDateStr(date)).toBe('2026-01-05');
    });

    it('correctly handles the last day of the year', () => {
        const date = new Date(2026, 11, 31);
        expect(formatToLocalDateStr(date)).toBe('2026-12-31');
    });

    it('preserves the local date regardless of late hours', () => {
        const date = new Date(2026, 4, 15, 23, 59, 59);
        expect(formatToLocalDateStr(date)).toBe('2026-05-15');
    });

    it('preserves the local date regardless of early morning hours', () => {
        const date = new Date(2026, 4, 15, 0, 0, 1);
        expect(formatToLocalDateStr(date)).toBe('2026-05-15');
    });
});
