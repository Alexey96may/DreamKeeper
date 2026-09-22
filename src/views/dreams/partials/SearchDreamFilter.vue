<template>
    <div class="bg-bg-secondary/30 border-border-muted/50 space-y-4 rounded-xl border p-4">
        <!-- Категории снов -->

        <div class="flex flex-wrap items-center gap-2">
            <AppDatePicker
                v-model="filterStore.filters.dateFrom"
                label="От даты"
                hint="Укажите дату, с которой нужно найти сны"
            />

            <AppDatePicker
                v-model="filterStore.filters.dateTo"
                label="До даты"
                hint="Укажите дату, до которой нужно найти сны"
            />
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <AppMultiSelect
                id="form-categories"
                v-model="filterStore.filters.categories"
                label="Категории"
                :options="DREAM_CATEGORY_OPTIONS"
                placeholder="Выберите категории"
            />

            <AppMultiSelect
                id="form-events"
                v-model="filterStore.filters.events"
                label="События"
                :options="DREAM_PHENOMENON_OPTIONS"
                placeholder="Выберите события"
            />

            <AppMultiSelect
                id="form-timeOfDay"
                v-model="filterStore.filters.timeOfDay"
                label="Время суток"
                :options="TIME_OF_DAY_OPTIONS"
                placeholder="Выберите времена суток"
            />
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <AppMultiSelect
                id="form-emotions"
                v-model="filterStore.filters.emotions"
                label="Эмоции"
                :options="allEmotions"
                placeholder="Выберите эмоции"
            />

            <AppMultiSelect
                v-if="allCharacters.length > 0"
                id="form-characters"
                v-model="filterStore.filters.characters"
                label="Персонажи"
                :options="allCharacters"
                placeholder="Выберите персонажей"
            />

            <AppMultiSelect
                v-if="allLocations.length > 0"
                id="form-locations"
                v-model="filterStore.filters.locations"
                label="Локации"
                :options="allLocations"
                placeholder="Выберите локации"
            />

            <AppMultiSelect
                v-if="allObjects.length > 0"
                id="form-objects"
                v-model="filterStore.filters.objects"
                label="Объекты"
                :options="allObjects"
                placeholder="Выберите персонажей"
            />
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <AppMultiSelect
                id="form-sensations"
                v-model="filterStore.filters.sensations"
                label="Ощущения"
                :options="SENSORY_ASPECT_OPTIONS"
                placeholder="Выберите ощущения"
            />

            <AppMultiSelect
                id="form-roles"
                v-model="filterStore.filters.roles"
                label="Роли"
                :options="PARTICIPANT_ROLE_OPTIONS"
                placeholder="Выберите роли"
            />
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <AppMultiSelect
                id="form-visualStyle"
                v-model="filterStore.filters.visualStyle"
                label="Визуальные стили"
                :options="VISUAL_STYLE_OPTIONS"
                placeholder="Выберите визуальные стили"
            />

            <AppMultiSelect
                id="form-perspective"
                v-model="filterStore.filters.perspective"
                label="Лица"
                :options="perspectiveOptions"
                placeholder="Выберите лица"
            />
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <AppRange
                v-show="filterStore.filters.categories.includes('lucid')"
                :model-value="filterStore.filters.minLucidControl"
                @update:model-value="
                    (val) => {
                        filterStore.toggleNumberFilter('minLucidControl', val);
                    }
                "
                label="Уровень контроля ОС"
                :min="0"
                :max="10"
                :step="1"
                :value-formatter="computedDreamValueFormatter"
                hint="Минимальный уровень контроля осознанного сновидения"
            />

            <AppRange
                v-show="filterStore.filters.categories.includes('nightmare')"
                :model-value="filterStore.filters.maxNightmareFear"
                @update:model-value="
                    (val) => {
                        filterStore.toggleNumberFilter('maxNightmareFear', val);
                    }
                "
                label="Максимальный уровень страха"
                :min="0"
                :max="10"
                :step="1"
                :value-formatter="computedDreamValueFormatter"
            />

            <AppRange
                :model-value="filterStore.filters.minQuality"
                @update:model-value="
                    (val) => {
                        filterStore.toggleNumberFilter('minQuality', val);
                    }
                "
                label="Минимальное качество сна"
                :min="0"
                :max="10"
                :step="1"
                :value-formatter="computedDreamValueFormatter"
            />

            <AppRange
                :model-value="filterStore.filters.minClarity"
                @update:model-value="
                    (val) => {
                        filterStore.toggleNumberFilter('minClarity', val);
                    }
                "
                label="Максимальная ясность сна"
                :min="0"
                :max="10"
                :step="1"
                :value-formatter="computedDreamValueFormatter"
            />

            <AppRange
                :model-value="filterStore.filters.minMoodAfter"
                @update:model-value="
                    (val) => {
                        filterStore.toggleNumberFilter('minMoodAfter', val);
                    }
                "
                label="Минимальное настроение после сна"
                :min="0"
                :max="10"
                :step="1"
                :value-formatter="computedDreamValueFormatter"
            />
        </div>

        <AppCheckbox
            :model-value="filterStore.filters.propheticFulfilled"
            @update:model-value="filterStore.toggleBooleanFilter('propheticFulfilled')"
            label="Сбылся ли сон?"
        />

        <div class="border-border-muted/40 flex flex-wrap justify-start gap-3 border-t pt-2">
            <AppCheckbox
                :model-value="filterStore.filters.isFavorite"
                @update:model-value="filterStore.toggleBooleanFilter('isFavorite')"
                label="Избранные"
            />

            <AppCheckbox
                :model-value="filterStore.filters.isPinned"
                @update:model-value="filterStore.toggleBooleanFilter('isPinned')"
                label="Закрепленные"
            />

            <AppCheckbox
                :model-value="filterStore.filters.isArchived"
                @update:model-value="filterStore.toggleBooleanFilter('isArchived')"
                label="В архиве"
            />

            <AppCheckbox
                :model-value="filterStore.filters.isDraft"
                @update:model-value="filterStore.toggleBooleanFilter('isDraft')"
                label="В черновике"
            />

            <AppCheckbox
                :model-value="filterStore.filters.isPrivate"
                @update:model-value="filterStore.toggleBooleanFilter('isPrivate')"
                label="Приватные"
            />

            <AppCheckbox
                :model-value="filterStore.filters.isDeleted"
                @update:model-value="filterStore.toggleBooleanFilter('isDeleted')"
                label="Удаленные"
            />
        </div>

        <div class="flex justify-end">
            <AppButton
                v-if="hasActiveFilters"
                @click="filterStore.resetFilters"
                size="xs"
                variant="danger"
            >
                Сбросить все
            </AppButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useDreamFilterStore } from '@/stores/modules/dreamFilter';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppRange from '@/components/ui/AppRange.vue';
    import AppMultiSelect from '@/components/ui/AppMultiSelect.vue';
    import AppDatePicker from '@/components/ui/AppDatePicker.vue';
    import AppCheckbox from '@/components/ui/AppCheckbox.vue';
    import { dreamValueFormatter } from '@/utils/formatters';
    import {
        DREAM_CATEGORY_OPTIONS,
        DREAM_PHENOMENON_OPTIONS,
        PERSPECTIVE_OPTIONS,
        SENSORY_ASPECT_OPTIONS,
        PARTICIPANT_ROLE_OPTIONS,
        VISUAL_STYLE_OPTIONS,
        TIME_OF_DAY_OPTIONS,
    } from '@/constants/Dream';

    const sleepStore = useSleepStore();
    const filterStore = useDreamFilterStore();

    const computedDreamValueFormatter = computed(() => dreamValueFormatter);

    const searchInput = ref<HTMLInputElement | null>(null);

    // Сбор уникальных эмоций и персонажей из всех доступных снов для фильтрации
    const allEmotions = computed(() => {
        const set = new Set<string>();
        sleepStore.sleeps.forEach((d) => d.emotions?.forEach((e) => set.add(e)));

        return Array.from(set);
    });

    const perspectiveOptions = computed(() => {
        return PERSPECTIVE_OPTIONS.slice(1);
    });

    const allCharacters = computed(() => {
        const set = new Set<string>();
        sleepStore.sleeps.forEach((d) => d.characters?.forEach((c) => set.add(c)));
        return Array.from(set);
    });

    const allLocations = computed(() => {
        const set = new Set<string>();
        sleepStore.sleeps.forEach((d) => d.locations?.forEach((c) => set.add(c)));
        return Array.from(set);
    });

    const allObjects = computed(() => {
        const set = new Set<string>();
        sleepStore.sleeps.forEach((d) => d.objects?.forEach((c) => set.add(c)));
        return Array.from(set);
    });

    const hasActiveFilters = computed(() => {
        return (
            filterStore.filters.dateFrom ||
            filterStore.filters.dateTo ||
            filterStore.filters.propheticFulfilled ||
            filterStore.filters.minLucidControl ||
            filterStore.filters.maxNightmareFear ||
            filterStore.filters.minQuality ||
            filterStore.filters.minClarity ||
            filterStore.filters.minMoodAfter ||
            filterStore.filters.characters.length > 0 ||
            filterStore.filters.locations.length > 0 ||
            filterStore.filters.objects.length > 0 ||
            filterStore.filters.emotions.length > 0 ||
            filterStore.filters.categories.length > 0 ||
            filterStore.filters.events.length > 0 ||
            filterStore.filters.timeOfDay.length > 0 ||
            filterStore.filters.visualStyle.length > 0 ||
            filterStore.filters.perspective.length > 0 ||
            filterStore.filters.roles.length > 0 ||
            filterStore.filters.sensations.length > 0 ||
            Boolean(filterStore.filters.searchQuery.trim()) ||
            filterStore.filters.isFavorite ||
            filterStore.filters.isPinned ||
            filterStore.filters.isArchived ||
            filterStore.filters.isDeleted ||
            filterStore.filters.isDraft ||
            filterStore.filters.isPrivate
        );
    });

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
</script>
