<!-- src/views/HomeView.vue -->
<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto px-4 py-6">
            <!-- Заголовок -->
            <header class="mb-6 flex items-center justify-between">
                <div>
                    <h1 class="text-accent text-3xl font-bold">🌙 DreamKeeper</h1>
                    <p class="text-text-soft text-sm">Хранитель твоих снов и состояния</p>
                </div>
                <button @click="goToNewDream" class="dream-btn flex items-center gap-2">
                    ✨ Новый сон
                </button>
            </header>

            <!-- Календарь -->
            <div class="dream-card p-4">
                <Calendar
                    :attributes="calendarAttributes"
                    :trim-weeks="true"
                    :first-day-of-week="1"
                    @dayclick="onDayClick"
                    class="dream-calendar"
                />
            </div>

            <!-- Инфопанель выбранного дня -->
            <div v-if="selectedDay" class="dream-card fade-in mt-6 p-6">
                <div class="flex items-start justify-between">
                    <div>
                        <h3 class="text-text-primary text-xl font-semibold">
                            {{ formatDate(selectedDay.date) }}
                        </h3>
                        <p class="text-text-mute text-sm">
                            {{ getWeekday(selectedDay.date) }}
                        </p>
                    </div>
                    <button
                        @click="selectedDay = null"
                        class="text-text-mute hover:text-text-primary transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <!-- Сны за день -->
                <div v-if="getDreamsForDate(selectedDay.date).length > 0" class="mt-4">
                    <h4 class="text-text-soft mb-3 text-sm font-medium">Сны</h4>
                    <div
                        v-for="dream in getDreamsForDate(selectedDay.date)"
                        :key="dream.id"
                        class="bg-bg-secondary/50 border-border/50 mb-2 rounded-lg border p-3"
                    >
                        <div class="flex items-start justify-between">
                            <span class="text-text-primary">{{
                                dream.description || 'Без описания'
                            }}</span>
                            <span class="text-accent text-sm">⭐ {{ dream.quality }}/10</span>
                        </div>
                        <span
                            v-if="dream.type"
                            class="bg-accent/10 text-accent mt-1 inline-block rounded-full px-2 py-0.5 text-xs"
                        >
                            {{ getDreamTypeLabel(dream.type) }}
                        </span>
                    </div>
                </div>
                <p v-else class="text-text-mute mt-4 text-sm">Нет записей за этот день</p>

                <!-- Состояние за день -->
                <div
                    v-if="getStateForDate(selectedDay.date)"
                    class="border-border mt-4 border-t pt-4"
                >
                    <h4 class="text-text-soft mb-2 text-sm font-medium">Состояние</h4>
                    <div class="flex flex-wrap gap-4">
                        <span class="text-text-mute text-sm">
                            😊 Настроение: {{ getStateForDate(selectedDay.date)?.mood || '—' }}/10
                        </span>
                        <span class="text-text-mute text-sm">
                            ⚡ Энергия: {{ getStateForDate(selectedDay.date)?.energy || '—' }}/10
                        </span>
                        <span class="text-text-mute text-sm">
                            🧠 Фокус: {{ getStateForDate(selectedDay.date)?.focus || '—' }}/10
                        </span>
                    </div>
                </div>

                <button
                    @click="goToDreamForDate(selectedDay.date)"
                    class="text-accent hover:text-accent-hover mt-4 text-sm font-medium transition-colors"
                >
                    + Добавить запись за этот день
                </button>
            </div>

            <!-- Статистика -->
            <div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div class="dream-card p-4 text-center">
                    <div class="text-accent text-2xl font-bold">{{ totalDreams }}</div>
                    <div class="text-text-mute text-sm">Всего снов</div>
                </div>
                <div class="dream-card p-4 text-center">
                    <div class="text-accent text-2xl font-bold">{{ avgQuality }}</div>
                    <div class="text-text-mute text-sm">Среднее качество</div>
                </div>
                <div class="dream-card p-4 text-center">
                    <div class="text-accent text-2xl font-bold">{{ thisMonthDreams }}</div>
                    <div class="text-text-mute text-sm">Снов за месяц</div>
                </div>
                <div class="dream-card p-4 text-center">
                    <div class="text-accent text-2xl font-bold">{{ streakDays }}</div>
                    <div class="text-text-mute text-sm">Дней подряд</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { Calendar } from 'v-calendar-3';
    import 'v-calendar-3/style.css';
    import { useSleepStore } from '@/stores/modules/sleep';
    import { useUserStateStore } from '@/stores/modules/userState';
    import type { Dream } from '@/types/Dream';
    import type { UserState } from '@/types/UserState';
    import type { CalendarAttribute } from '@/types/Calendar';

    const router = useRouter();
    const sleepStore = useSleepStore();
    const userStateStore = useUserStateStore();

    const selectedDay = ref<{ date: string } | null>(null);

    // --- Атрибуты для календаря ---
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

    // --- Вычисления ---
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
        // Простая реализация: считаем дни подряд с записями снов
        if (sleepStore.sleeps.length === 0) return 0;

        const dates = sleepStore.sleeps
            .map((s: Dream) => s.date)
            .sort()
            .reverse();

        let streak = 1;
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Если сегодня нет записи, проверяем вчера
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

    // --- Методы ---
    const getDreamsForDate = (date: string): Dream[] => {
        return sleepStore.getDreamsByDate(date);
    };

    const getStateForDate = (date: string): UserState | undefined => {
        return userStateStore.getStateByDate(date);
    };

    const onDayClick = (day: { date: Date | string }): void => {
        const date = day.date instanceof Date ? day.date : new Date(day.date);
        selectedDay.value = { date: date.toISOString().split('T')[0] };
    };

    const formatDate = (date: string): string => {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getWeekday = (date: string): string => {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU', { weekday: 'long' });
    };

    const getDreamTypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            lucid: '🧠 Осознанный',
            nightmare: '😱 Кошмар',
            prophetic: '🔮 Вещий',
            normal: '💭 Обычный',
        };
        return labels[type] || type;
    };

    const goToNewDream = () => {
        router.push('/dream/new');
    };

    const goToDreamForDate = (date: string) => {
        router.push(`/dream/new?date=${date}`);
    };

    // --- Загрузка данных ---
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

    /* Анимация */
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
