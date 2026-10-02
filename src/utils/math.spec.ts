import { clamp, getStarStats } from '@/utils/math';

describe('clamp', () => {
    it('clamps value within min and max boundaries', () => {
        expect(clamp(5, 1, 10)).toBe(5);
        expect(clamp(-5, 0, 10)).toBe(0);
        expect(clamp(15, 0, 10)).toBe(10);
    });
});

describe('getStarStats', () => {
    it('calculates full, half, and empty stars for an integer rating', () => {
        expect(getStarStats(4, 5)).toEqual({
            full: 4,
            half: false,
            empty: 1,
        });
    });

    it('calculates stars correctly when rating has a half fraction', () => {
        expect(getStarStats(3.5, 5)).toEqual({
            full: 3,
            half: true,
            empty: 1,
        });
    });

    it('accepts string ratings and parses them correctly', () => {
        expect(getStarStats('4.5', 5)).toEqual({
            full: 4,
            half: true,
            empty: 0,
        });
    });

    it('handles null, undefined, or invalid values by falling back to 0', () => {
        expect(getStarStats(null, 5)).toEqual({
            full: 0,
            half: false,
            empty: 5,
        });
        expect(getStarStats(undefined, 5)).toEqual({
            full: 0,
            half: false,
            empty: 5,
        });
        expect(getStarStats('invalid', 5)).toEqual({
            full: 0,
            half: false,
            empty: 5,
        });
    });

    it('respects custom maxStars parameter', () => {
        expect(getStarStats(8, 10)).toEqual({
            full: 8,
            half: false,
            empty: 2,
        });
    });
});
