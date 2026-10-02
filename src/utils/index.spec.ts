import { normalizeToArray } from '@/utils';

describe('normalizeToArray', () => {
    it('returns the array as is if input is already an array', () => {
        const input = ['apple', 'banana'];
        expect(normalizeToArray(input)).toEqual(['apple', 'banana']);
    });

    it('wraps a single value into an array', () => {
        expect(normalizeToArray('apple')).toEqual(['apple']);
        expect(normalizeToArray(42)).toEqual([42]);
        expect(normalizeToArray(true)).toEqual([true]);
    });

    it('returns an empty array if input is null or undefined', () => {
        expect(normalizeToArray(null)).toEqual([]);
        expect(normalizeToArray(undefined)).toEqual([]);
    });
});
