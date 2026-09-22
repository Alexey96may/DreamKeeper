<template>
    <aside
        v-if="isVisible"
        aria-label="Панель применения фильтров"
        class="fixed right-0 bottom-0 z-40 mx-4 my-4 flex flex-col items-center gap-2 rounded-lg"
    >
        <div v-show="filterStore.filters.isActive">
            <div
                class="text-text-primary bg-bg-secondary border-border/50 absolute -top-2 -right-2 flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium shadow-sm"
                role="status"
                aria-live="polite"
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
                    <span>Сбросить</span>
                </AppButton>

                <AppButton
                    @click="applyFiltersAndNavigate"
                    size="xs"
                    variant="primary"
                    aria-label="Применить выбранные фильтры и перейти к результатам"
                >
                    <span>Применить</span>
                </AppButton>
            </div>
        </div>

        <div v-show="!filterStore.filters.isActive">
            <AppButton
                @click="filterStore.toggleActive(true)"
                size="xs"
                variant="primary"
                aria-label="Применить выбранные фильтры и перейти к результатам"
            >
                <span>Фильтр</span>
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
                actualDream: props.dreamSlug,
            },
        });
    };
</script>
