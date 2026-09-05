import { describe, it, expect } from 'vitest';
import { formatToLocalDateStr, isPastOrPresentDay } from './date';

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

describe('isPastOrPresentDay', () => {
    const MOCK_CURRENT_DATE = new Date(2026, 8, 5, 12, 30, 0);

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(MOCK_CURRENT_DATE);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should return true for today', () => {
        expect(isPastOrPresentDay('2026-09-05')).toBe(true);
        expect(isPastOrPresentDay(new Date(2026, 8, 5))).toBe(true);
    });

    it('should return true for past dates', () => {
        expect(isPastOrPresentDay('2025-01-01')).toBe(true);
        expect(isPastOrPresentDay(new Date(2026, 8, 4))).toBe(true);
        expect(isPastOrPresentDay(1700000000000)).toBe(true);
    });

    it('should return false for future dates', () => {
        expect(isPastOrPresentDay('2026-09-06')).toBe(false);
        expect(isPastOrPresentDay(new Date(2030, 0, 1))).toBe(false);
    });

    it('should ignore time differences within the same day', () => {
        const morningToday = new Date(2026, 8, 5, 1, 0, 0);
        const nightToday = new Date(2026, 8, 5, 23, 59, 59);

        expect(isPastOrPresentDay(morningToday)).toBe(true);
        expect(isPastOrPresentDay(nightToday)).toBe(true);
    });
});
