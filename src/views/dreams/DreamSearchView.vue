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
                        Поиск по ключевым словам и примененным фильтрам
                    </p>
                </div>

                <!-- Активные фильтры из стора -->
                <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2">
                    <span class="text-text-mute text-xs">Фильтры:</span>
                    <span
                        v-for="char in filterStore.filters.characters"
                        :key="char"
                        class="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs"
                    >
                        Персонаж: {{ char }}
                    </span>
                    <span
                        v-for="emo in filterStore.filters.emotions"
                        :key="emo"
                        class="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs"
                    >
                        Эмоция: {{ emo }}
                    </span>
                    <span
                        v-if="
                            filterStore.filters.minClarity !== undefined &&
                            filterStore.filters.minClarity !== null
                        "
                        class="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs"
                    >
                        Мин. осознанность: {{ filterStore.filters.minClarity }}
                    </span>
                    <button
                        @click="filterStore.resetFilters"
                        class="text-text-mute hover:text-text-primary ml-1 text-xs underline"
                    >
                        Сбросить фильтры
                    </button>
                </div>

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

                <div aria-live="polite" class="sr-only">
                    {{
                        filterStore.filteredDreams.length
                            ? `Найдено записей: ${filterStore.filteredDreams.length}`
                            : 'Ничего не найдено'
                    }}
                </div>

                <div class="space-y-3">
                    <h2 class="text-text-soft text-sm font-medium">
                        Результаты ({{ filterStore.filteredDreams.length }})
                    </h2>

                    <div v-if="filterStore.filteredDreams.length > 0" class="space-y-2">
                        <div
                            v-for="dream in filterStore.filteredDreams"
                            :key="dream.id"
                            @click="goToDreamDetail(dream.slug)"
                            class="bg-bg-secondary/50 border-border/50 hover:border-border cursor-pointer rounded-lg border p-4 transition duration-200"
                            role="article"
                        >
                            <div class="flex items-start justify-between gap-4">
                                <div class="space-y-1">
                                    <span
                                        v-if="dream.title"
                                        class="text-text-soft bg-bg-primary border-border/50 inline-block rounded-full border px-2.5 py-0.5 text-xs"
                                    >
                                        {{ dream.title }}
                                    </span>
                                    <p class="text-text-primary text-sm font-medium">
                                        {{ dream.description || 'Без описания' }}
                                    </p>
                                    <p class="text-text-mute text-xs">
                                        {{ formatDate(dream.date) }}
                                        <span v-if="dream.clarity">
                                            • Осознанность: {{ dream.clarity }}</span
                                        >
                                    </p>
                                </div>
                            </div>
                        </div>
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
    import { MoveLeft, Search as SearchIcon, X } from 'lucide-vue-next';
    import AppButton from '@/components/ui/AppButton.vue';
    import { useNavigation } from '@/composables/routing/useNavigation';

    const route = useRoute();
    const sleepStore = useSleepStore();
    const filterStore = useDreamFilterStore();
    const { goBack, goToDreamDetail } = useNavigation();

    const searchInput = ref<HTMLInputElement | null>(null);

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
    };

    const hasActiveFilters = computed(() => {
        return (
            filterStore.filters.characters.length > 0 ||
            filterStore.filters.emotions.length > 0 ||
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

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
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

    // Следим за изменением query в URL, если пользователь меняет их извне
    watch(
        () => route.query,
        () => {
            syncFiltersFromRoute();
        },
    );
</script>
