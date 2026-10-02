import { describe, it, expect, vi } from 'vitest';
import {
    dreamValueFormatter,
    parseCommaSeparated,
    formatCommaSeparated,
    formatMoney,
    formatDistance,
    sanitizeNumber,
    formatDateTime,
    formatRelativeTime,
    truncateString,
} from '@/utils/formatters';

describe('Formatters and Utilities', () => {
    describe('dreamValueFormatter', () => {
        it('returns "Не важно" when value is 0', () => {
            expect(dreamValueFormatter(0, 10)).toBe('Не важно');
        });

        it('returns formatted value string when value is non-zero', () => {
            expect(dreamValueFormatter(5, 10)).toBe('5 / 10');
            expect(dreamValueFormatter(3, 'max')).toBe('3 / max');
        });
    });

    describe('parseCommaSeparated', () => {
        it('splits comma-separated string into trimmed array and filters out empty values', () => {
            const input = '  apple,  banana , , orange ';
            expect(parseCommaSeparated(input)).toEqual(['apple', 'banana', 'orange']);
        });

        it('returns empty array for null, undefined, or empty string', () => {
            expect(parseCommaSeparated(null)).toEqual([]);
            expect(parseCommaSeparated(undefined)).toEqual([]);
            expect(parseCommaSeparated('')).toEqual([]);
        });
    });

    describe('formatCommaSeparated', () => {
        it('joins array of strings into comma-separated string', () => {
            expect(formatCommaSeparated(['apple', 'banana', 'orange'])).toBe(
                'apple, banana, orange',
            );
        });

        it('returns empty string for null or undefined array', () => {
            expect(formatCommaSeparated(null)).toBe('');
            expect(formatCommaSeparated(undefined)).toBe('');
            expect(formatCommaSeparated([])).toBe('');
        });
    });

    describe('formatMoney', () => {
        it('formats kopecks/cents into Russian rubles currency format', () => {
            const formatted = formatMoney(150000);

            const normalized = formatted.replace(/\s/g, ' ');

            expect(normalized).toContain('1 500');
            expect(normalized).toContain('₽');
        });

        it('returns "0 ₽" for zero, null or undefined', () => {
            expect(formatMoney(0)).toBe('0 ₽');
            expect(formatMoney(null)).toBe('0 ₽');
            expect(formatMoney(undefined)).toBe('0 ₽');
        });
    });

    describe('formatDistance', () => {
        it('converts meters to kilometers and formats properly', () => {
            expect(formatDistance(1500)).toBe('1,5 км');
            expect(formatDistance(10000)).toBe('10,0 км');
        });

        it('returns "0 км" for zero, null or undefined', () => {
            expect(formatDistance(0)).toBe('0 км');
            expect(formatDistance(null)).toBe('0 км');
            expect(formatDistance(undefined)).toBe('0 км');
        });
    });

    describe('sanitizeNumber', () => {
        it('truncates number string if length exceeds limit and appends ellipsis', () => {
            expect(sanitizeNumber(12345, 3)).toBe('123..');
            expect(sanitizeNumber(987654, 4)).toBe('9876..');
        });

        it('returns full number string if length is within or equal to limit', () => {
            expect(sanitizeNumber(123, 3)).toBe('123');
            expect(sanitizeNumber(45, 3)).toBe('45');
        });
    });

    describe('formatDateTime', () => {
        it('formats ISO date string into readable Russian format by default', () => {
            // 1 июня 2026, 14:30
            const iso = '2026-06-01T14:30:00.000Z';
            const result = formatDateTime(iso);
            expect(result).toContain('июня');
            expect(result).toContain('2026');
        });

        it('returns empty string if dateString is null', () => {
            expect(formatDateTime(null)).toBe('');
        });

        it('falls back to raw dateString and logs error on invalid date', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const invalidDate = 'invalid-date-string';

            expect(formatDateTime(invalidDate)).toBe(invalidDate);
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('formatRelativeTime', () => {
        it('returns relative time string for valid ISO date', () => {
            const pastDate = new Date(Date.now() - 1000 * 60 * 5).toISOString(); // 5 минут назад
            const result = formatRelativeTime(pastDate);
            expect(result).toBeTruthy();
            // date-fns на русском обычно возвращает строки вида "5 минут назад"
        });

        it('returns empty string for null input', () => {
            expect(formatRelativeTime(null)).toBe('');
        });

        it('falls back to raw dateString on error', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            expect(formatRelativeTime('bad-date')).toBe('bad-date');
            consoleSpy.mockRestore();
        });
    });

    describe('truncateString', () => {
        it('truncates string if it exceeds maxLength and appends default ellipsis', () => {
            const longStr = 'This is a very long string that needs truncation';
            expect(truncateString(longStr, 10)).toBe('This is a…');
        });

        it('returns original string if length is within maxLength', () => {
            const shortStr = 'Short';
            expect(truncateString(shortStr, 10)).toBe('Short');
        });

        it('handles empty string safely', () => {
            expect(truncateString('')).toBe('');
        });
    });
});
