<template>
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-2 opacity-0"
    >
        <aside
            v-if="isVisible"
            aria-label="Панель применения фильтров"
            class="fixed right-0 bottom-0 z-40 mx-4 my-4 flex flex-col items-center gap-2 rounded-lg"
        >
            <!-- Переключаемый контент с анимацией выцветания/смещения -->
            <Transition name="fade-slide" mode="out-in">
                <!-- Состояние 1: Фильтры активны -->
                <div v-if="filterStore.draftFilters.isActive" key="active" class="relative">
                    <div
                        class="text-text-primary bg-bg-secondary border-border-primary absolute -top-4 -right-2 z-10 flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium shadow-sm"
                        role="status"
                        aria-live="polite"
                    >
                        <AppTooltip content="Количество найденых снов" />
                        <span class="text-[10px] sm:text-xs">{{ filterStore.matchingCount }}</span>
                    </div>

                    <div class="flex gap-2">
                        <AppButton
                            @click="handleCancel"
                            size="xs"
                            variant="primary"
                            aria-label="Сбросить выбранные фильтры"
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

                <!-- Состояние 2: Фильтры неактивны (просто кнопка) -->
                <div v-else key="inactive">
                    <AppButton
                        @click="filterStore.toggleActive(true)"
                        size="xs"
                        variant="primary"
                        aria-label="Открыть фильтры"
                    >
                        <span>Фильтр</span>
                    </AppButton>
                </div>
            </Transition>
        </aside>
    </Transition>
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

    const isVisible = computed(() => {
        return true;
    });

    const applyFiltersAndNavigate = () => {
        filterStore.applyDraft();
        router.push({
            name: 'dream-search',
            query: {
                actualDream: props.dreamSlug,
            },
        });
    };

    const handleCancel = () => {
        filterStore.resetFilters();
    };
</script>

<style scoped>
    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: all 0.2s ease;
    }

    .fade-slide-enter-from {
        opacity: 0;
        transform: translateY(4px);
    }

    .fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-4px);
    }
</style>
