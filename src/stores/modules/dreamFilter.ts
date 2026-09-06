import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useSleepStore } from '@/stores/modules/dream';

export interface DreamFilterState {
    characters: string[];
    locations: string[];
    objects: string[];
    emotions: string[];
    categories: string[];
    minClarity?: number;
}

export const useDreamFilterStore = defineStore('dreamFilter', () => {
    const sleepStore = useSleepStore();

    // Текущие выбранные фильтры
    const filters = ref<DreamFilterState>({
        characters: [],
        locations: [],
        objects: [],
        emotions: [],
        categories: [],
        minClarity: undefined,
    });

    // 1. COMPUTED: Отфильтрованные сны (для страницы выдачи)
    const filteredDreams = computed(() => {
        return sleepStore.sleeps.filter((dream) => {
            // Проверка персонажей (должен содержать хотя бы один из выбранных, или все — по вашему UX)
            if (filters.value.characters.length > 0) {
                const hasChar = filters.value.characters.some((c) => dream.characters?.includes(c));
                if (!hasChar) return false;
            }

            // Проверка локаций
            if (filters.value.locations.length > 0) {
                const hasLoc = filters.value.locations.some((l) => dream.locations?.includes(l));
                if (!hasLoc) return false;
            }

            // Проверка эмоций
            if (filters.value.emotions.length > 0) {
                const hasEmo = filters.value.emotions.some((e) => dream.emotions?.includes(e));
                if (!hasEmo) return false;
            }

            // Проверка ясности
            if (filters.value.minClarity !== undefined) {
                if ((dream.clarity ?? 0) < filters.value.minClarity) return false;
            }

            return true;
        });
    });

    // 2. COMPUTED: Живое количество похожих снов (для кнопки)
    const matchingCount = computed(() => filteredDreams.value.length);

    // Сброс фильтров
    const resetFilters = () => {
        filters.value = {
            characters: [],
            locations: [],
            objects: [],
            emotions: [],
            categories: [],
            minClarity: undefined,
        };
    };

    return {
        filters,
        filteredDreams,
        matchingCount,
        resetFilters,
    };
});
