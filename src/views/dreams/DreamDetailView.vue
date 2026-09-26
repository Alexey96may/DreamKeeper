<template>
    <div
        class="text-text-primary transition-theme duration-theme"
        aria-label="Детальный просмотр сна"
    >
        <div class="container px-4 py-6">
            <AppButton
                @click="goBack()"
                size="xs"
                class="mb-8"
                variant="back"
                :icon-left="MoveLeft"
            >
                Назад
            </AppButton>

            <div
                v-if="sleepStore.loading && !dream"
                role="status"
                aria-live="polite"
                class="dream-card text-text-mute p-6 text-center sm:p-8 sm:pt-10"
            >
                Загрузка данных о сне...
            </div>

            <!-- Карточка сна -->
            <article
                v-else-if="dream"
                class="dream-card relative space-y-8 p-6 pt-8 sm:p-8 sm:pt-10"
                aria-labelledby="dream-title"
            >
                <!-- 1. Шапка: Заголовок, дата, время суток и флаги (избранное/закреплено) -->
                <header
                    class="border-border/50 border-border-muted flex flex-col gap-2 border-b pb-5"
                >
                    <div
                        v-if="dream"
                        class="border-border-muted flex w-full translate-y-[-50%] items-center justify-end gap-2 overflow-auto border-b pb-4"
                    >
                        <AppTag
                            @click="filterStore.toggleBooleanFilter('isFavorite')"
                            :is-pressed="filterStore.filters.isFavorite"
                            :is-in-filter="filterStore.filters.isActive"
                            :icon="Star"
                            v-if="dream.isFavorite"
                        />
                        <AppTag
                            @click="filterStore.toggleBooleanFilter('isPinned')"
                            :is-pressed="filterStore.filters.isPinned"
                            :is-in-filter="filterStore.filters.isActive"
                            :icon="Pin"
                            v-if="dream.isPinned"
                        />
                        <AppTag
                            @click="filterStore.toggleBooleanFilter('isDeleted')"
                            :is-pressed="filterStore.filters.isDeleted"
                            :is-in-filter="filterStore.filters.isActive"
                            :icon="Trash2"
                            v-if="dream.isDeleted"
                        />
                        <AppTag
                            @click="filterStore.toggleBooleanFilter('isDraft')"
                            :is-pressed="filterStore.filters.isDraft"
                            :is-in-filter="filterStore.filters.isActive"
                            :icon="FileEdit"
                            v-if="dream.isDraft"
                        />
                        <AppTag
                            @click="filterStore.toggleBooleanFilter('isArchived')"
                            :is-pressed="filterStore.filters.isArchived"
                            :is-in-filter="filterStore.filters.isActive"
                            :icon="Archive"
                            v-if="dream.isArchived"
                        />
                        <AppTag
                            @click="filterStore.toggleBooleanFilter('isPrivate')"
                            :is-pressed="filterStore.filters.isPrivate"
                            :is-in-filter="filterStore.filters.isActive"
                            :icon="Lock"
                            v-if="dream.isPrivate"
                        />
                    </div>

                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center justify-between gap-2">
                            <CalendarDays />
                            <AppSmartTime :date="dream.date" :date-format="'do MMMM yyyy'" />
                        </div>

                        <div class="flex items-center gap-2 text-lg">
                            <AppTag
                                v-if="dream.timeOfDay"
                                @click="filterStore.toggleArrayFilter('timeOfDay', dream.timeOfDay)"
                                :is-in-filter="filterStore.filters.isActive"
                                :is-pressed="
                                    filterStore.filters.timeOfDay.includes(dream.timeOfDay)
                                "
                                :icon="TIME_OF_DAY_MAP[dream.timeOfDay].icon"
                                :hint="TIME_OF_DAY_MAP[dream.timeOfDay].label"
                            />
                        </div>
                    </div>

                    <h1 id="dream-title" class="text-text-primary mt-3 font-bold">
                        {{ dream.title }}
                    </h1>
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
                    class="border-accent bg-accent/5 flex flex-col gap-2 rounded-r-lg border-l-4 p-3.5"
                >
                    <span
                        class="text-accent flex items-center gap-2 text-xs font-bold tracking-wider"
                    >
                        <ArrowBigLeftDash /><span>Перед сном</span>
                    </span>
                    <p class="text-text-primary text-sm leading-relaxed italic">
                        {{ preSleepContextText }}
                    </p>
                </section>

                <!-- 4. Основное описание сна -->
                <section v-if="dream.description" class="flex flex-col gap-2">
                    <h2
                        class="text-text-primary border-border-muted border-b pb-2 font-semibold tracking-wider"
                    >
                        Описание
                    </h2>
                    <p class="text-text-primary text-base leading-relaxed whitespace-pre-line">
                        {{ dream.description }}
                    </p>
                </section>

                <!-- 5.(Lucid, Nightmare, Prophetic) -->
                <section v-if="hasCategoryDetails" class="flex flex-col gap-4">
                    <h2
                        class="text-text-primary border-border-muted border-b pb-2 font-semibold tracking-wider"
                    >
                        Категории сна
                    </h2>

                    <DreamCategoryDetailsCard
                        v-if="dream.categoryDetails?.lucid"
                        @click="filterStore.toggleArrayFilter('categories', 'lucid')"
                        :is-in-filter="filterStore.filters.isActive"
                        :is-pressed="filterStore.filters.categories.includes('lucid')"
                        type="lucid"
                        key="lucid"
                        :details="dream.categoryDetails.lucid"
                    />

                    <DreamCategoryDetailsCard
                        v-if="dream.categoryDetails?.nightmare"
                        @click="filterStore.toggleArrayFilter('categories', 'nightmare')"
                        :is-in-filter="filterStore.filters.isActive"
                        :is-pressed="filterStore.filters.categories.includes('nightmare')"
                        type="nightmare"
                        key="nightmare"
                        :details="dream.categoryDetails.nightmare"
                    />

                    <DreamCategoryDetailsCard
                        v-if="dream.categoryDetails?.prophetic"
                        @click="filterStore.toggleArrayFilter('categories', 'prophetic')"
                        :is-in-filter="filterStore.filters.isActive"
                        :is-pressed="filterStore.filters.categories.includes('prophetic')"
                        type="prophetic"
                        key="prophetic"
                        :details="dream.categoryDetails.prophetic"
                    />
                </section>

                <!-- 6. Особые явления (Phenomena) и их детали -->
                <section v-if="dream.phenomena?.length" class="flex flex-col gap-4">
                    <h2
                        class="text-text-primary border-border-muted border-b pb-2 font-semibold tracking-wider"
                    >
                        Феномены и особые события
                    </h2>

                    <div
                        v-if="dream.phenomenaDetails"
                        class="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2"
                    >
                        <DreamPhenomenonCard
                            v-if="dream.phenomenaDetails.death"
                            @click="filterStore.toggleArrayFilter('events', 'death')"
                            type="death"
                            :details="dream.phenomenaDetails"
                            :is-in-filter="filterStore.filters.isActive"
                            :is-pressed="filterStore.filters.events.includes('death')"
                        />

                        <DreamPhenomenonCard
                            v-if="dream.phenomenaDetails.flying"
                            @click="filterStore.toggleArrayFilter('events', 'flying')"
                            type="flying"
                            :details="dream.phenomenaDetails"
                            :is-in-filter="filterStore.filters.isActive"
                            :is-pressed="filterStore.filters.events.includes('flying')"
                        />

                        <DreamPhenomenonCard
                            v-if="dream.phenomenaDetails.falling"
                            @click="filterStore.toggleArrayFilter('events', 'falling')"
                            type="falling"
                            :details="dream.phenomenaDetails"
                            :is-in-filter="filterStore.filters.isActive"
                            :is-pressed="filterStore.filters.events.includes('falling')"
                        />

                        <DreamPhenomenonCard
                            v-if="dream.phenomenaDetails.paralysis"
                            @click="filterStore.toggleArrayFilter('events', 'paralysis')"
                            type="paralysis"
                            :details="dream.phenomenaDetails"
                            :is-in-filter="filterStore.filters.isActive"
                            :is-pressed="filterStore.filters.events.includes('paralysis')"
                        />

                        <DreamPhenomenonCard
                            v-if="dream.phenomenaDetails.nestedDream"
                            @click="filterStore.toggleArrayFilter('events', 'nested_dream')"
                            type="nested_dream"
                            :details="dream.phenomenaDetails"
                            :is-in-filter="filterStore.filters.isActive"
                            :is-pressed="filterStore.filters.events.includes('nested_dream')"
                        />
                    </div>
                </section>

                <!-- 7. Восприятие и Стиль (Визуал, Перспектива, Роли, Ощущения) -->
                <section v-if="hasPerceptionDetails" class="flex flex-col gap-6">
                    <h2
                        class="text-text-primary border-border-muted border-b pb-2 font-semibold tracking-wider"
                    >
                        Восприятие
                    </h2>

                    <div class="flex items-center gap-4 overflow-x-auto pb-2">
                        <AppTag
                            v-if="dream.visualStyle"
                            :is-in-filter="filterStore.filters.isActive"
                            @click="filterStore.toggleArrayFilter('visualStyle', dream.visualStyle)"
                            :is-pressed="
                                filterStore.filters.visualStyle.includes(dream.visualStyle)
                            "
                            :icon="VISUAL_STYLE_MAP[dream.visualStyle].icon"
                            >{{ VISUAL_STYLE_MAP[dream.visualStyle].label }}
                        </AppTag>

                        <AppTag
                            v-if="dream.perspective"
                            :is-in-filter="filterStore.filters.isActive"
                            @click="filterStore.toggleArrayFilter('perspective', dream.perspective)"
                            :is-pressed="
                                filterStore.filters.perspective.includes(dream.perspective)
                            "
                            :icon="PERSPECTIVE_MAP[dream.perspective].icon"
                            >{{ PERSPECTIVE_MAP[dream.perspective].label }}
                        </AppTag>
                    </div>

                    <!-- Роли -->
                    <div v-if="dream.roles?.length" class="flex flex-col gap-2">
                        <h3 class="text-text-mute">Роль в сюжетe:</h3>
                        <div class="flex w-full gap-2 overflow-x-auto pb-2">
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
                    <div v-if="dream.sensations?.length" class="flex flex-col gap-2">
                        <h3 class="text-text-mute">Сенсорные ощущения:</h3>
                        <div class="flex flex-wrap gap-2">
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
                <section v-if="hasAnalytics" class="flex flex-col gap-4">
                    <h2
                        class="text-text-primary border-border-muted border-b pb-2 font-semibold tracking-wider"
                    >
                        Аналитические элементы
                    </h2>

                    <div
                        v-if="analiticElements.length"
                        class="grid grid-cols-1 gap-4 lg:grid-cols-2"
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
                <section v-if="interpretationsWithSource.length" class="flex flex-col gap-8">
                    <h2
                        class="text-text-primary border-border-muted border-b pb-2 font-semibold tracking-wider"
                    >
                        Интерпретации
                    </h2>

                    <div class="flex flex-col gap-6">
                        <DreamInterpretationCard
                            v-for="interp in interpretationsWithSource"
                            :key="interp.interpretationId"
                            :interpretation="interp"
                        />
                    </div>
                </section>

                <!-- 11. Связанные сны -->
                <section v-if="dream.relatedDreams?.length" class="flex flex-col gap-4">
                    <h2
                        class="text-text-primary border-border-muted border-b pb-2 font-semibold tracking-wider"
                    >
                        Связанные сны
                    </h2>

                    <DreamRelatedCard v-for="rel in relatedDreams" :key="rel.id" :relation="rel" />
                </section>

                <!-- 10. Личные заметки -->
                <section v-if="dream.personalNotes" class="flex flex-col gap-4">
                    <h2
                        class="text-text-primary border-border-muted border-b pb-2 font-semibold tracking-wider"
                    >
                        Личные заметки
                    </h2>
                    <p
                        class="text-text-primary bg-bg-secondary/30 mt-1.5 overflow-auto rounded-lg leading-relaxed italic"
                    >
                        “{{ dream.personalNotes }}”
                    </p>
                </section>

                <!-- Нижняя панель: Метаданные и Кнопки управления -->
                <footer
                    class="border-border/35 text-text-muted mt-6 flex flex-col gap-4 border-t pt-4 text-[11px]"
                >
                    <!-- Даты создания/изменения -->
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <div v-if="dream.createdAt" class="flex items-center gap-1">
                            <span class="opacity-75">Создано:</span>
                            <AppSmartTime :date="dream.createdAt" />
                        </div>

                        <span v-if="dream.createdAt && dream.updatedAt" class="opacity-60">•</span>

                        <div v-if="dream.updatedAt" class="flex items-center gap-1">
                            <span class="opacity-75">Изменено:</span>
                            <AppSmartTime :date="dream.updatedAt" />
                        </div>
                    </div>

                    <!-- Кнопки управления -->
                    <div class="flex items-center justify-between">
                        <AppButton
                            @click="handleDelete(dream.id, dream.date, dream.title)"
                            size="xs"
                            variant="danger"
                            :disabled="isDeleting(dream.id)"
                        >
                            <span>Удалить</span>
                        </AppButton>

                        <AppButton
                            @click="goToEdit(slug)"
                            size="xs"
                            variant="primary"
                            :disabled="isDeleting(dream.id)"
                        >
                            <span>Редактировать</span>
                        </AppButton>
                    </div>
                </footer>
            </article>

            <!-- Пустое состояние -->
            <div v-else role="status" aria-live="polite" class="dream-card p-8 text-center">
                <p class="text-text-mute">Сон не найден</p>
            </div>

            <DreamFilterApplyBar :dream-slug="slug" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useDreamFilterStore } from '@/stores/modules/dreamFilter';
    import {
        CalendarDays,
        Star,
        Pin,
        Lock,
        ArrowBigLeftDash,
        Trash2,
        FileEdit,
        Archive,
        MoveLeft,
    } from 'lucide-vue-next';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppTag from '@/components/ui/AppTag.vue';
    import DreamInterpretationCard from '@/components/cards/DreamInterpretationCard.vue';
    import DreamRelatedCard from '@/components/cards/DreamRelatedCard.vue';
    import DreamElementsCard from '@/components/cards/DreamElementsCard.vue';
    import DreamCategoryDetailsCard from '@/components/cards/DreamCategoryDetailsCard.vue';
    import DreamPhenomenonCard from '@/components/cards/DreamPhenomenonCard.vue';
    import AppRating from '@/components/ui/AppRating.vue';
    import { useCrud } from '@/composables/crud';
    import AppSmartTime from '@/components/ui/AppSmartTime.vue';
    import DreamFilterApplyBar from '@/components/sections/DreamFilterApplyBar.vue';
    import { useNavigation } from '@/composables/routing/useNavigation';
    import { useInterpretationSourceStore } from '@/stores/modules/useInterpretationSourceStore';

    import type { DreamElementsObject, AnaliticsIds } from '@/types/Dream';

    import {
        TIME_OF_DAY_MAP,
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
                if (!sourceId) return null;

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

        filterStore.resetFilters();
    });
</script>
