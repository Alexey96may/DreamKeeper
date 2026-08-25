import { describe, expect, it } from 'vitest';

import { formatDistance, formatMoney } from './format';

// нормализация пробелов (NBSP из Intl)
const normalize = (str: string) => str.replace(/\s/g, ' ');

describe('formatMoney', () => {
    it('returns 0 ₽ for null/undefined/0', () => {
        expect(formatMoney(null)).toBe('0 ₽');
        expect(formatMoney(undefined)).toBe('0 ₽');
        expect(formatMoney(0)).toBe('0 ₽');
    });

    it('formats rubles correctly (no kopeks)', () => {
        expect(formatMoney(100)).toBe('1 ₽');
        expect(formatMoney(1000)).toBe('10 ₽');
    });

    it('formats kopeks correctly', () => {
        expect(formatMoney(150)).toBe('1,5 ₽');
        expect(formatMoney(199)).toBe('1,99 ₽');
    });

    it('rounds to max 2 decimal places', () => {
        expect(formatMoney(101)).toBe('1,01 ₽');
        expect(formatMoney(105)).toBe('1,05 ₽');
    });

    it('matches snapshot for formatting stability', () => {
        const result = [
            formatMoney(0),
            formatMoney(100),
            formatMoney(150),
            formatMoney(199),
            formatMoney(1000),
            formatMoney(1000000),
        ].map(normalize);

        expect(result).toMatchSnapshot();
    });
});

describe('formatDistance', () => {
    it('returns 0 км for null/undefined/0', () => {
        expect(formatDistance(null)).toBe('0 км');
        expect(formatDistance(undefined)).toBe('0 км');
        expect(formatDistance(0)).toBe('0 км');
    });

    it('converts meters to kilometers', () => {
        expect(formatDistance(1000)).toBe('1,0 км');
        expect(formatDistance(1500)).toBe('1,5 км');
    });

    it('keeps correct precision', () => {
        expect(formatDistance(1234)).toBe('1,23 км');
        expect(formatDistance(1200)).toBe('1,2 км');
    });

    it('matches snapshot for formatting stability', () => {
        const result = [
            formatDistance(0),
            formatDistance(1000),
            formatDistance(1500),
            formatDistance(1234),
            formatDistance(100000),
        ].map(normalize);

        expect(result).toMatchSnapshot();
    });
});
