<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto max-w-2xl px-4 py-6">
            <AppButton @click="goBack" size="xs" variant="back" :icon-left="MoveLeft">
                Назад
            </AppButton>

            <div class="mt-6 space-y-6">
                <div>
                    <h1 class="text-text-primary text-2xl font-bold">Поиск и фильтрация снов</h1>
                    <p class="text-text-mute text-sm">
                        Поиск по ключевым словам и расширенным параметрам
                    </p>
                </div>

                <!-- Строка поиска -->
                <div class="relative">
                    <label for="dream-search-input" class="sr-only">Поиск по снам</label>
                    <div class="relative flex items-center">
                        <SearchIcon
                            class="text-text-mute pointer-events-none absolute left-3.5 h-4 w-4"
                            aria-hidden="true"
                        />
                        <input
                            id="dream-search-input"
                            ref="searchInput"
                            v-model="filterStore.filters.searchQuery"
                            type="search"
                            role="searchbox"
                            aria-label="Поиск по снам"
                            placeholder="Введите текст для поиска..."
                            class="bg-bg-secondary/50 border-border text-text-primary placeholder:text-text-mute focus:ring-primary/50 w-full rounded-xl border py-3 pr-4 pl-10 text-sm transition outline-none focus:ring-2"
                        />
                        <button
                            v-if="filterStore.filters.searchQuery"
                            @click="clearSearch"
                            type="button"
                            aria-label="Очистить поиск"
                            class="text-text-mute hover:text-text-primary absolute right-3 p-1 transition"
                        >
                            <X class="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <!-- Блок расширенной фильтрации -->
                <div class="bg-bg-secondary/30 border-border/50 space-y-4 rounded-xl border p-4">
                    <div class="flex items-center justify-between">
                        <span class="text-text-primary text-sm font-medium"
                            >Параметры фильтрации</span
                        >
                        <button
                            v-if="hasActiveFilters"
                            @click="filterStore.resetFilters"
                            class="text-text-mute hover:text-text-primary text-xs underline transition"
                        >
                            Сбросить все
                        </button>
                    </div>

                    <!-- Категории снов -->

                    <div class="space-y-1.5">
                        <span class="text-text-mute text-xs">Категории</span>
                        <div class="flex flex-wrap gap-1.5">
                            <button
                                v-for="cat in availableCategories"
                                :key="cat.value"
                                type="button"
                                @click="filterStore.toggleArrayFilter('categories', cat.value)"
                                :class="[
                                    'rounded-lg border px-2.5 py-1 text-xs transition',
                                    filterStore.filters.categories.includes(cat.value)
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-bg-secondary/50 border-border/50 text-text-soft hover:border-border',
                                ]"
                            >
                                {{ cat.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Эмоции -->
                    <div v-if="allEmotions.length > 0" class="space-y-1.5">
                        <span class="text-text-mute text-xs">Эмоции</span>
                        <div class="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
                            <button
                                v-for="emo in allEmotions"
                                :key="emo"
                                type="button"
                                @click="filterStore.toggleArrayFilter('emotions', emo)"
                                :class="[
                                    'rounded-lg border px-2.5 py-1 text-xs transition',
                                    filterStore.filters.emotions.includes(emo)
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-bg-secondary/50 border-border/50 text-text-soft hover:border-border',
                                ]"
                            >
                                {{ emo }}
                            </button>
                        </div>
                    </div>

                    <!-- Персонажи -->
                    <div v-if="allCharacters.length > 0" class="space-y-1.5">
                        <span class="text-text-mute text-xs">Персонажи</span>
                        <div class="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
                            <button
                                v-for="char in allCharacters"
                                :key="char"
                                type="button"
                                @click="filterStore.toggleArrayFilter('characters', char)"
                                :class="[
                                    'rounded-lg border px-2.5 py-1 text-xs transition',
                                    filterStore.filters.characters.includes(char)
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-bg-secondary/50 border-border/50 text-text-soft hover:border-border',
                                ]"
                            >
                                {{ char }}
                            </button>
                        </div>
                    </div>

                    <!-- Быстрые чекбоксы (Избранное, С закрепом и т.д.) -->
                    <div class="border-border/40 flex flex-wrap gap-3 border-t pt-2">
                        <label
                            class="text-text-soft flex cursor-pointer items-center gap-2 text-xs select-none"
                        >
                            <input
                                type="checkbox"
                                :checked="filterStore.filters.isFavorite === true"
                                @change="filterStore.toggleBooleanFilter('isFavorite')"
                                class="border-border text-primary focus:ring-primary/50 h-3.5 w-3.5 rounded"
                            />
                            Избранные
                        </label>
                        <label
                            class="text-text-soft flex cursor-pointer items-center gap-2 text-xs select-none"
                        >
                            <input
                                type="checkbox"
                                :checked="filterStore.filters.isPinned === true"
                                @change="filterStore.toggleBooleanFilter('isPinned')"
                                class="border-border text-primary focus:ring-primary/50 h-3.5 w-3.5 rounded"
                            />
                            Закрепленные
                        </label>
                    </div>
                </div>

                <!-- Число результатов для скринридеров -->
                <div aria-live="polite" class="sr-only">
                    {{
                        filterStore.filteredDreams.length
                            ? `Найдено записей: ${filterStore.filteredDreams.length}`
                            : 'Ничего не найдено'
                    }}
                </div>

                <!-- Список результатов -->
                <div class="space-y-3">
                    <h2 class="text-text-soft text-sm font-medium">
                        Результаты ({{ filterStore.filteredDreams.length }})
                    </h2>

                    <div v-if="filterStore.filteredDreams.length > 0" class="space-y-2">
                        <DreamSearchCard
                            v-for="dream in filterStore.filteredDreams"
                            :key="dream.id"
                            :dream="dream"
                            :is-selected="dream.slug === actualDreamSlug"
                            @select="goToDreamDetail(dream.slug)"
                        />
                    </div>

                    <p v-else class="text-text-mute py-8 text-center text-sm">
                        По вашему запросу ничего не найдено
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, nextTick, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useDreamFilterStore } from '@/stores/modules/dreamFilter';
    import DreamSearchCard from '@/components/cards/DreamSearchCard.vue';
    import { MoveLeft, Search as SearchIcon, X } from 'lucide-vue-next';
    import AppButton from '@/components/ui/AppButton.vue';
    import { useNavigation } from '@/composables/routing/useNavigation';
    import type { DreamCategory } from '@/types/Dream';

    const route = useRoute();
    const sleepStore = useSleepStore();
    const filterStore = useDreamFilterStore();
    const { goBack, goToDreamDetail } = useNavigation();

    const searchInput = ref<HTMLInputElement | null>(null);

    const availableCategories: { label: string; value: DreamCategory }[] = [
        { label: 'Кошмар', value: 'nightmare' },
        { label: 'Осознанный', value: 'lucid' },
        { label: 'Вещий', value: 'prophetic' },
    ];

    // Сбор уникальных эмоций и персонажей из всех доступных снов для фильтрации
    const allEmotions = computed(() => {
        const set = new Set<string>();
        sleepStore.sleeps.forEach((d) => d.emotions?.forEach((e) => set.add(e)));
        return Array.from(set);
    });

    const allCharacters = computed(() => {
        const set = new Set<string>();
        sleepStore.sleeps.forEach((d) => d.characters?.forEach((c) => set.add(c)));
        return Array.from(set);
    });

    // Синхронизация URL query-параметров со стором при монтировании и изменении роута
    const syncFiltersFromRoute = () => {
        const charParam = route.query.characters;
        if (typeof charParam === 'string' && charParam) {
            filterStore.filters.characters = charParam.split(',').filter(Boolean);
        }

        const emoParam = route.query.emotions;
        if (typeof emoParam === 'string' && emoParam) {
            filterStore.filters.emotions = emoParam.split(',').filter(Boolean);
        }

        const clarityParam = route.query.minClarity;
        if (clarityParam) {
            filterStore.filters.minClarity = Number(clarityParam);
        }

        // Автоматически включаем фильтрацию, если в URL что-то передано
        if (
            route.query.characters ||
            route.query.emotions ||
            route.query.minClarity ||
            route.query.searchQuery
        ) {
            filterStore.toggleActive(true);
        }
    };

    const hasActiveFilters = computed(() => {
        return (
            filterStore.filters.characters.length > 0 ||
            filterStore.filters.emotions.length > 0 ||
            filterStore.filters.categories.length > 0 ||
            Boolean(filterStore.filters.searchQuery) ||
            filterStore.filters.isFavorite !== undefined ||
            filterStore.filters.isPinned !== undefined ||
            (filterStore.filters.minClarity !== undefined &&
                filterStore.filters.minClarity !== null)
        );
    });

    const clearSearch = () => {
        filterStore.filters.searchQuery = '';
        nextTick(() => {
            searchInput.value?.focus();
        });
    };

    onMounted(async () => {
        if (sleepStore.sleeps.length === 0) {
            await sleepStore.init();
        }
        syncFiltersFromRoute();
        nextTick(() => {
            searchInput.value?.focus();
        });
    });

    const actualDreamSlug = computed(() => {
        const param = route.query.actualDream;
        return typeof param === 'string' ? param : null;
    });

    watch(
        () => route.query,
        () => {
            syncFiltersFromRoute();
        },
    );
</script>
