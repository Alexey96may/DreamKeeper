import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useHomeStats } from './useHomeStats';
import { useSleepStore } from '@/stores/modules/dreem';
import type { Dream } from '@/types/Dream';

describe('useHomeStats', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        // Lock time to a deterministic date
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-05-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns default values when store is empty', () => {
        const { statsData } = useHomeStats();

        expect(statsData.value).toEqual([
            { id: 'total', value: 0, label: 'Всего снов' },
            { id: 'avg', value: '—', label: 'Среднее качество' },
            { id: 'month', value: 0, label: 'Снов за месяц' },
            { id: 'streak', value: 0, label: 'Дней подряд' },
        ]);
    });

    describe('streakDays calculation', () => {
        it('calculates streak when there are entries for today and previous days', () => {
            const sleepStore = useSleepStore();
            // Today is 2026-05-15
            sleepStore.sleeps = [
                { id: 1, date: '2026-05-15', quality: 9 },
                { id: 2, date: '2026-05-14', quality: 9 },
                { id: 3, date: '2026-05-13', quality: 9 },
            ] as Dream[];

            const { baseStats } = useHomeStats();
            const streakStat = baseStats.value.find((s) => s.id === 'streak');

            expect(streakStat?.value).toBe(3);
        });

        it('calculates streak when today is missing but yesterday is present', () => {
            const sleepStore = useSleepStore();
            // Today is 2026-05-15, missing 15th, but present 14th and 13th
            sleepStore.sleeps = [
                { id: 1, date: '2026-05-14' } as Dream,
                { id: 2, date: '2026-05-13' } as Dream,
            ];

            const { baseStats } = useHomeStats();
            const streakStat = baseStats.value.find((s) => s.id === 'streak');

            expect(streakStat?.value).toBe(2);
        });

        it('returns 0 if there are no entries for today or yesterday', () => {
            const sleepStore = useSleepStore();
            // Today is 2026-05-15, last entry is from the 13th
            sleepStore.sleeps = [{ id: 1, date: '2026-05-13' } as Dream];

            const { baseStats } = useHomeStats();
            const streakStat = baseStats.value.find((s) => s.id === 'streak');

            expect(streakStat?.value).toBe(0);
        });

        it('breaks streak when a day is missed in the past', () => {
            const sleepStore = useSleepStore();
            // Today is 2026-05-15. Present 15, 14, missing 13, present 12
            sleepStore.sleeps = [
                { id: 1, date: '2026-05-15' } as Dream,
                { id: 2, date: '2026-05-14' } as Dream,
                { id: 3, date: '2026-05-12' } as Dream,
            ];

            const { baseStats } = useHomeStats();
            const streakStat = baseStats.value.find((s) => s.id === 'streak');

            expect(streakStat?.value).toBe(2);
        });
    });

    it('combines baseStats and customStats into statsData', () => {
        const { customStats, statsData } = useHomeStats();

        customStats.value = [{ id: 'custom_1', value: 42, label: 'Custom Metric' }];

        expect(statsData.value).toHaveLength(5);
        expect(statsData.value[4]).toEqual({
            id: 'custom_1',
            value: 42,
            label: 'Custom Metric',
        });
    });
});
