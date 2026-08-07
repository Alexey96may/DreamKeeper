<template>
    <main
        class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen"
        aria-label="Детальный просмотр сна"
    >
        <div class="container mx-auto max-w-2xl px-4 py-6">
            <!-- Навигация назад -->
            <button
                @click="goBack"
                type="button"
                aria-label="Вернуться на предыдущую страницу"
                class="text-text-mute hover:text-text-primary focus-visible:outline-accent mb-4 flex items-center gap-2 rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                <span aria-hidden="true">←</span> Назад
            </button>

            <!-- Индикатор загрузки -->
            <div
                v-if="sleepStore.loading && !dream"
                role="status"
                aria-live="polite"
                class="dream-card text-text-mute p-6 text-center"
            >
                Загрузка данных о сне...
            </div>

            <!-- Карточка сна -->
            <article
                v-else-if="dream"
                class="dream-card space-y-6 p-6"
                aria-labelledby="dream-title"
            >
                <!-- Шапка: заголовок, бейджи состояния, дата, категория, время суток -->
                <header class="border-border/50 border-b pb-4">
                    <div class="flex items-center justify-between gap-2">
                        <time :datetime="dream.date" class="text-text-mute text-sm font-medium">
                            {{ formattedDate }}
                        </time>

                        <div class="flex items-center gap-2">
                            <span v-if="dream.isFavorite" title="В избранном">⭐</span>
                            <span v-if="dream.isPinned" title="Закреплено">📌</span>
                            <span
                                v-if="dream.timeOfDay"
                                class="bg-bg-secondary text-text-soft rounded-full px-2.5 py-0.5 text-xs font-medium"
                            >
                                {{ getTimeOfDayLabel(dream.timeOfDay) }}
                            </span>
                        </div>
                    </div>

                    <h1 id="dream-title" class="text-text-primary mt-2 text-2xl font-bold">
                        {{ dream.title }}
                    </h1>

                    <!-- Категории сна -->
                    <div
                        v-if="dream.categories?.length"
                        class="mt-3 flex flex-wrap gap-2"
                        aria-label="Категории сна"
                    >
                        <span
                            v-for="cat in dream.categories"
                            :key="cat"
                            class="bg-accent/10 text-accent rounded-md px-2.5 py-1 text-xs font-semibold"
                        >
                            {{ getCategoryLabel(cat) }}
                        </span>
                    </div>
                </header>

                <!-- Блок оценок (только существующие в интерфейсе) -->
                <section
                    v-if="hasRatings"
                    class="bg-bg-secondary/50 rounded-xl p-4"
                    aria-label="Оценки сна"
                >
                    <h2 class="sr-only">Оценки</h2>
                    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div v-if="dream.quality !== undefined" class="text-center">
                            <span class="text-text-mute block text-xs">Качество</span>
                            <span
                                class="text-text-primary text-base font-bold"
                                :aria-label="`Качество сна: ${dream.quality} из 10`"
                            >
                                {{ dream.quality }}/10
                            </span>
                        </div>

                        <div v-if="dream.clarity !== undefined" class="text-center">
                            <span class="text-text-mute block text-xs">Ясность</span>
                            <span
                                class="text-text-primary text-base font-bold"
                                :aria-label="`Ясность сна: ${dream.clarity} из 10`"
                            >
                                {{ dream.clarity }}/10
                            </span>
                        </div>

                        <div v-if="dream.lucidityLevel !== undefined" class="text-center">
                            <span class="text-text-mute block text-xs">Осознанность</span>
                            <span
                                class="text-text-primary text-base font-bold"
                                :aria-label="`Уровень осознанности: ${dream.lucidityLevel} из 10`"
                            >
                                {{ dream.lucidityLevel }}/10
                            </span>
                        </div>

                        <div v-if="dream.moodAfter !== undefined" class="text-center">
                            <span class="text-text-mute block text-xs">Настроение после</span>
                            <span
                                class="text-text-primary text-base font-bold"
                                :aria-label="`Настроение после сна: ${dream.moodAfter} из 10`"
                            >
                                {{ dream.moodAfter }}/10
                            </span>
                        </div>
                    </div>
                </section>

                <!-- Контекст перед сном -->
                <section
                    v-if="dream.PreSleepContext"
                    class="border-border/40 border-l-2 pl-3 italic"
                >
                    <h2
                        class="text-text-soft text-xs font-semibold tracking-wider uppercase not-italic"
                    >
                        Перед сном
                    </h2>
                    <p class="text-text-mute mt-1 text-sm">
                        {{ dream.PreSleepContext }}
                    </p>
                </section>

                <!-- Описание сна -->
                <section>
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Описание
                    </h2>
                    <p class="text-text-primary mt-2 leading-relaxed whitespace-pre-line">
                        {{ dream.description }}
                    </p>
                </section>

                <!-- Свойства сна (Цвет и Ощущения) -->
                <section
                    v-if="dream.isColor !== undefined || dream.sensations?.length"
                    class="space-y-2"
                >
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Свойства сна
                    </h2>
                    <div class="flex flex-wrap items-center gap-2">
                        <span
                            v-if="dream.isColor !== undefined"
                            class="bg-bg-secondary text-text-primary rounded-md px-2.5 py-1 text-xs"
                        >
                            {{ dream.isColor ? '🎨 Цветной' : '🔲 Чёрно-белый' }}
                        </span>
                        <span
                            v-for="sensation in dream.sensations"
                            :key="sensation"
                            class="bg-bg-secondary text-text-primary rounded-md px-2.5 py-1 text-xs"
                        >
                            {{ getSensoryLabel(sensation) }}
                        </span>
                    </div>
                </section>

                <!-- Аналитика (Персонажи, Локации, Предметы, Эмоции) -->
                <section v-if="hasAnalytics" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Аналитика
                    </h2>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div
                            v-if="dream.characters?.length"
                            class="bg-bg-secondary/30 rounded-lg p-2.5"
                        >
                            <span class="text-text-mute mb-1 block text-xs font-medium"
                                >👥 Персонажи:</span
                            >
                            <p class="text-text-primary text-xs font-medium">
                                {{ dream.characters.join(', ') }}
                            </p>
                        </div>

                        <div
                            v-if="dream.locations?.length"
                            class="bg-bg-secondary/30 rounded-lg p-2.5"
                        >
                            <span class="text-text-mute mb-1 block text-xs font-medium"
                                >📍 Локации:</span
                            >
                            <p class="text-text-primary text-xs font-medium">
                                {{ dream.locations.join(', ') }}
                            </p>
                        </div>

                        <div
                            v-if="dream.objects?.length"
                            class="bg-bg-secondary/30 rounded-lg p-2.5"
                        >
                            <span class="text-text-mute mb-1 block text-xs font-medium"
                                >📦 Предметы:</span
                            >
                            <p class="text-text-primary text-xs font-medium">
                                {{ dream.objects.join(', ') }}
                            </p>
                        </div>

                        <div
                            v-if="dream.emotions?.length"
                            class="bg-bg-secondary/30 rounded-lg p-2.5"
                        >
                            <span class="text-text-mute mb-1 block text-xs font-medium"
                                >🎭 Эмоции:</span
                            >
                            <p class="text-text-primary text-xs font-medium">
                                {{ dream.emotions.join(', ') }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Интерпретации -->
                <section v-if="dream.interpretations?.length" class="space-y-2">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Интерпретация
                    </h2>
                    <ul class="space-y-2" role="list">
                        <li
                            v-for="(interp, idx) in dream.interpretations"
                            :key="idx"
                            class="bg-bg-secondary/40 border-border/40 rounded-lg border p-3"
                        >
                            <div class="flex items-center justify-between">
                                <span class="text-text-primary text-sm font-semibold">{{
                                    interp.symbol
                                }}</span>
                                <span
                                    v-if="interp.source"
                                    class="text-text-mute text-[10px] uppercase"
                                >
                                    {{
                                        interp.source === 'custom'
                                            ? 'Личное'
                                            : 'Базовое руководство'
                                    }}
                                </span>
                            </div>
                            <p class="text-text-mute mt-1 text-xs leading-normal">
                                {{ interp.meaning }}
                            </p>
                        </li>
                    </ul>
                </section>

                <!-- Личные заметки -->
                <section v-if="dream.personalNotes">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Личные заметки
                    </h2>
                    <p
                        class="text-text-primary bg-bg-secondary/30 mt-1 rounded-lg p-3 text-xs leading-relaxed italic"
                    >
                        {{ dream.personalNotes }}
                    </p>
                </section>

                <!-- Связанные сны -->
                <section v-if="dream.relatedDreams?.length">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Связанные сны
                    </h2>
                    <ul class="mt-2 flex flex-wrap gap-2" role="list">
                        <li
                            v-for="(rel, idx) in dream.relatedDreams"
                            :key="idx"
                            class="bg-bg-secondary text-text-primary rounded-md px-2.5 py-1 text-xs"
                        >
                            🔗 Сон #{{ rel.dreamId }}
                            <span v-if="rel.relationType" class="text-text-mute">
                                ({{ getRelationLabel(rel.relationType) }})
                            </span>
                        </li>
                    </ul>
                </section>

                <!-- Теги -->
                <section v-if="dream.tags?.length" aria-label="Теги">
                    <ul class="flex flex-wrap gap-1.5" role="list">
                        <li
                            v-for="tag in dream.tags"
                            :key="tag"
                            class="bg-bg-secondary text-text-soft rounded px-2 py-0.5 text-xs font-medium"
                        >
                            #{{ tag }}
                        </li>
                    </ul>
                </section>

                <!-- Метаданные (createdAt, updatedAt) -->
                <footer class="border-border/30 text-text-mute space-y-1 border-t pt-4 text-xs">
                    <p v-if="formattedCreatedAt">
                        <span class="font-medium">Создано:</span> {{ formattedCreatedAt }}
                    </p>
                    <p v-if="formattedUpdatedAt">
                        <span class="font-medium">Изменено:</span> {{ formattedUpdatedAt }}
                    </p>
                </footer>

                <!-- Кнопки действий -->
                <div class="border-border/50 mt-6 flex items-center justify-between border-t pt-4">
                    <button
                        @click="handleDelete"
                        type="button"
                        :disabled="sleepStore.loading"
                        class="rounded-md px-2 py-1 text-sm font-medium text-red-400 transition-colors hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:opacity-50"
                    >
                        Удалить
                    </button>

                    <button
                        @click="goToEdit"
                        type="button"
                        class="bg-bg-secondary hover:bg-border text-text-primary focus-visible:outline-accent rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        Редактировать
                    </button>
                </div>
            </article>

            <!-- Пустое состояние -->
            <div v-else role="status" aria-live="polite" class="dream-card p-6 text-center">
                <p class="text-text-mute">Сон не найден</p>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/sleep';
    import type { DreamCategory, TimeOfDay, SensoryAspect, RelatedDreamRef } from '@/types/Dream';

    const props = defineProps<{
        id: string;
    }>();

    const router = useRouter();
    const sleepStore = useSleepStore();

    const dream = computed(() => sleepStore.getDreamById(Number(props.id)));

    // Проверки наличия данных
    const hasRatings = computed(() => {
        if (!dream.value) return false;
        return (
            dream.value.quality !== undefined ||
            dream.value.clarity !== undefined ||
            dream.value.lucidityLevel !== undefined ||
            dream.value.moodAfter !== undefined
        );
    });

    const hasAnalytics = computed(() => {
        if (!dream.value) return false;
        return !!(
            dream.value.characters?.length ||
            dream.value.locations?.length ||
            dream.value.objects?.length ||
            dream.value.emotions?.length
        );
    });

    // Форматирование дат
    const formatDate = (dateString?: string, options?: Intl.DateTimeFormatOptions) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('ru-RU', options);
    };

    const formattedDate = computed(() => {
        return formatDate(dream.value?.date, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    });

    const formattedCreatedAt = computed(() => {
        return formatDate(dream.value?.createdAt, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    });

    const formattedUpdatedAt = computed(() => {
        return formatDate(dream.value?.updatedAt, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    });

    // Маппинг справочников из объявленных типов
    const getCategoryLabel = (cat: DreamCategory): string => {
        const map: Record<DreamCategory, string> = {
            lucid: 'Осознанный (ОС)',
            nightmare: 'Кошмар',
            prophetic: 'Вещий / Сбывшийся',
            false_awakening: 'Ложное пробуждение',
            paralysis: 'Сонный паралич',
            recurring: 'Повторяющийся',
        };
        return map[cat] || cat;
    };

    const getTimeOfDayLabel = (time: TimeOfDay): string => {
        const map: Record<TimeOfDay, string> = {
            night: 'Ночной',
            nap: 'Дневной',
            morning: 'Утренний',
        };
        return map[time] || time;
    };

    const getSensoryLabel = (sensation: SensoryAspect): string => {
        const map: Record<SensoryAspect, string> = {
            sounds: '🔊 Звуки',
            smells: '👃 Запахи',
            tactile: '✋ Прикосновения',
            taste: '👅 Вкус',
            pain: '⚡ Боль',
        };
        return map[sensation] || sensation;
    };

    const getRelationLabel = (type?: RelatedDreamRef['relationType']): string => {
        if (!type) return '';
        const map: Record<NonNullable<RelatedDreamRef['relationType']>, string> = {
            continuation: 'Продолжение',
            prequel: 'Предыстория',
            similar_theme: 'Похожая тема',
            same_location: 'Та же локация',
            reference: 'Упоминание',
        };
        return map[type] || type;
    };

    // Навигация и действия
    const goToEdit = () => {
        router.push(`/dream/${props.id}/edit`);
    };

    const handleDelete = async () => {
        if (confirm('Удалить эту запись сна?')) {
            const targetDate = dream.value?.date;
            const success = await sleepStore.deleteDream(Number(props.id));
            if (success) {
                router.push(targetDate ? `/day/${targetDate}` : '/');
            }
        }
    };

    const goBack = () => {
        router.back();
    };

    onMounted(async () => {
        await sleepStore.init();
    });
</script>
