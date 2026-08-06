import { computed, ref } from 'vue';
import type { MainStatItem } from '@/types/Stats';
import type { Dream } from '@/types/Dream';
import { useSleepStore } from '@/stores/modules/sleep';

export function useHomeStats() {
    const sleepStore = useSleepStore();
    const customStats = ref<MainStatItem[]>([]);

    const totalDreams = computed(() => sleepStore.sleeps.length);

    const avgQuality = computed(() => {
        if (sleepStore.sleeps.length === 0) return '—';
        const sum = sleepStore.sleeps.reduce((acc: number, s: Dream) => acc + (s.quality || 0), 0);
        return (sum / sleepStore.sleeps.length).toFixed(1);
    });

    const thisMonthDreams = computed(() => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        return sleepStore.sleeps.filter((s: Dream) => {
            const d = new Date(s.date);
            return d.getMonth() === month && d.getFullYear() === year;
        }).length;
    });

    const streakDays = computed(() => {
        if (sleepStore.sleeps.length === 0) return 0;

        const dates = sleepStore.sleeps
            .map((s: Dream) => s.date)
            .sort()
            .reverse();

        let streak = 1;
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const startDate = new Date(today);
        if (!dates.includes(todayStr)) {
            startDate.setDate(startDate.getDate() - 1);
        }

        const startStr = startDate.toISOString().split('T')[0];
        if (!dates.includes(startStr)) return 0;

        const current = new Date(startDate);
        while (true) {
            current.setDate(current.getDate() - 1);
            const str = current.toISOString().split('T')[0];
            if (dates.includes(str)) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    });

    const baseStats = computed<MainStatItem[]>(() => [
        { id: 'total', value: totalDreams.value, label: 'Всего снов' },
        { id: 'avg', value: avgQuality.value, label: 'Среднее качество' },
        { id: 'month', value: thisMonthDreams.value, label: 'Снов за месяц' },
        { id: 'streak', value: streakDays.value, label: 'Дней подряд' },
    ]);

    const statsData = computed(() => [...baseStats.value, ...customStats.value]);

    return {
        customStats,
        baseStats,
        statsData,
    };
}
