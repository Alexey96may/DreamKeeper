<!-- src/views/HomeView.vue -->
<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto px-4 py-6">
            <AppTitle @action="goToNewDream">
                <template #title>
                    <div class="flex items-center gap-2">
                        <Moon /><span><span class="text-text-primary">Dreem</span>Keeper</span>
                    </div>
                </template>

                <template #button-content>
                    <div class="flex items-center gap-2">
                        <MoonStar /> <span class="text-text-inverse">Новый сон</span>
                    </div>
                </template>
            </AppTitle>

            <div class="dream-card relative px-14 py-8">
                <div class="absolute top-2 right-2 flex flex-col items-center justify-end gap-2">
                    <AppButton
                        @click="isModalOpen = !isModalOpen"
                        size="sm"
                        variant="secondary"
                        title="Параметры календаря"
                        :icon-left="CalendarIcon"
                    >
                    </AppButton>

                    <AppButton
                        @click="moveToday"
                        size="sm"
                        variant="secondary"
                        title="Вернуться на сегодняшний день"
                        :icon-left="CalendarCheck"
                    >
                    </AppButton>
                </div>

                <div class="flex justify-center">
                    <Calendar
                        ref="calendar"
                        :attributes="calendarAttributes"
                        :view="isWeeklyMod ? 'weekly' : 'monthly'"
                        :first-day-of-week="2"
                        :max-date="new Date()"
                        @dayclick="onDayClick"
                        class="dream-calendar"
                    />
                </div>
            </div>

            <StatsGrid :items="statsData" />
        </div>

        <AppModal v-model="isModalOpen" :close-on-overlay="true" title="Параметры Календаря">
            <AppCheckbox v-model="hasDots" label="Показывать Точки" />
            <AppCheckbox v-model="hasHighlight" label="Показывать Настроение" />
            <AppCheckbox v-model="isWeeklyMod" label="Режим по неделям" />
        </AppModal>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import type { ComponentPublicInstance } from 'vue';
    import { Calendar as CalendarIcon, CalendarCheck, Moon, MoonStar } from 'lucide-vue-next';
    import AppModal from '@/components/sections/AppModal.vue';
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
    import AppButton from '@/components/ui/AppButton.vue';
    import { formatToLocalDateStr, isPastOrPresentDay } from '@/utils/date';

    const { statsData } = useHomeStats();

    const router = useRouter();
    const sleepStore = useSleepStore();
    const userStateStore = useUserStateStore();

    const hasHighlight = ref(false);
    const hasDots = ref(true);

    const isModalOpen = ref(false);

    const calendar = ref<
        (ComponentPublicInstance & { move: (date: Date | string) => void }) | null
    >(null);

    const isWeeklyMod = ref(false);

    const moveToday = () => {
        calendar.value?.move(new Date());
    };

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
                        key: `dream-dot-${dream.id}`,
                        dates: [new Date(dateStr)],
                        dot: color,
                    });
                });

                const allDreamsLabels = limitedDreams
                    .map((d: Dream) => `⭐ ${d.quality || 0}/10 — ${d.title || 'Без описания'}`)
                    .join('\n');

                const totalCount = dreams.length;
                const hiddenCount = totalCount - 3;
                const hasOverflow = hiddenCount > 0;

                attributes.push({
                    key: `dreams-popover-${dateStr}`,
                    dates: [new Date(dateStr)],
                    popover: {
                        label: `\nСнов за день — ${totalCount}:\n${allDreamsLabels}${hasOverflow ? `\n... и еще ${hiddenCount}.` : ''}`,
                    },
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

        const todayStr = formatToLocalDateStr(new Date());

        attributes.push({
            key: 'today-highlight',
            dates: [new Date(todayStr)],
            highlight: {
                fillMode: 'outline',
                borderColor: 'var(--accent)',
                borderWidth: '1px',
                borderRadius: '50%',
            },
            popover: {
                label: 'Сегодня',
            },
        });

        return attributes;
    });

    const onDayClick = (day: { date: Date | string }): void => {
        if (!isPastOrPresentDay(day.date)) return;

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
        white-space: pre-line;

        /* Фиксируем ширину и перенос */
        width: 340px !important;
        max-width: 90vw !important;
        box-sizing: border-box !important;
        overflow-y: hidden;

        position: relative;
    }

    :deep(.vc-popover-content):first-line {
        font-weight: bold;
        color: var(--text-primary);
    }

    /* Стрелочка поповера */
    :deep(.vc-popover-caret) {
        border-top-color: var(--bg-elevated) !important;
        border-bottom-color: var(--bg-elevated) !important;
    }

    :deep(.vc-highlights) {
        overflow: visible;
    }

    :deep(.is-today .vc-highlight) {
        top: 0;
        left: 0;
        animation: pulse-today 2s infinite;
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

    :deep(.vc-highlight.vc-red) {
        background-color: var(--danger-bg) !important;
    }

    :deep(.vc-highlight.vc-green) {
        background-color: var(--success-bg) !important;
    }

    :deep(.vc-highlight.vc-blue) {
        background-color: var(--info-bg) !important;
    }

    :deep(.vc-highlight.vc-yellow) {
        background-color: var(--warning-bg) !important;
    }

    @keyframes pulse-today {
        0% {
            box-shadow: 0 0 0 0 var(--accent);
        }
        70% {
            box-shadow: 0 0 0 6px rgba(0, 0, 0, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        }
    }
</style>
