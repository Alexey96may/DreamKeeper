<!-- src/views/HomeView.vue -->
<template>
    <div class="text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto flex flex-col gap-6 px-4 py-6">
            <AppTitle @action="goToNewDream">
                <template #title>
                    <div class="flex items-center gap-2">
                        <Moon />
                        <h1>
                            <span class="text-text-primary text-[length:inherit]!">Dreem</span
                            >Keeper
                        </h1>
                    </div>
                </template>

                <template #button-content>
                    <div class="flex items-center gap-2">
                        <MoonStar />
                        <span class="text-text-inverse hidden sm:inline">Новый сон</span>
                    </div>
                </template>
            </AppTitle>

            <div class="dream-card mx-auto flex justify-center p-0 lg:w-full lg:px-14 lg:py-8">
                <Calendar
                    ref="calendar"
                    :key="calendarKey"
                    :attributes="calendarAttributes"
                    :view="isWeeklyMod ? 'weekly' : 'monthly'"
                    :first-day-of-week="2"
                    :max-date="new Date()"
                    @dayclick="handleDayClick"
                    class="dream-calendar"
                >
                    <template #footer>
                        <div
                            class="border-border-subtle flex items-center justify-center gap-3 border-t pt-4"
                        >
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
                    </template>
                </Calendar>
            </div>

            <StatsGrid :items="statsData" />

            <ExpectedDreamsSection />
        </div>

        <Teleport to="body">
            <div
                v-if="activePopover"
                class="custom-calendar-popover border-border bg-bg-elevated absolute z-50 w-85 max-w-[90vw] -translate-x-1/2 rounded-xl border p-3 text-xs shadow-xl transition-all"
                :style="{
                    top: `${activePopover.top}px`,
                    left: `${activePopover.left}px`,
                }"
            >
                <!-- Заголовок даты -->
                <div
                    @click="onDayClick({ date: activePopover.dateStr })"
                    class="border-border text-text-primary hover:text-accent flex cursor-pointer items-baseline justify-between border-b pb-1.5 text-sm font-bold transition-colors"
                >
                    <span>
                        {{
                            activePopover.ariaLabel.charAt(0).toUpperCase() +
                            activePopover.ariaLabel.slice(1)
                        }}
                    </span>
                    <span v-if="activePopover.isToday" class="text-accent text-xs font-semibold">
                        Сегодня
                    </span>
                </div>

                <div class="mt-2.5 space-y-3">
                    <div v-if="activePopover.dreams.length > 0" class="space-y-2">
                        <div class="text-text-secondary font-semibold">
                            Снов за день —
                            <span class="font-bold">{{ activePopover.dreams.length }}</span
                            >:
                        </div>
                        <div class="max-h-40 space-y-1.5 overflow-y-auto pr-1">
                            <div
                                v-for="dream in activePopover.dreams"
                                :key="dream.id"
                                @click="goToDreamDetail(dream.slug)"
                                class="text-text-primary hover:text-accent-hover flex cursor-pointer items-center gap-1.5 transition-colors"
                            >
                                <AppRating v-if="dream.quality" :value="dream.quality" :max="10" />

                                <span class="truncate font-medium">
                                    {{ dream.title || 'Без названия' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="activePopover.mood !== undefined"
                        class="text-text-primary flex items-center gap-1.5 font-medium"
                    >
                        <span>Настроение:</span>
                        <span class="font-bold">{{ activePopover.mood }}/10</span>
                    </div>

                    <div
                        v-if="activePopover.dreams.length === 0 && activePopover.mood === undefined"
                    >
                        <span class="text-text-primary">Нет данных за день!</span>
                    </div>
                </div>
            </div>
        </Teleport>

        <AppModal v-model="isModalOpen" :close-on-overlay="true" title="Параметры Календаря">
            <AppCheckbox v-model="hasDots" label="Показывать Точки" />
            <AppCheckbox v-model="hasHighlight" label="Показывать Настроение" />
            <AppCheckbox v-model="isWeeklyMod" label="Режим по неделям" />
        </AppModal>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from 'vue';
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
    import AppRating from '@/components/ui/AppRating.vue';
    import AppTitle from '@/components/sections/AppTitle.vue';
    import ExpectedDreamsSection from '@/components/sections/ExpectedDreamsSection.vue';
    import type { Dream } from '@/types/Dream';
    import type { UserState } from '@/types/UserState';
    import type { CalendarAttribute, CalendarDay } from '@/types/Calendar';
    import { useNavigation } from '@/composables/routing/useNavigation';
    import AppButton from '@/components/ui/AppButton.vue';
    import { formatToLocalDateStr, isPastOrPresentDay } from '@/utils/date';

    const { statsData } = useHomeStats();

    const router = useRouter();
    const sleepStore = useSleepStore();
    const userStateStore = useUserStateStore();

    const { goToDreamDetail } = useNavigation();
    const hasHighlight = ref(false);
    const hasDots = ref(true);

    const isModalOpen = ref(false);

    const calendar = ref<
        (ComponentPublicInstance & { move: (date: Date | string) => void }) | null
    >(null);

    const isWeeklyMod = ref(false);

    const calendarKey = computed(
        () => `${sleepStore.sleeps.length}-${userStateStore.states.length}`,
    );

    // Карты данных для быстрого доступа
    const sleepsByDateMap = computed(() => {
        const map = new Map<string, Dream[]>();
        sleepStore.sleeps.forEach((dream: Dream) => {
            if (dream.date) {
                const dateStr = formatToLocalDateStr(new Date(dream.date));
                if (!map.has(dateStr)) map.set(dateStr, []);
                map.get(dateStr)!.push(dream);
            }
        });
        return map;
    });

    const userStatesByDateMap = computed(() => {
        const map = new Map<string, UserState>();
        userStateStore.states.forEach((state: UserState) => {
            if (state.date) {
                const dateStr = formatToLocalDateStr(new Date(state.date));
                map.set(dateStr, state);
            }
        });
        return map;
    });

    // Атрибуты ТОЛЬКО для визуала (точки и рамки)
    const calendarAttributes = computed(() => {
        const attributes: CalendarAttribute[] = [];

        if (hasDots.value) {
            sleepsByDateMap.value.forEach((dreams, dateStr) => {
                dreams.slice(0, 3).forEach((dream: Dream) => {
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
            });
        }

        if (hasHighlight.value) {
            userStatesByDateMap.value.forEach((state: UserState, dateStr) => {
                const mood = state.mood || 0;
                let color = 'gray';
                if (mood >= 8) color = 'green';
                else if (mood >= 6) color = 'blue';
                else if (mood >= 4) color = 'yellow';
                else color = 'red';

                attributes.push({
                    key: `state-${state.id}`,
                    dates: [new Date(dateStr)],
                    highlight: color,
                });
            });
        }

        const todayStr = formatToLocalDateStr(new Date());

        attributes.push({
            key: 'today-highlight',
            dates: [new Date(todayStr)],
            highlight: {
                fillMode: 'outline',
                borderColor: 'var(--ring-color)',
                borderWidth: '1px',
                borderRadius: '50%',
            },
        });

        return attributes;
    });

    interface ActivePopoverData {
        dateStr: string;
        ariaLabel: string;
        isToday: boolean;
        dreams: Dream[];
        mood?: number;
        top: number;
        left: number;
        isAbove: boolean;
    }

    const activePopover = ref<ActivePopoverData | null>(null);

    const handleDayClick = (day: CalendarDay, event: MouseEvent) => {
        const dateObj = day.date instanceof Date ? day.date : new Date(day.date);
        const dateStr = formatToLocalDateStr(dateObj);

        if (activePopover.value?.dateStr === dateStr) {
            activePopover.value = null;
            return;
        }

        const dreams = sleepsByDateMap.value.get(dateStr) || [];
        const state = userStatesByDateMap.value.get(dateStr);

        if ((day.inPrevMonth || day.inNextMonth) && !day.isDisabled) {
            activePopover.value = null;
            calendar.value?.move(day.date);
            return;
        }

        if (day.isDisabled) {
            activePopover.value = null;
            return;
        }

        const target = (event.currentTarget || event.target) as HTMLElement;
        const dayCell = target.closest('.vc-day') || target;
        const rect = dayCell.getBoundingClientRect();

        const padding = 12;
        const popoverWidth = Math.min(340, window.innerWidth * 0.9);
        const halfWidth = popoverWidth / 2;

        // Учитываем текущую прокрутку страницы
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        // 1. Координата X с учетом скролла
        let left = rect.left + scrollX + rect.width / 2;
        const minLeft = scrollX + halfWidth + padding;
        const maxLeft = scrollX + window.innerWidth - halfWidth - padding;

        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        // 2. Координата Y с учетом скролла
        let top = rect.bottom + scrollY + 8;

        // Если упирается в нижний край видимой области (viewport)
        const estimatedHeight = 180;
        if (rect.bottom + estimatedHeight > window.innerHeight - padding) {
            top = rect.top + scrollY - estimatedHeight - 8;
        }

        activePopover.value = {
            dateStr,
            ariaLabel: day.ariaLabel,
            isToday: day.isToday,
            dreams,
            mood: state?.mood,
            top,
            left,
            isAbove: false,
        };
    };

    const closePopoverOnClickOutside = (e: MouseEvent) => {
        if (!activePopover.value) return;
        const target = e.target as HTMLElement;
        if (!target.closest('.custom-calendar-popover') && !target.closest('.vc-day')) {
            activePopover.value = null;
        }
    };

    const moveToday = () => {
        calendar.value?.move(new Date());
    };

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
        window.addEventListener('click', closePopoverOnClickOutside);
        await sleepStore.loadAll();
        await userStateStore.loadAll();
    });

    onUnmounted(() => {
        window.removeEventListener('click', closePopoverOnClickOutside);
    });
</script>

<style scoped>
    :deep(.vc-container) {
        background-color: var(--bg-primary);
        border-color: var(--border-color);
        color: var(--text-primary);
        font-family: inherit;
        padding: 1rem;
        overflow-x: auto;
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

    :deep(.vc-nav-container) {
        background-color: var(--bg-elevated);
        color: var(--text-primary);
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
