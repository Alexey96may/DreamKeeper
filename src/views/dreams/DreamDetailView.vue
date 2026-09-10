<template>
    <main
        class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen pb-12"
        aria-label="Детальный просмотр сна"
    >
        <div class="container mx-auto max-w-3xl px-4 py-6">
            <!-- Верхняя навигация -->
            <div class="mb-4 flex items-center justify-between">
                <AppButton @click="goBack" size="xs" variant="back" :icon-left="MoveLeft">
                    Назад
                </AppButton>

                <!-- Статусные бейджи сна -->
                <div v-if="dream" class="flex items-center gap-2">
                    <AppTag
                        @click="filterStore.toggleBooleanFilter('isFavorite')"
                        :is-pressed="filterStore.filters.isFavorite"
                        :is-in-filter="filterStore.filters.isActive"
                        v-if="dream.isFavorite"
                    >
                        Любимый сон
                    </AppTag>
                    <AppTag
                        @click="filterStore.toggleBooleanFilter('isPinned')"
                        :is-pressed="filterStore.filters.isPinned"
                        :is-in-filter="filterStore.filters.isActive"
                        v-if="dream.isPinned"
                    >
                        Закрепленный сон
                    </AppTag>
                    <AppTag
                        @click="filterStore.toggleBooleanFilter('isDeleted')"
                        :is-pressed="filterStore.filters.isDeleted"
                        :is-in-filter="filterStore.filters.isActive"
                        v-if="dream.isDeleted"
                    >
                        Удаленный сон
                    </AppTag>
                    <AppTag
                        @click="filterStore.toggleBooleanFilter('isDraft')"
                        :is-pressed="filterStore.filters.isDraft"
                        :is-in-filter="filterStore.filters.isActive"
                        v-if="dream.isDraft"
                    >
                        Черновик
                    </AppTag>
                    <AppTag
                        @click="filterStore.toggleBooleanFilter('isArchived')"
                        :is-pressed="filterStore.filters.isArchived"
                        :is-in-filter="filterStore.filters.isActive"
                        v-if="dream.isArchived"
                    >
                        В архиве
                    </AppTag>
                    <AppTag
                        @click="filterStore.toggleBooleanFilter('isPrivate')"
                        :is-pressed="filterStore.filters.isPrivate"
                        :is-in-filter="filterStore.filters.isActive"
                        v-if="dream.isPrivate"
                    >
                        <Lock class="inline" /> Приватный
                    </AppTag>
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
                        <div class="flex items-center justify-between gap-2">
                            <CalendarDays />
                            <AppSmartTime :date="dream.date" :date-format="'do MMMM yyyy'" />
                        </div>

                        <div class="flex items-center gap-2 text-lg">
                            <span v-if="dream.isFavorite" title="В избранном"><Star /></span>
                            <span v-if="dream.isPinned" title="Закреплено"><Pin /></span>

                            <AppTag
                                v-if="dream.timeOfDay"
                                @click="filterStore.toggleArrayFilter('timeOfDay', dream.timeOfDay)"
                                :is-in-filter="filterStore.filters.isActive"
                                :is-pressed="
                                    filterStore.filters.timeOfDay.includes(dream.timeOfDay)
                                "
                            >
                                {{ TIME_OF_DAY_MAP[dream.timeOfDay].label }}
                            </AppTag>
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
                        <div v-for="cat in dream.categories" :key="cat">
                            <AppTag
                                @click="filterStore.toggleArrayFilter('categories', cat)"
                                :is-in-filter="filterStore.filters.isActive"
                                :is-pressed="filterStore.filters.categories.includes(cat)"
                            >
                                {{ DREAM_CATEGORY_MAP[cat || ''].label }}
                            </AppTag>
                        </div>
                    </div>
                </header>

                <!-- 2. Оценки (Качество, Ясность, Настроение после) -->
                <section
                    v-if="hasRatings"
                    class="bg-bg-secondary/40 border-border/40 rounded-xl border p-4"
                    aria-label="Оценки сна"
                >
                    <div class="grid grid-cols-3 gap-2 text-center">
                        <AppRating
                            v-if="dream.quality !== undefined && dream.quality > 0"
                            label="Качество"
                            :value="dream.quality"
                            :is-in-filter="filterStore.filters.isActive"
                            @filter="filterStore.toggleNumberFilter('minQuality', dream.quality)"
                            :isFiltering="filterStore.filters.minQuality === dream.quality"
                        />

                        <AppRating
                            v-if="dream.clarity !== undefined && dream.clarity > 0"
                            label="Ясность"
                            :value="dream.clarity"
                            :is-in-filter="filterStore.filters.isActive"
                            @filter="filterStore.toggleNumberFilter('minClarity', dream.clarity)"
                            :is-filtering="filterStore.filters.minClarity === dream.clarity"
                        />

                        <AppRating
                            v-if="dream.moodAfter !== undefined && dream.moodAfter > 0"
                            label="Настроение после"
                            :value="dream.moodAfter"
                            :is-in-filter="filterStore.filters.isActive"
                            @filter="
                                filterStore.toggleNumberFilter('minMoodAfter', dream.moodAfter)
                            "
                            :is-filtering="filterStore.filters.minMoodAfter === dream.moodAfter"
                        />
                    </div>
                </section>

                <!-- 3. Контекст перед сном -->
                <section
                    v-if="preSleepContextText"
                    class="rounded-r-lg border-l-4 border-amber-500/50 bg-amber-500/5 p-3.5"
                >
                    <h2 class="text-xs font-bold tracking-wider text-amber-500 uppercase">
                        <ArrowBigLeftDash /> Перед сном
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

                    <DreamCategoryDetailsCard
                        v-if="dream.categoryDetails?.lucid"
                        type="lucid"
                        key="lucid"
                        :details="dream.categoryDetails.lucid"
                    />

                    <DreamCategoryDetailsCard
                        v-if="dream.categoryDetails?.nightmare"
                        type="nightmare"
                        key="nightmare"
                        :details="dream.categoryDetails.nightmare"
                    />

                    <DreamCategoryDetailsCard
                        v-if="dream.categoryDetails?.prophetic"
                        type="prophetic"
                        key="prophetic"
                        :details="dream.categoryDetails.prophetic"
                    />
                </section>

                <!-- 6. Особые явления (Phenomena) и их детали -->
                <section v-if="dream.phenomena?.length" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Феномены и особые события
                    </h2>

                    <div class="flex flex-wrap gap-2">
                        <AppTag
                            v-for="item in dream.phenomena"
                            :key="item"
                            @click="filterStore.toggleArrayFilter('events', item)"
                            :is-in-filter="filterStore.filters.isActive"
                            :is-pressed="filterStore.filters.events.includes(item)"
                        >
                            {{ DREAM_PHENOMENON_MAP[item || ''].label }}
                        </AppTag>
                    </div>

                    <!-- Детали феноменов -->
                    <div
                        v-if="dream.phenomenaDetails"
                        class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2"
                    >
                        <!-- Сонный паралич -->
                        <div
                            v-if="dream.phenomenaDetails.paralysis"
                            class="rounded-lg p-3 transition-colors"
                            :class="
                                filterStore.filters.events.includes('paralysis')
                                    ? 'bg-bg-primary/60'
                                    : 'bg-bg-secondary/70'
                            "
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                ><component :is="DREAM_PHENOMENON_MAP['paralysis'].icon" />
                                {{ DREAM_PHENOMENON_MAP['paralysis'].label }}</span
                            >
                            <p
                                v-if="dream.phenomenaDetails.paralysis.timing"
                                class="text-text-mute"
                            >
                                Время:
                                {{
                                    PARALYSIS_TIMING_MAP[dream.phenomenaDetails.paralysis.timing]
                                        .label
                                }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.paralysis.hallucinations?.length"
                                class="text-text-mute mt-1"
                            >
                                Галлюцинации:
                                {{
                                    dream.phenomenaDetails.paralysis.hallucinations
                                        .map((e) => PARALYSIS_HALLUCINATIONS_MAP[e].label)
                                        .join(', ')
                                }}
                            </p>
                        </div>

                        <!-- Ложное пробуждение -->
                        <div
                            v-if="dream.phenomenaDetails.nestedDream"
                            class="rounded-lg p-3"
                            :class="
                                filterStore.filters.events.includes('nested_dream')
                                    ? 'bg-bg-primary/60'
                                    : 'bg-bg-secondary/70'
                            "
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                ><component :is="DREAM_PHENOMENON_MAP['nested_dream'].icon" />{{
                                    DREAM_PHENOMENON_MAP['nested_dream'].label
                                }}</span
                            >
                            <p class="text-text-mute">
                                Уровней вложенности:
                                {{ dream.phenomenaDetails.nestedDream.nestingLevels ?? 1 }}
                            </p>
                        </div>

                        <!-- Смерть -->
                        <div
                            v-if="dream.phenomenaDetails.death"
                            class="rounded-lg p-3"
                            :class="
                                filterStore.filters.events.includes('death')
                                    ? 'bg-bg-primary/60'
                                    : 'bg-bg-secondary/70'
                            "
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                ><component :is="DREAM_PHENOMENON_MAP['death'].icon" />
                                {{ DREAM_PHENOMENON_MAP['death'].label }}</span
                            >
                            <p v-if="dream.phenomenaDetails.death.cause" class="text-text-mute">
                                Причина:
                                {{ DEATH_CAUSE_MAP[dream.phenomenaDetails.death.cause].label }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.death.aftermath"
                                class="text-text-mute mt-0.5"
                            >
                                После смерти:
                                {{
                                    DEATH_AFTERMATH_MAP[dream.phenomenaDetails.death.aftermath]
                                        .label
                                }}
                            </p>
                        </div>

                        <!-- Полёт -->
                        <div
                            v-if="dream.phenomenaDetails.flying"
                            class="rounded-lg p-3"
                            :class="
                                filterStore.filters.events.includes('flying')
                                    ? 'bg-bg-primary/60'
                                    : 'bg-bg-secondary/70'
                            "
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                ><component :is="DREAM_PHENOMENON_MAP['flying'].icon" />
                                {{ DREAM_PHENOMENON_MAP['flying'].label }}</span
                            >
                            <p v-if="dream.phenomenaDetails.flying.type" class="text-text-mute">
                                Стиль:
                                {{ FLYING_TYPE_MAP[dream.phenomenaDetails.flying.type].label }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.flying.altitude"
                                class="text-text-mute mt-0.5"
                            >
                                Высота:
                                {{
                                    FLYING_ALTITUDE_MAP[dream.phenomenaDetails.flying.altitude]
                                        .label
                                }}
                            </p>
                        </div>

                        <!-- Падение -->
                        <div
                            v-if="dream.phenomenaDetails.falling"
                            class="rounded-lg p-3"
                            :class="
                                filterStore.filters.events.includes('falling')
                                    ? 'bg-bg-primary/60'
                                    : 'bg-bg-secondary/70'
                            "
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                ><component :is="DREAM_PHENOMENON_MAP['falling'].icon" />
                                {{ DREAM_PHENOMENON_MAP['falling'].label }}</span
                            >
                            <p v-if="dream.phenomenaDetails.falling.origin" class="text-text-mute">
                                Откуда:
                                {{
                                    FALLING_ORIGIN_MAP[dream.phenomenaDetails.falling.origin].label
                                }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.falling.outcome"
                                class="text-text-mute mt-0.5"
                            >
                                Итог:
                                {{
                                    FALLING_OUTCOME_MAP[dream.phenomenaDetails.falling.outcome]
                                        .label
                                }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 7. Восприятие и Стиль (Визуал, Перспектива, Роли, Ощущения) -->
                <section v-if="hasPerceptionDetails" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Восприятие
                    </h2>

                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2" v-if="dream.visualStyle">
                            <h3>Визуальный стиль:</h3>

                            <AppTag
                                :is-in-filter="filterStore.filters.isActive"
                                @click="
                                    filterStore.toggleArrayFilter('visualStyle', dream.visualStyle)
                                "
                                :is-pressed="
                                    filterStore.filters.visualStyle.includes(dream.visualStyle)
                                "
                            >
                                {{ VISUAL_STYLE_MAP[dream.visualStyle].label }}
                            </AppTag>
                        </div>

                        <div class="flex items-center gap-2" v-if="dream.perspective">
                            <h3>Лицо:</h3>

                            <AppTag
                                :is-in-filter="filterStore.filters.isActive"
                                @click="
                                    filterStore.toggleArrayFilter('perspective', dream.perspective)
                                "
                                :is-pressed="
                                    filterStore.filters.perspective.includes(dream.perspective)
                                "
                            >
                                {{ PERSPECTIVE_MAP[dream.perspective].label }}
                            </AppTag>
                        </div>
                    </div>

                    <!-- Роли -->
                    <div v-if="dream.roles?.length" class="space-y-1">
                        <span class="text-text-mute text-xs">Роль в сюжетe:</span>
                        <div class="flex flex-wrap gap-1.5">
                            <AppTag
                                v-for="role in dream.roles"
                                :key="role"
                                :is-in-filter="filterStore.filters.isActive"
                                @click="filterStore.toggleArrayFilter('roles', role)"
                                :is-pressed="filterStore.filters.roles.includes(role)"
                            >
                                {{ PARTICIPANT_ROLE_MAP[role].label }}
                            </AppTag>
                        </div>
                    </div>

                    <!-- Органы чувств -->
                    <div v-if="dream.sensations?.length" class="space-y-1">
                        <span class="text-text-mute text-xs">Сенсорные ощущения:</span>
                        <div class="flex flex-wrap gap-1.5">
                            <AppTag
                                v-for="sensation in dream.sensations"
                                :key="sensation"
                                :is-in-filter="filterStore.filters.isActive"
                                @click="filterStore.toggleArrayFilter('sensations', sensation)"
                                :is-pressed="filterStore.filters.sensations.includes(sensation)"
                            >
                                {{ SENSORY_ASPECT_MAP[sensation].label }}
                            </AppTag>
                        </div>
                    </div>
                </section>

                <!-- 8. Аналитика (Персонажи, Локации, Предметы, Эмоции) -->
                <section v-if="hasAnalytics" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Аналитические элементы
                    </h2>
                    <div
                        v-if="analiticElements.length"
                        class="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        <div v-for="element in analiticElements" :key="element.id">
                            <DreamElementsCard
                                @pick-up="toggleAnaliticsFilter"
                                :tags-arr="filterStore.filters[element.id] || null"
                                :element="element"
                            />
                        </div>
                    </div>
                </section>

                <!-- 9. Интерпретация / Сонник -->
                <section v-if="interpretationsWithSource.length" class="space-y-2">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Интерпретации
                    </h2>

                    <DreamInterpretationCard
                        v-for="interp in interpretationsWithSource"
                        :key="interp.interpretationId"
                        :interpretation="interp"
                    />
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

                    <DreamRelatedCard v-for="rel in relatedDreams" :key="rel.id" :relation="rel" />
                </section>

                <!-- Метаданные создания / редактирования -->
                <footer class="border-border/30 text-text-mute space-y-1 border-t pt-4 text-[11px]">
                    <p v-if="dream.createdAt">
                        <span class="font-medium">Создано: </span>
                        <AppSmartTime :date="dream.createdAt" />
                    </p>
                    <p v-if="dream.updatedAt">
                        <span class="font-medium">Изменено: </span>
                        <AppSmartTime :date="dream.updatedAt" />
                    </p>
                </footer>

                <!-- Кнопки управления -->
                <div class="border-border/50 mt-6 flex items-center justify-between border-t pt-4">
                    <AppButton
                        @click="handleDelete(dream.id, dream.date)"
                        size="xs"
                        variant="danger"
                        :disabled="isDeleting(dream.id)"
                    >
                        Удалить
                    </AppButton>

                    <AppButton
                        @click="goToEdit(slug)"
                        size="xs"
                        variant="primary"
                        :disabled="isDeleting(dream.id)"
                    >
                        Редактировать
                    </AppButton>
                </div>
            </article>

            <!-- Пустое состояние -->
            <div v-else role="status" aria-live="polite" class="dream-card p-8 text-center">
                <p class="text-text-mute">Сон не найден</p>
            </div>

            <DreamFilterApplyBar :dream-slug="slug" />
        </div>
    </main>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useDreamFilterStore } from '@/stores/modules/dreamFilter';
    import { CalendarDays, Star, Pin, Lock, MoveLeft, ArrowBigLeftDash } from 'lucide-vue-next';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppTag from '@/components/ui/AppTag.vue';
    import DreamInterpretationCard from '@/components/cards/DreamInterpretationCard.vue';
    import DreamRelatedCard from '@/components/cards/DreamRelatedCard.vue';
    import DreamElementsCard from '@/components/cards/DreamElementsCard.vue';
    import DreamCategoryDetailsCard from '@/components/cards/DreamCategoryDetailsCard.vue';
    import AppRating from '@/components/ui/AppRating.vue';
    import { useCrud } from '@/composables/crud';
    import AppSmartTime from '@/components/ui/AppSmartTime.vue';
    import DreamFilterApplyBar from '@/components/sections/DreamFilterApplyBar.vue';
    import { useNavigation } from '@/composables/routing/useNavigation';
    import { useInterpretationSourceStore } from '@/stores/modules/useInterpretationSourceStore';
    import type { DreamElementsObject, AnaliticsIds } from '@/types/Dream';

    import {
        TIME_OF_DAY_MAP,
        DREAM_CATEGORY_MAP,
        DREAM_PHENOMENON_MAP,
        DEATH_CAUSE_MAP,
        DEATH_AFTERMATH_MAP,
        FLYING_TYPE_MAP,
        FLYING_ALTITUDE_MAP,
        FALLING_ORIGIN_MAP,
        FALLING_OUTCOME_MAP,
        PARALYSIS_TIMING_MAP,
        PARALYSIS_HALLUCINATIONS_MAP,
        VISUAL_STYLE_MAP,
        PERSPECTIVE_MAP,
        PARTICIPANT_ROLE_MAP,
        SENSORY_ASPECT_MAP,
    } from '@/constants/Dream';

    const props = defineProps<{
        slug: string;
    }>();

    const sleepStore = useSleepStore();
    const sourceStore = useInterpretationSourceStore();
    const filterStore = useDreamFilterStore();

    // Переключение фильтра по клику на тег
    const toggleAnaliticsFilter = (id: AnaliticsIds, tag: string) => {
        filterStore.toggleArrayFilter(id, tag);
    };

    const { handleDelete, isDeleting } = useCrud();

    const { goToEdit, goBack } = useNavigation();

    // Преобразуем строковый route param в number согласно интерфейсу Dream
    const dream = computed(() => {
        if (!props.slug) return null;
        return sleepStore.sleeps.find((s) => s.slug === props.slug) || null;
    });

    // Обработка PreSleepContext (с учётом PascalCase из интерфейса)
    const preSleepContextText = computed(() => {
        if (!dream.value) return '';
        return dream.value.preSleepContext || '';
    });

    // Наличие различных блоков
    const hasRatings = computed(() => {
        if (!dream.value) return false;
        return (
            (dream.value.quality !== undefined && dream.value.quality > 0) ||
            (dream.value.clarity !== undefined && dream.value.clarity > 0) ||
            (dream.value.moodAfter !== undefined && dream.value.moodAfter > 0)
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

    const relatedDreams = computed(() => {
        if (!dream.value?.relatedDreams?.length) return [];

        return dream.value.relatedDreams
            .map((rel) => {
                if (!rel.dreamId) return null;

                const dreamInStore = sleepStore.getDreamById(rel.dreamId);
                if (!dreamInStore) return null;

                return {
                    ...dreamInStore,
                    note: rel.note ?? '',
                    relationType: rel.relationType ?? null,
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    });

    const interpretationsWithSource = computed(() => {
        // Проверяем, есть ли вообще массив интерпретаций у сна
        if (!dream.value?.interpretations?.length) return [];

        return dream.value.interpretations
            .map((item) => {
                const sourceId = item.sourceId;
                if (!Number.isInteger(sourceId)) return null;

                const sourceInStore = sourceStore.getSourceById(sourceId);
                if (!sourceInStore) return null;

                return {
                    ...item,
                    source: sourceInStore,
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    });

    const analiticElements = computed(() => {
        const analiticArray: DreamElementsObject[] = [];

        if (dream.value?.characters?.length) {
            const analiticObj: DreamElementsObject = {
                id: 'characters',
                title: 'Персонажи:',
                tags: dream.value.characters,
            };
            analiticArray.push(analiticObj);
        }

        if (dream.value?.locations?.length) {
            const analiticObj: DreamElementsObject = {
                id: 'locations',
                title: 'Локации:',
                tags: dream.value.locations,
            };
            analiticArray.push(analiticObj);
        }

        if (dream.value?.objects?.length) {
            const analiticObj: DreamElementsObject = {
                id: 'objects',
                title: 'Предметы:',
                tags: dream.value.objects,
            };
            analiticArray.push(analiticObj);
        }

        if (dream.value?.emotions?.length) {
            const analiticObj: DreamElementsObject = {
                id: 'emotions',
                title: 'Эмоции:',
                tags: dream.value.emotions,
            };
            analiticArray.push(analiticObj);
        }

        return analiticArray;
    });

    onMounted(() => {
        if (sourceStore.sources.length === 0) {
            sourceStore.init();
        }
    });
</script>
