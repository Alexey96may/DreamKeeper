<template>
    <div class="text-text-primary transition-theme duration-theme">
        <div class="container mx-auto max-w-2xl px-4 py-6">
            <AppButton @click="goBack()" size="xs" variant="back" :icon-left="MoveLeft">
                <span>Назад</span>
            </AppButton>

            <div v-scroll-reveal class="mt-6 space-y-6">
                <div>
                    <h1 class="text-text-primary font-bold">Поиск и фильтрация снов</h1>
                </div>

                <div class="flex gap-2">
                    <AppTextInput
                        v-model="filterStore.filters.searchQuery"
                        type="search"
                        placeholder="Поиск по названию или описанию сна"
                    />

                    <AppButton
                        @click="isModalOpen = !isModalOpen"
                        size="sm"
                        variant="secondary"
                        class="shrink-0"
                        title="Параметры календаря"
                        :icon-left="Filter"
                    />
                </div>

                <Transition name="fade-slide">
                    <div
                        v-if="filterStore.activeFilterTags.length > 0"
                        class="mb-4 flex flex-wrap items-center gap-2"
                    >
                        <span class="text-text-muted text-xs">Активные фильтры:</span>

                        <TransitionGroup name="tag-list">
                            <div
                                v-for="tag in filterStore.activeFilterTags"
                                :key="tag.key + (tag.subKey || '')"
                                class="bg-bg-secondary border-border-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
                            >
                                <span>{{ tag.label }}</span>
                                <button
                                    type="button"
                                    class="hover:text-accent-hover transition-colors"
                                    @click="filterStore.removeFilterTag(tag)"
                                >
                                    &times;
                                </button>
                            </div>
                        </TransitionGroup>

                        <button
                            type="button"
                            class="text-text-primary ml-2 border-b-0 text-xs transition-all hover:border-b-1"
                            @click="filterStore.resetFilters()"
                        >
                            Сбросить все
                        </button>
                    </div>
                </Transition>

                <div aria-live="polite" class="sr-only">
                    {{
                        filterStore.matchingCount
                            ? `Найдено записей: ${filterStore.matchingCount}`
                            : 'Ничего не найдено'
                    }}
                </div>

                <div class="border-border-strong flex flex-col gap-4 border-t pt-4">
                    <p class="text-text-soft mb-4 text-xs font-medium sm:text-sm">
                        Результаты ({{ filterStore.matchingCount }})
                    </p>

                    <Transition name="fade" mode="out-in">
                        <!-- Скелетоны  -->
                        <template v-if="filterStore.loading">
                            <div key="skeleton" class="space-y-2.5">
                                <DreamSearchCardSkeleton v-for="n in 3" :key="n" />
                            </div>
                        </template>

                        <!-- Список или заглушка -->
                        <template v-else>
                            <div
                                v-if="filterStore.matchingCount > 0"
                                key="list"
                                class="space-y-2.5"
                            >
                                <TransitionGroup name="card-list">
                                    <DreamSearchCard
                                        v-for="dream in visibleDreams"
                                        :key="dream.id"
                                        :dream="dream"
                                        :is-selected="dream.slug === actualDreamSlug"
                                        @select="goToDreamDetail(dream.slug)"
                                    />
                                </TransitionGroup>

                                <!-- Элемент-наблюдатель для триггера бесконечного скролла -->
                                <div ref="loadMoreTrigger" class="py-4 text-center">
                                    <Transition name="fade" mode="out-in">
                                        <span
                                            v-if="hasMore"
                                            class="text-text-muted animate-pulse text-xs"
                                        >
                                            Загрузка следующих снов...
                                        </span>
                                        <span
                                            v-else-if="visibleDreams.length > 0"
                                            class="text-text-muted text-xs"
                                        >
                                            Все сны загружены
                                        </span>
                                    </Transition>
                                </div>
                            </div>

                            <p v-else key="empty" class="text-text-muted py-8 text-center text-sm">
                                По вашему запросу ничего не найдено
                            </p>
                        </template>
                    </Transition>
                </div>
            </div>
        </div>

        <AppModal
            v-model="isModalOpen"
            :title="'Параметры фильтрации (' + filterStore.matchingCount + ')'"
        >
            <SearchDreamFilter />
        </AppModal>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
    import AppModal from '@/components/sections/AppModal.vue';
    import SearchDreamFilter from '@/views/dreams/partials/SearchDreamFilter.vue';
    import { useRoute } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useDreamFilterStore } from '@/stores/modules/dreamFilter';
    import DreamSearchCard from '@/components/cards/DreamSearchCard.vue';
    import DreamSearchCardSkeleton from '@/components/skeletons/DreamSearchCardSkeleton.vue';
    import { MoveLeft, Filter } from 'lucide-vue-next';
    import AppButton from '@/components/ui/AppButton.vue';
    import { useNavigation } from '@/composables/routing/useNavigation';
    import AppTextInput from '@/components/ui/AppTextInput.vue';

    const route = useRoute();
    const sleepStore = useSleepStore();
    const filterStore = useDreamFilterStore();
    const { goBack, goToDreamDetail } = useNavigation();

    const isModalOpen = ref(false);
    const searchInput = ref<HTMLInputElement | null>(null);

    // --- Логика бесконечного скролла ---
    const pageSize = 15;
    const displayLimit = ref(pageSize);
    const loadMoreTrigger = ref<HTMLElement | null>(null);
    let observer: IntersectionObserver | null = null;

    // Срез отфильтрованных снов по текущему лимиту пагинации
    const visibleDreams = computed(() => {
        return filterStore.filteredDreams.slice(0, displayLimit.value);
    });

    const hasMore = computed(() => {
        return displayLimit.value < filterStore.filteredDreams.length;
    });

    // Сбрасываем лимит при изменении фильтров или поискового запроса
    watch(
        () => filterStore.filteredDreams,
        () => {
            displayLimit.value = pageSize;
        },
        { deep: true },
    );

    const loadMore = () => {
        if (hasMore.value) {
            displayLimit.value += pageSize;
        }
    };

    onMounted(async () => {
        if (sleepStore.sleeps.length === 0) {
            await sleepStore.init();
        }
        filterStore.toggleActive(true);

        nextTick(() => {
            searchInput.value?.focus();
        });

        // Настраиваем IntersectionObserver для отслеживания конца списка
        observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: '200px' },
        );

        if (loadMoreTrigger.value) {
            observer.observe(loadMoreTrigger.value);
        }
    });

    watch(loadMoreTrigger, (newVal) => {
        if (newVal && observer) {
            observer.observe(newVal);
        }
    });

    onUnmounted(() => {
        filterStore.toggleActive(false);
        if (observer) {
            observer.disconnect();
        }
    });

    const actualDreamSlug = computed(() => {
        const param = route.query.actualDream;
        return typeof param === 'string' ? param : null;
    });
</script>

<style scoped>
    /* Анимация появления/исчезновения блоков */
    .fade-enter-active,
    .fade-leave-active,
    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: all 0.25s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .fade-slide-enter-from,
    .fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-8px);
    }

    /* Анимация чипсов (тегов) */
    .tag-list-enter-active,
    .tag-list-leave-active {
        transition: all 0.2s ease;
    }
    .tag-list-enter-from,
    .tag-list-leave-to {
        opacity: 0;
        transform: scale(0.85);
    }
    .tag-list-leave-active {
        position: absolute;
    }

    .card-list-enter-active,
    .card-list-leave-active,
    .card-list-move {
        transition: all 0.3s ease;
    }

    .card-list-enter-from,
    .card-list-leave-to {
        opacity: 0;
        transform: translateY(12px);
    }

    .card-list-leave-active {
        position: absolute;
        width: 100%;
    }
</style>
