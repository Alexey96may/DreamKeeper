<template>
    <main
        class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen pb-12"
        aria-label="Детальный просмотр сна"
    >
        <div class="container mx-auto max-w-3xl px-4 py-6">
            <!-- Верхняя навигация -->
            <div class="mb-4 flex items-center justify-between">
                <button
                    @click="goBack"
                    type="button"
                    aria-label="Вернуться назад"
                    class="text-text-mute hover:text-text-primary focus-visible:outline-accent flex cursor-pointer items-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2"
                >
                    <span aria-hidden="true">←</span> Назад
                </button>

                <!-- Статусные бейджи сна -->
                <div v-if="dream" class="flex items-center gap-2">
                    <span
                        v-if="dream.isDraft"
                        class="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500"
                    >
                        Черновик
                    </span>
                    <span
                        v-if="dream.isArchived"
                        class="rounded border border-gray-500/20 bg-gray-500/10 px-2 py-0.5 text-xs font-semibold text-gray-400"
                    >
                        В архиве
                    </span>
                    <span
                        v-if="dream.isPrivate"
                        class="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-400"
                        title="Приватный сон"
                    >
                        🔒 Приватный
                    </span>
                </div>
            </div>

            <!-- Индикатор загрузки -->
            <div
                v-if="sleepStore.loading && !dream"
                role="status"
                aria-live="polite"
                class="dream-card text-text-mute p-8 text-center"
            >
                Загрузка данных о сне...
            </div>

            <!-- Карточка сна -->
            <article
                v-else-if="dream"
                class="dream-card space-y-6 p-6 sm:p-8"
                aria-labelledby="dream-title"
            >
                <!-- 1. Шапка: Заголовок, дата, время суток и флаги (избранное/закреплено) -->
                <header class="border-border/50 border-b pb-5">
                    <div class="flex items-center justify-between gap-2">
                        <time :datetime="dream.date" class="text-text-mute text-sm font-medium">
                            📅 {{ formattedDate }}
                        </time>

                        <div class="flex items-center gap-2 text-lg">
                            <span v-if="dream.isFavorite" title="В избранном">⭐</span>
                            <span v-if="dream.isPinned" title="Закреплено">📌</span>
                            <span
                                v-if="dream.timeOfDay"
                                class="bg-bg-secondary text-text-soft rounded-full px-3 py-0.5 text-xs font-medium"
                            >
                                {{ getTimeOfDayLabel(dream.timeOfDay) }}
                            </span>
                        </div>
                    </div>

                    <h1
                        id="dream-title"
                        class="text-text-primary mt-3 text-2xl font-bold sm:text-3xl"
                    >
                        {{ dream.title }}
                    </h1>

                    <!-- Основные категории -->
                    <div
                        v-if="dream.categories?.length"
                        class="mt-3 flex flex-wrap gap-2"
                        aria-label="Категории сна"
                    >
                        <span
                            v-for="cat in dream.categories"
                            :key="cat"
                            class="bg-accent/15 text-accent border-accent/20 rounded-md border px-2.5 py-1 text-xs font-semibold"
                        >
                            {{ getCategoryLabel(cat) }}
                        </span>
                    </div>
                </header>

                <!-- 2. Оценки (Качество, Ясность, Настроение после) -->
                <section
                    v-if="hasRatings"
                    class="bg-bg-secondary/40 border-border/40 rounded-xl border p-4"
                    aria-label="Оценки сна"
                >
                    <div class="grid grid-cols-3 gap-2 text-center">
                        <div v-if="dream.quality !== undefined">
                            <span class="text-text-mute block text-xs">Качество</span>
                            <span class="text-text-primary text-lg font-bold">
                                {{ dream.quality }}/10
                            </span>
                        </div>

                        <div v-if="dream.clarity !== undefined">
                            <span class="text-text-mute block text-xs">Ясность</span>
                            <span class="text-text-primary text-lg font-bold">
                                {{ dream.clarity }}/10
                            </span>
                        </div>

                        <div v-if="dream.moodAfter !== undefined">
                            <span class="text-text-mute block text-xs">Настроение после</span>
                            <span class="text-text-primary text-lg font-bold">
                                {{ dream.moodAfter }}/10
                            </span>
                        </div>
                    </div>
                </section>

                <!-- 3. Контекст перед сном -->
                <section
                    v-if="preSleepContextText"
                    class="rounded-r-lg border-l-4 border-amber-500/50 bg-amber-500/5 p-3.5"
                >
                    <h2 class="text-xs font-bold tracking-wider text-amber-500 uppercase">
                        🌙 Перед сном
                    </h2>
                    <p class="text-text-primary mt-1 text-sm leading-relaxed italic">
                        {{ preSleepContextText }}
                    </p>
                </section>

                <!-- 4. Основное описание сна -->
                <section v-if="dream.description">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Описание
                    </h2>
                    <p class="text-text-primary mt-2 text-base leading-relaxed whitespace-pre-line">
                        {{ dream.description }}
                    </p>
                </section>

                <!-- 5. Детали категорий (Lucid, Nightmare, Prophetic) -->
                <section v-if="hasCategoryDetails" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Детали категорий
                    </h2>

                    <!-- Осознанный сон -->
                    <div
                        v-if="dream.categoryDetails?.lucid"
                        class="bg-bg-secondary/30 border-border/30 space-y-1.5 rounded-lg border p-3.5 text-xs"
                    >
                        <div class="text-accent font-bold">🧠 Осознанный сон</div>
                        <div v-if="dream.categoryDetails.lucid.controlLevel !== undefined">
                            <span class="text-text-mute">Уровень контроля:</span>
                            <span class="text-text-primary ml-1 font-semibold">
                                {{ dream.categoryDetails.lucid.controlLevel }}/10
                            </span>
                        </div>
                        <div v-if="dream.categoryDetails.lucid.trigger">
                            <span class="text-text-mute">Триггер осознания:</span>
                            <span class="text-text-primary ml-1 font-medium">
                                {{ getLucidTriggerLabel(dream.categoryDetails.lucid.trigger) }}
                            </span>
                        </div>
                    </div>

                    <!-- Кошмар -->
                    <div
                        v-if="dream.categoryDetails?.nightmare"
                        class="space-y-1.5 rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-xs"
                    >
                        <div class="font-bold text-red-400">😱 Кошмар</div>
                        <div v-if="dream.categoryDetails.nightmare.fearLevel !== undefined">
                            <span class="text-text-mute">Уровень страха:</span>
                            <span class="text-text-primary ml-1 font-semibold">
                                {{ dream.categoryDetails.nightmare.fearLevel }}/10
                            </span>
                        </div>
                        <div v-if="dream.categoryDetails.nightmare.copingMechanism">
                            <span class="text-text-mute">Как справился:</span>
                            <p class="text-text-primary mt-0.5">
                                {{ dream.categoryDetails.nightmare.copingMechanism }}
                            </p>
                        </div>
                        <div
                            v-if="dream.categoryDetails.nightmare.hasPhysicalResponse !== undefined"
                        >
                            <span class="text-text-mute">Физическая реакция:</span>
                            <span class="text-text-primary ml-1 font-medium">
                                {{
                                    dream.categoryDetails.nightmare.hasPhysicalResponse
                                        ? 'Да'
                                        : 'Нет'
                                }}
                            </span>
                        </div>
                    </div>

                    <!-- Вещий сон -->
                    <div
                        v-if="dream.categoryDetails?.prophetic"
                        class="space-y-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs"
                    >
                        <div class="font-bold text-indigo-400">🔮 Вещий сон</div>
                        <div v-if="dream.categoryDetails.prophetic.isFulfilled !== undefined">
                            <span class="text-text-mute">Статус:</span>
                            <span
                                :class="
                                    dream.categoryDetails.prophetic.isFulfilled
                                        ? 'text-emerald-400'
                                        : 'text-amber-400'
                                "
                                class="ml-1 font-bold"
                            >
                                {{
                                    dream.categoryDetails.prophetic.isFulfilled
                                        ? 'Сбылся'
                                        : 'Ожидает исполнения'
                                }}
                            </span>
                        </div>
                        <div v-if="dream.categoryDetails.prophetic.expectedByDate">
                            <span class="text-text-mute">Ожидался до:</span>
                            <span class="text-text-primary ml-1 font-medium">
                                {{ formatDate(dream.categoryDetails.prophetic.expectedByDate) }}
                            </span>
                        </div>
                        <div v-if="dream.categoryDetails.prophetic.fulfilledDate">
                            <span class="text-text-mute">Сбылся:</span>
                            <span class="text-text-primary ml-1 font-medium">
                                {{ formatDate(dream.categoryDetails.prophetic.fulfilledDate) }}
                            </span>
                        </div>
                        <div v-if="dream.categoryDetails.prophetic.fulfillmentNotes">
                            <span class="text-text-mute">Что произошло:</span>
                            <p class="text-text-primary mt-0.5">
                                {{ dream.categoryDetails.prophetic.fulfillmentNotes }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 6. Особые явления (Phenomena) и их детали -->
                <section v-if="dream.phenomena?.length" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Феномены и особые события
                    </h2>

                    <div class="flex flex-wrap gap-2">
                        <span
                            v-for="item in dream.phenomena"
                            :key="item"
                            class="bg-bg-secondary text-text-primary rounded-md px-2.5 py-1 text-xs font-medium"
                        >
                            {{ getPhenomenonLabel(item) }}
                        </span>
                    </div>

                    <!-- Детали феноменов -->
                    <div
                        v-if="dream.phenomenaDetails"
                        class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2"
                    >
                        <!-- Сонный паралич -->
                        <div
                            v-if="dream.phenomenaDetails.paralysis"
                            class="bg-bg-secondary/30 rounded-lg p-3"
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                >💤 Сонный паралич</span
                            >
                            <p
                                v-if="dream.phenomenaDetails.paralysis.timing"
                                class="text-text-mute"
                            >
                                Время:
                                {{
                                    dream.phenomenaDetails.paralysis.timing === 'falling_asleep'
                                        ? 'При засыпании'
                                        : 'При пробуждении'
                                }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.paralysis.hallucinations?.length"
                                class="text-text-mute mt-1"
                            >
                                Галлюцинации:
                                {{
                                    dream.phenomenaDetails.paralysis.hallucinations
                                        .map(getHallucinationLabel)
                                        .join(', ')
                                }}
                            </p>
                        </div>

                        <!-- Ложное пробуждение -->
                        <div
                            v-if="dream.phenomenaDetails.nestedDream"
                            class="bg-bg-secondary/30 rounded-lg p-3"
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                >🔄 Ложное пробуждение</span
                            >
                            <p class="text-text-mute">
                                Уровней вложенности:
                                {{ dream.phenomenaDetails.nestedDream.nestingLevels ?? 1 }}
                            </p>
                        </div>

                        <!-- Смерть -->
                        <div
                            v-if="dream.phenomenaDetails.death"
                            class="bg-bg-secondary/30 rounded-lg p-3"
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                >💀 Смерть во сне</span
                            >
                            <p v-if="dream.phenomenaDetails.death.cause" class="text-text-mute">
                                Причина:
                                {{ getDeathCauseLabel(dream.phenomenaDetails.death.cause) }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.death.aftermath"
                                class="text-text-mute mt-0.5"
                            >
                                После смерти:
                                {{ getDeathAftermathLabel(dream.phenomenaDetails.death.aftermath) }}
                            </p>
                        </div>

                        <!-- Полёт -->
                        <div
                            v-if="dream.phenomenaDetails.flying"
                            class="bg-bg-secondary/30 rounded-lg p-3"
                        >
                            <span class="text-text-primary mb-1 block font-bold">🕊️ Полёт</span>
                            <p v-if="dream.phenomenaDetails.flying.type" class="text-text-mute">
                                Стиль: {{ getFlyingTypeLabel(dream.phenomenaDetails.flying.type) }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.flying.altitude"
                                class="text-text-mute mt-0.5"
                            >
                                Высота:
                                {{ getAltitudeLabel(dream.phenomenaDetails.flying.altitude) }}
                            </p>
                        </div>

                        <!-- Падение -->
                        <div
                            v-if="dream.phenomenaDetails.falling"
                            class="bg-bg-secondary/30 rounded-lg p-3"
                        >
                            <span class="text-text-primary mb-1 block font-bold">🕳️ Падение</span>
                            <p v-if="dream.phenomenaDetails.falling.origin" class="text-text-mute">
                                Откуда:
                                {{ getFallingOriginLabel(dream.phenomenaDetails.falling.origin) }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.falling.outcome"
                                class="text-text-mute mt-0.5"
                            >
                                Итог:
                                {{ getFallingOutcomeLabel(dream.phenomenaDetails.falling.outcome) }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 7. Восприятие и Стиль (Визуал, Перспектива, Роли, Ощущения) -->
                <section v-if="hasPerceptionDetails" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Восприятие и восприятие
                    </h2>

                    <div class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                        <div v-if="dream.visualStyle" class="bg-bg-secondary/30 rounded-lg p-2.5">
                            <span class="text-text-mute">Визуальный стиль:</span>
                            <span class="text-text-primary ml-1 font-semibold">
                                {{ getVisualStyleLabel(dream.visualStyle) }}
                            </span>
                        </div>

                        <div v-if="dream.perspective" class="bg-bg-secondary/30 rounded-lg p-2.5">
                            <span class="text-text-mute">Перспектива:</span>
                            <span class="text-text-primary ml-1 font-semibold">
                                {{ getPerspectiveLabel(dream.perspective) }}
                            </span>
                        </div>
                    </div>

                    <!-- Роли -->
                    <div v-if="dream.roles?.length" class="space-y-1">
                        <span class="text-text-mute text-xs">Роль в сюжетe:</span>
                        <div class="flex flex-wrap gap-1.5">
                            <span
                                v-for="role in dream.roles"
                                :key="role"
                                class="bg-bg-secondary text-text-primary rounded px-2 py-0.5 text-xs font-medium"
                            >
                                {{ getRoleLabel(role) }}
                            </span>
                        </div>
                    </div>

                    <!-- Органы чувств -->
                    <div v-if="dream.sensations?.length" class="space-y-1">
                        <span class="text-text-mute text-xs">Сенсорные ощущения:</span>
                        <div class="flex flex-wrap gap-1.5">
                            <span
                                v-for="sensation in dream.sensations"
                                :key="sensation"
                                class="bg-bg-secondary text-text-primary rounded px-2 py-0.5 text-xs"
                            >
                                {{ getSensoryLabel(sensation) }}
                            </span>
                        </div>
                    </div>
                </section>

                <!-- 8. Аналитика (Персонажи, Локации, Предметы, Эмоции) -->
                <section v-if="hasAnalytics" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Аналитические элементы
                    </h2>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div
                            v-if="dream.characters?.length"
                            class="bg-bg-secondary/30 rounded-lg p-3 text-xs"
                        >
                            <span class="text-text-mute mb-1 block font-medium">👥 Персонажи:</span>
                            <p class="text-text-primary font-medium">
                                {{ dream.characters.join(', ') }}
                            </p>
                        </div>

                        <div
                            v-if="dream.locations?.length"
                            class="bg-bg-secondary/30 rounded-lg p-3 text-xs"
                        >
                            <span class="text-text-mute mb-1 block font-medium">📍 Локации:</span>
                            <p class="text-text-primary font-medium">
                                {{ dream.locations.join(', ') }}
                            </p>
                        </div>

                        <div
                            v-if="dream.objects?.length"
                            class="bg-bg-secondary/30 rounded-lg p-3 text-xs"
                        >
                            <span class="text-text-mute mb-1 block font-medium">📦 Предметы:</span>
                            <p class="text-text-primary font-medium">
                                {{ dream.objects.join(', ') }}
                            </p>
                        </div>

                        <div
                            v-if="dream.emotions?.length"
                            class="bg-bg-secondary/30 rounded-lg p-3 text-xs"
                        >
                            <span class="text-text-mute mb-1 block font-medium">🎭 Эмоции:</span>
                            <p class="text-text-primary font-medium">
                                {{ dream.emotions.join(', ') }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 9. Интерпретация / Сонник -->
                <section v-if="dream.interpretations?.length" class="space-y-2">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Интерпретации
                    </h2>
                    <div class="space-y-2">
                        <div
                            v-for="(interp, idx) in dream.interpretations"
                            :key="idx"
                            class="bg-bg-secondary/40 border-border/40 rounded-lg border p-3.5 text-xs"
                        >
                            <div class="flex items-center justify-between">
                                <span class="text-text-primary text-sm font-bold">
                                    🏷️ {{ interp.tag }}
                                </span>
                                <div class="flex items-center gap-2">
                                    <span
                                        v-if="
                                            interp.isAccurate !== undefined &&
                                            interp.isAccurate !== null
                                        "
                                        class="text-[10px]"
                                    >
                                        {{
                                            interp.isAccurate ? '✅ Подтверждено' : '❌ Не совпало'
                                        }}
                                    </span>
                                    <span
                                        class="bg-bg-secondary text-text-mute rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                                    >
                                        {{ interp.sourceId }}
                                    </span>
                                </div>
                            </div>
                            <p class="text-text-mute mt-1.5 leading-relaxed">
                                {{ interp.meaning }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 10. Личные заметки -->
                <section v-if="dream.personalNotes">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Личные заметки
                    </h2>
                    <p
                        class="text-text-primary bg-bg-secondary/30 border-border/30 mt-1.5 rounded-lg border p-3.5 text-xs leading-relaxed italic"
                    >
                        {{ dream.personalNotes }}
                    </p>
                </section>

                <!-- 11. Связанные сны -->
                <section v-if="dream.relatedDreams?.length" class="space-y-2">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Связанные сны
                    </h2>
                    <ul class="space-y-2" role="list">
                        <li v-for="(rel, idx) in dream.relatedDreams" :key="idx">
                            <div
                                class="bg-bg-secondary/40 border-border/40 flex flex-col justify-between gap-1 rounded-lg border p-2.5 text-xs sm:flex-row sm:items-center"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="text-accent font-semibold">
                                        {{ getRelationLabel(rel.relationType) }}
                                    </span>
                                    <router-link
                                        v-if="rel.dreamId"
                                        :to="`/dream/${rel.dreamId}`"
                                        class="text-text-primary font-bold hover:underline"
                                    >
                                        → Сон #{{ rel.dreamId }}
                                    </router-link>
                                </div>
                                <span v-if="rel.note" class="text-text-mute italic">
                                    "{{ rel.note }}"
                                </span>
                            </div>
                        </li>
                    </ul>
                </section>

                <!-- Метаданные создания / редактирования -->
                <footer class="border-border/30 text-text-mute space-y-1 border-t pt-4 text-[11px]">
                    <p v-if="formattedCreatedAt">
                        <span class="font-medium">Создано:</span> {{ formattedCreatedAt }}
                    </p>
                    <p v-if="formattedUpdatedAt">
                        <span class="font-medium">Изменено:</span> {{ formattedUpdatedAt }}
                    </p>
                </footer>

                <!-- Кнопки управления -->
                <div class="border-border/50 mt-6 flex items-center justify-between border-t pt-4">
                    <button
                        @click="handleDelete"
                        type="button"
                        :disabled="sleepStore.loading"
                        class="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 disabled:opacity-50"
                    >
                        Удалить
                    </button>

                    <button
                        @click="goToEdit"
                        type="button"
                        class="bg-accent cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2"
                    >
                        Редактировать
                    </button>
                </div>
            </article>

            <!-- Пустое состояние -->
            <div v-else role="status" aria-live="polite" class="dream-card p-8 text-center">
                <p class="text-text-mute">Сон не найден</p>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/dream';
    import type {
        DreamCategory,
        TimeOfDay,
        SensoryAspect,
        DreamRelationType,
        DreamPhenomenon,
        LucidDetails,
        DeathDetails,
        FlyingDetails,
        FallingDetails,
        VisualStyle,
        Perspective,
        ParticipantRole,
    } from '@/types/Dream';

    const props = defineProps<{
        slug: string;
    }>();

    const router = useRouter();
    const sleepStore = useSleepStore();

    // Преобразуем строковый route param в number согласно интерфейсу Dream
    const dream = computed(() => {
        if (!props.slug) return null;
        return sleepStore.sleeps.find((s) => s.slug === props.slug) || null;
    });

    // Обработка PreSleepContext (с учётом PascalCase из интерфейса)
    const preSleepContextText = computed(() => {
        if (!dream.value) return '';
        return (
            dream.value.PreSleepContext ||
            (dream.value as Record<string, any>).preSleepContext ||
            ''
        );
    });

    // Наличие различных блоков
    const hasRatings = computed(() => {
        if (!dream.value) return false;
        return (
            dream.value.quality !== undefined ||
            dream.value.clarity !== undefined ||
            dream.value.moodAfter !== undefined
        );
    });

    const hasCategoryDetails = computed(() => {
        if (!dream.value?.categoryDetails) return false;
        const d = dream.value.categoryDetails;
        return !!(d.lucid || d.nightmare || d.prophetic);
    });

    const hasPerceptionDetails = computed(() => {
        if (!dream.value) return false;
        return !!(
            dream.value.visualStyle ||
            dream.value.perspective ||
            dream.value.roles?.length ||
            dream.value.sensations?.length
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

    // Даты
    const formatDate = (dateString?: string, options?: Intl.DateTimeFormatOptions) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('ru-RU', options);
    };

    const formattedDate = computed(() =>
        formatDate(dream.value?.date, { day: 'numeric', month: 'long', year: 'numeric' }),
    );

    const formattedCreatedAt = computed(() =>
        formatDate(dream.value?.createdAt, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
    );

    const formattedUpdatedAt = computed(() =>
        formatDate(dream.value?.updatedAt, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
    );

    // Маппинги для справочников

    const getCategoryLabel = (cat: DreamCategory): string => {
        const map: Record<DreamCategory, string> = {
            lucid: 'Осознанный (ОС)',
            nightmare: 'Кошмар',
            prophetic: 'Вещий / Сбывшийся',
        };
        return map[cat] || cat;
    };

    const getTimeOfDayLabel = (time?: TimeOfDay): string => {
        if (!time) return '';
        const map: Record<TimeOfDay, string> = {
            night: 'Ночной',
            morning: 'Утренний',
            day: 'Дневной',
            evening: 'Вечерний',
            unknown: 'Неизвестно',
        };
        return map[time] || time;
    };

    const getLucidTriggerLabel = (trigger: NonNullable<LucidDetails['trigger']>): string => {
        const map: Record<NonNullable<LucidDetails['trigger']>, string> = {
            reality_check: 'Проверка реальности',
            anomaly: 'Замечена аномалия',
            spontaneous: 'Спонтанное осознание',
            other: 'Другое',
        };
        return map[trigger] || trigger;
    };

    const getPhenomenonLabel = (p: DreamPhenomenon): string => {
        const map: Record<DreamPhenomenon, string> = {
            death: '💀 Смерть',
            flying: '🕊️ Полёт',
            falling: '🕳️ Падение',
            nested_dream: '🔄 Ложное пробуждение',
            paralysis: '💤 Сонный паралич',
        };
        return map[p] || p;
    };

    const getHallucinationLabel = (h: 'auditory' | 'visual' | 'tactile' | 'presence'): string => {
        const map = {
            auditory: 'Слуховые',
            visual: 'Зрительные',
            tactile: 'Тактильные',
            presence: 'Ощущение присутствия',
        };
        return map[h] || h;
    };

    const getDeathCauseLabel = (cause: NonNullable<DeathDetails['cause']>): string => {
        const map: Record<NonNullable<DeathDetails['cause']>, string> = {
            fall: 'Падение',
            attack_or_murder: 'Нападение / Убийство',
            disaster: 'Катастрофа',
            execution: 'Казнь',
            peaceful: 'Естественная / Мирная',
            other: 'Другое',
        };
        return map[cause] || cause;
    };

    const getDeathAftermathLabel = (aftermath: NonNullable<DeathDetails['aftermath']>): string => {
        const map: Record<NonNullable<DeathDetails['aftermath']>, string> = {
            woke_up: 'Мгновенно проснулся',
            became_ghost: 'Стал духом / призраком',
            reincarnated: 'Переродился в новом теле',
            black_void: 'Тьма / Тишина',
            scene_shift: 'Сменилась сцена',
        };
        return map[aftermath] || aftermath;
    };

    const getFlyingTypeLabel = (type: NonNullable<FlyingDetails['type']>): string => {
        const map: Record<NonNullable<FlyingDetails['type']>, string> = {
            effortless: 'Легкий / Естественный',
            swimming: 'Гребля (как в воде)',
            apparatus: 'С помощью предмета/транспорта',
            levitation: 'Парение на месте',
            uncontrollable: 'Неконтролируемый',
        };
        return map[type] || type;
    };

    const getAltitudeLabel = (altitude: NonNullable<FlyingDetails['altitude']>): string => {
        const map: Record<NonNullable<FlyingDetails['altitude']>, string> = {
            low: 'Низкая',
            cloud_level: 'На уровне облаков',
            space: 'Космос',
        };
        return map[altitude] || altitude;
    };

    const getFallingOriginLabel = (origin: NonNullable<FallingDetails['origin']>): string => {
        const map: Record<NonNullable<FallingDetails['origin']>, string> = {
            building_or_cliff: 'Здание или обрыв',
            sky_or_void: 'Небо или пустота',
            abyss: 'Бездна',
            stumbling: 'Оступился / Споткнулся',
        };
        return map[origin] || origin;
    };

    const getFallingOutcomeLabel = (outcome: NonNullable<FallingDetails['outcome']>): string => {
        const map: Record<NonNullable<FallingDetails['outcome']>, string> = {
            hypnic_jerk: 'Вздрогнул и проснулся',
            landed_safe: 'Мягко приземлился',
            impact: 'Удар о землю',
            woke_before_impact: 'Проснулся за секунду до удара',
            turned_into_flight: 'Переросло в полёт',
        };
        return map[outcome] || outcome;
    };

    const getVisualStyleLabel = (style: VisualStyle): string => {
        const map: Record<VisualStyle, string> = {
            color: 'Цветной',
            vivid: 'Яркий / Неоновый',
            monochrome: 'Чёрно-белый / Сепия',
            blurred: 'Размытый / Туманный',
            dark: 'Тёмный / Сумеречный',
        };
        return map[style] || style;
    };

    const getPerspectiveLabel = (p: Perspective): string => {
        const map: Record<Perspective, string> = {
            first_person: 'От 1-го лица',
            third_person: 'От 3-го лица',
            shifting: 'Менялась в процессе',
        };
        return map[p] || p;
    };

    const getRoleLabel = (role: ParticipantRole): string => {
        const map: Record<ParticipantRole, string> = {
            protagonist: 'Главный герой',
            observer: 'Наблюдатель',
            victim: 'Жертва / Ведомый',
            shapeshifter: 'Другое существо / Личность',
            camera_operator: 'Оператор / Режиссер',
            disembodied: 'Бестелесный дух',
        };
        return map[role] || role;
    };

    const getSensoryLabel = (sensation: SensoryAspect): string => {
        const map: Record<SensoryAspect, string> = {
            sounds: '🔊 Звуки / Музыка',
            smells: '👃 Запахи',
            tactile: '✋ Прикосновения',
            temperature: '🌡️ Тепло / Холод',
            taste: '👅 Вкус',
            pain: '⚡ Физическая боль',
            kinesthetic: '🌀 Вестибулярные / Вращение',
            breathing: '🫁 Дыхание / Задушье',
            speech_voice: '🗣️ Голос / Речь',
            vision_anomaly: '👁️ Искажения / Аномалии',
        };
        return map[sensation] || sensation;
    };

    const getRelationLabel = (type: DreamRelationType): string => {
        const map: Record<DreamRelationType, string> = {
            recurring_instance: 'Повторяющийся сюжет',
            continuation: 'Прямое продолжение',
            prequel: 'Предыстория',
            similar_theme: 'Похожая тема',
            same_location: 'Та же локация',
            reference: 'Пересечение / Упоминание',
        };
        return map[type] || type;
    };

    // Действия
    const goToEdit = () => {
        if (!props.slug) return;

        router.push(`/dream/${props.slug}/edit`);
    };

    const handleDelete = async () => {
        if (confirm('Удалить эту запись сна?')) {
            const targetDate = dream.value?.date;
            const numericId = Number(props.id);
            const success = await sleepStore.deleteDream(
                isNaN(numericId) ? (props.id as unknown as number) : numericId,
            );
            if (success) {
                router.push(targetDate ? `/day/${targetDate}` : '/');
            }
        }
    };

    const goBack = () => {
        router.back();
    };
</script>
