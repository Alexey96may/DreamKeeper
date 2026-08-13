<!-- src/views/HomeView.vue -->
<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto px-4 py-6">
            <AppTitle @action="goToNewDream" />

            <div class="dream-card flex justify-center p-4">
                <Calendar
                    :attributes="calendarAttributes"
                    :trim-weeks="true"
                    :first-day-of-week="1"
                    @dayclick="onDayClick"
                    class="dream-calendar"
                />
            </div>

            <StatsGrid :items="statsData" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { Calendar } from 'v-calendar-3';
    import 'v-calendar-3/style.css';
    import { useSleepStore } from '@/stores/modules/dreem';
    import { useUserStateStore } from '@/stores/modules/userState';
    import { useHomeStats } from '@/composables/useHomeStats';
    import StatsGrid from '@/components/sections/StatsGrid.vue';
    import AppTitle from '@/components/sections/AppTitle.vue';
    import type { Dream } from '@/types/Dream';
    import type { UserState } from '@/types/UserState';
    import type { CalendarAttribute } from '@/types/Calendar';
    import { formatToLocalDateStr } from '@/utils/date';

    const { statsData } = useHomeStats();

    const router = useRouter();
    const sleepStore = useSleepStore();
    const userStateStore = useUserStateStore();

    const calendarAttributes = computed(() => {
        const attributes: CalendarAttribute[] = [];

        // Сны с качеством
        sleepStore.sleeps.forEach((dream: Dream) => {
            if (dream.date) {
                const quality = dream.quality || 0;
                let color = 'gray';
                if (quality >= 8) color = 'green';
                else if (quality >= 6) color = 'blue';
                else if (quality >= 4) color = 'yellow';
                else color = 'red';

                attributes.push({
                    key: `dream-${dream.id}`,
                    dates: [new Date(dream.date)],
                    dot: color,
                    popover: {
                        label: `⭐ ${quality}/10 — ${dream.description || 'Без описания'}`,
                    },
                });
            }
        });

        // Состояние пользователя
        userStateStore.states.forEach((state: UserState) => {
            if (state.date) {
                const mood = state.mood || 0;
                let color = 'gray';
                if (mood >= 8) color = 'green';
                else if (mood >= 6) color = 'blue';
                else if (mood >= 4) color = 'yellow';
                else color = 'red';

                attributes.push({
                    key: `state-${state.id}`,
                    dates: [new Date(state.date)],
                    bar: color,
                    popover: {
                        label: `😊 Настроение: ${mood}/10`,
                    },
                });
            }
        });

        return attributes;
    });

    const onDayClick = (day: { date: Date | string }): void => {
        const dateObj = day.date instanceof Date ? day.date : new Date(day.date);
        const dateStr = formatToLocalDateStr(dateObj);

        router.push(`/day/${dateStr}`);
    };

    const goToNewDream = () => {
        const dateStr = formatToLocalDateStr();

        router.push({
            name: 'dream-create',
            query: { date: dateStr },
        });
    };

    onMounted(async () => {
        await sleepStore.loadAll();
        await userStateStore.loadAll();
    });
</script>

<style scoped>
    .dream-calendar {
        --vc-color: var(--color-accent);
        --vc-bg: var(--color-background-card);
        --vc-text: var(--color-text);
        --vc-text-light: var(--color-text-mute);
        --vc-border: var(--color-border);
    }

    .fade-in {
        animation: fadeIn 0.3s ease forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
