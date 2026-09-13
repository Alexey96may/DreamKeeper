<!-- src/views/HomeView.vue -->
<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto px-4 py-6">
            <AppTitle @action="goToNewDream" />

            <div class="dream-card p-6">
                <div class="flex items-center justify-end gap-2">
                    <AppCheckbox v-model="hasDots" label="Показывать Точки" />
                    <AppCheckbox v-model="hasHighlight" label="Показывать Настроение" />
                </div>

                <div class="flex justify-center">
                    <Calendar
                        :attributes="calendarAttributes"
                        :trim-weeks="true"
                        :first-day-of-week="2"
                        @dayclick="onDayClick"
                        class="dream-calendar"
                    />
                </div>
            </div>

            <StatsGrid :items="statsData" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { Calendar } from 'v-calendar-3';
    import 'v-calendar-3/style.css';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useUserStateStore } from '@/stores/modules/userState';
    import { useHomeStats } from '@/composables/useHomeStats';
    import StatsGrid from '@/components/sections/StatsGrid.vue';
    import AppCheckbox from '@/components/ui/AppCheckbox.vue';
    import AppTitle from '@/components/sections/AppTitle.vue';
    import type { Dream } from '@/types/Dream';
    import type { UserState } from '@/types/UserState';
    import type { CalendarAttribute } from '@/types/Calendar';
    import { formatToLocalDateStr } from '@/utils/date';

    const { statsData } = useHomeStats();

    const router = useRouter();
    const sleepStore = useSleepStore();
    const userStateStore = useUserStateStore();

    const hasHighlight = ref(false);
    const hasDots = ref(true);

    const calendarAttributes = computed(() => {
        const attributes: CalendarAttribute[] = [];
        const sleepsByDate = new Map<string, Dream[]>();

        sleepStore.sleeps.forEach((dream: Dream) => {
            if (dream.date) {
                const dateStr = formatToLocalDateStr(new Date(dream.date));
                if (!sleepsByDate.has(dateStr)) {
                    sleepsByDate.set(dateStr, []);
                }
                sleepsByDate.get(dateStr)!.push(dream);
            }
        });

        if (hasDots.value) {
            sleepsByDate.forEach((dreams, dateStr) => {
                const limitedDreams = dreams.slice(0, 3);

                limitedDreams.forEach((dream: Dream) => {
                    const quality = dream.quality || 0;
                    let color = 'gray';
                    if (quality >= 8) color = 'green';
                    else if (quality >= 6) color = 'blue';
                    else if (quality >= 4) color = 'yellow';
                    else color = 'red';

                    attributes.push({
                        key: `dream-${dream.id}`,
                        dates: [new Date(dateStr)],
                        dot: color,
                        popover: {
                            label: `⭐ ${quality}/10 — ${dream.title || 'Без описания'}`,
                        },
                    });
                });
            });
        }

        if (hasHighlight.value) {
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
                        highlight: color,
                        popover: {
                            label: `😊 Настроение: ${mood}/10`,
                        },
                    });
                }
            });
        }

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
    :deep(.vc-container) {
        background-color: var(--bg-primary);
        border-color: var(--border-color);
        color: var(--text-primary);
        font-family: inherit;
        padding: 1.5rem;
    }

    :deep(.vc-pane) {
        background-color: transparent;
    }

    :deep(.vc-header) {
        background-color: transparent;
        margin-bottom: 1rem;
    }
    :deep(.vc-week) {
        margin-bottom: 4px;
    }

    :deep(.vc-title),
    :deep(.vc-weekday),
    :deep(.vc-nav-title) {
        color: var(--text-primary) !important;
    }

    :deep(.vc-day):hover {
        background-color: var(--bg-tertiary);
    }

    :deep(.vc-attr) {
        /* background-color: var(--accent) !important;
        color: var(--text-inverse) !important; */
    }

    :deep(.vc-nav-container) {
        background-color: var(--bg-elevated);
        border-color: var(--border-color);
        color: var(--text-primary);
    }

    /* Контейнер поповера с фиксированной шириной и кастомным скроллом */
    :deep(.vc-popover-content) {
        background-color: var(--bg-elevated) !important;
        border: 1px solid var(--border-color) !important;
        color: var(--text-primary) !important;
        border-radius: 0.75rem !important;
        padding: 0.75rem 1rem !important;
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.2),
            0 4px 6px -4px rgba(0, 0, 0, 0.2) !important;
        font-family: inherit !important;
        font-size: 0.875rem !important;

        /* Фиксируем ширину и включаем перенос */
        width: 340px !important;
        max-width: 90vw !important;
        box-sizing: border-box !important;

        /* Кастомный скролл внутри поповера (если текст длинный) */
        max-height: 200px !important;
        overflow-y: auto !important;
        scrollbar-width: thin;
        scrollbar-color: var(--border-strong) var(--bg-secondary);
    }

    /* Кастомный скроллбар (Webkit / Chrome / Safari / Edge) */
    :deep(.vc-popover-content)::-webkit-scrollbar {
        width: 5px;
    }

    :deep(.vc-popover-content)::-webkit-scrollbar-track {
        background: var(--bg-secondary);
        border-radius: 9999px;
    }

    :deep(.vc-popover-content)::-webkit-scrollbar-thumb {
        background-color: var(--border-strong);
        border-radius: 9999px;
    }

    :deep(.vc-popover-content)::-webkit-scrollbar-thumb:hover {
        background-color: var(--text-muted);
    }

    /* Стрелочка поповера */
    :deep(.vc-popover-caret) {
        border-top-color: var(--bg-elevated) !important;
        border-bottom-color: var(--bg-elevated) !important;
    }

    :deep(.vc-day.is-not-in-month) {
        pointer-events: auto !important;
        opacity: 0.6;
    }

    :deep(.vc-day.is-not-in-month .vc-day-content) {
        cursor: pointer !important;
    }

    :deep(.vc-day.is-not-in-month:hover) {
        opacity: 1;
        background-color: var(--bg-tertiary);
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
