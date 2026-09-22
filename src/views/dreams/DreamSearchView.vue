<template>
    <div class="text-text-primary transition-theme duration-theme">
        <div class="container mx-auto max-w-2xl px-4 py-6">
            <AppButton @click="goBack" size="xs" variant="back" :icon-left="MoveLeft">
                <span>Назад</span>
            </AppButton>

            <div class="mt-6 space-y-6">
                <div>
                    <h1 class="text-text-primary text-2xl font-bold">Поиск и фильтрация снов</h1>
                </div>

                <div class="flex gap-2">
                    <AppTextInput
                        v-model="filterStore.filters.searchQuery"
                        type="search"
                        class=""
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

                <div aria-live="polite" class="sr-only">
                    {{
                        filterStore.matchingCount
                            ? `Найдено записей: ${filterStore.matchingCount}`
                            : 'Ничего не найдено'
                    }}
                </div>

                <div class="flex flex-col gap-4">
                    <h2 class="text-text-soft text-sm font-medium">
                        Результаты ({{ filterStore.matchingCount }})
                    </h2>

                    <div v-if="filterStore.matchingCount > 0" class="space-y-2">
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

        <AppModal
            v-model="isModalOpen"
            :close-on-overlay="true"
            :title="'Параметры фильтрации (' + filterStore.matchingCount + ')'"
        >
            <SearchDreamFilter />
        </AppModal>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
    import AppModal from '@/components/sections/AppModal.vue';
    import SearchDreamFilter from '@/views/dreams/partials/SearchDreamFilter.vue';
    import { useRoute } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useDreamFilterStore } from '@/stores/modules/dreamFilter';
    import DreamSearchCard from '@/components/cards/DreamSearchCard.vue';
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

    onMounted(async () => {
        if (sleepStore.sleeps.length === 0) {
            await sleepStore.init();
        }
        filterStore.toggleActive(true);

        nextTick(() => {
            searchInput.value?.focus();
        });
    });

    onUnmounted(async () => {
        filterStore.toggleActive(false);
    });

    const actualDreamSlug = computed(() => {
        const param = route.query.actualDream;
        return typeof param === 'string' ? param : null;
    });
</script>
