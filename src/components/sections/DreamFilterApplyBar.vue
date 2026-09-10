<template>
    <aside
        v-if="isVisible"
        aria-label="Панель применения фильтров"
        class="bg-bg-mute fixed right-0 bottom-0 z-40 mx-4 my-4 rounded-lg p-2"
    >
        <!-- Бейдж с количеством результатов -->

        <div v-if="filterStore.filters.isActive">
            <div
                class="text-text-primary bg-bg-secondary border-border/50 absolute -top-2 -right-2 flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium shadow-sm"
                role="status"
                aria-live="polite"
                title=""
            >
                <AppTooltip content="Количество найденых снов" />
                <span>{{ filterStore.matchingCount }}</span>
            </div>

            <div class="flex gap-2">
                <AppButton
                    @click="filterStore.resetFilters"
                    size="xs"
                    variant="primary"
                    aria-label="Применить выбранные фильтры и перейти к результатам"
                >
                    Сбросить фильтр
                </AppButton>

                <AppButton
                    @click="applyFiltersAndNavigate"
                    size="xs"
                    variant="primary"
                    aria-label="Применить выбранные фильтры и перейти к результатам"
                >
                    Применить фильтр
                </AppButton>
            </div>
        </div>

        <div v-else>
            <AppButton
                @click="filterStore.toggleActive(true)"
                size="xs"
                variant="primary"
                aria-label="Применить выбранные фильтры и перейти к результатам"
            >
                Активировать фильтр
            </AppButton>
        </div>
    </aside>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useDreamFilterStore } from '@/stores/modules/dreamFilter';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppTooltip from '@/components/ui/AppTooltip.vue';

    const router = useRouter();
    const filterStore = useDreamFilterStore();

    const props = defineProps<{
        dreamSlug?: string;
    }>();

    // Опционально: показывать панель только тогда, когда есть активные фильтры
    // или когда счетчик изменился (по умолчанию отображаем всегда, если нужно — раскомментируйте)
    const isVisible = computed(() => {
        return true; // или логика вроде filterStore.hasActiveFilters
    });

    // Переход на страницу результатов с синхронизацией URL
    const applyFiltersAndNavigate = () => {
        router.push({
            name: 'dream-search',
            query: {
                characters: filterStore.filters.characters.length
                    ? filterStore.filters.characters.join(',')
                    : undefined,
                emotions: filterStore.filters.emotions.length
                    ? filterStore.filters.emotions.join(',')
                    : undefined,
                minClarity: filterStore.filters.minClarity ?? undefined,
                actualDream: props.dreamSlug,
            },
        });
    };
</script>
