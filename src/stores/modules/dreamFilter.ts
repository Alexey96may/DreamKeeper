import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useSleepStore } from '@/stores/modules/dream';
import type {
    DreamCategory,
    TimeOfDay,
    VisualStyle,
    Perspective,
    ParticipantRole,
    SensoryAspect,
} from '@/types/Dream';

export interface DreamFilterState {
    // Текстовый поиск
    searchQuery: string;

    // Даты
    dateFrom?: string;
    dateTo?: string;

    // Категории и детали
    categories: DreamCategory[];
    minLucidControl?: number;
    maxNightmareFear?: number;
    propheticFulfilled?: boolean;

    // Оценки (диапазоны или пороги)
    minQuality?: number;
    minClarity?: number;
    minMoodAfter?: number;

    // Свойства сна
    timeOfDay: TimeOfDay[];
    visualStyle: VisualStyle[];
    perspective: Perspective[];
    roles: ParticipantRole[];
    sensations: SensoryAspect[];

    // Аналитика (массивы)
    characters: string[];
    locations: string[];
    objects: string[];
    emotions: string[];

    // Флаги состояния
    isFavorite?: boolean;
    isPinned?: boolean;
    isArchived?: boolean;
    isDeleted?: boolean;
    isDraft?: boolean;
    isPrivate?: boolean;
}

export const useDreamFilterStore = defineStore('dreamFilter', () => {
    const sleepStore = useSleepStore();

    const filters = ref<DreamFilterState>({
        searchQuery: '',
        dateFrom: undefined,
        dateTo: undefined,
        categories: [],
        minLucidControl: undefined,
        maxNightmareFear: undefined,
        propheticFulfilled: undefined,
        minQuality: undefined,
        minClarity: undefined,
        minMoodAfter: undefined,
        timeOfDay: [],
        visualStyle: [],
        perspective: [],
        roles: [],
        sensations: [],
        characters: [],
        locations: [],
        objects: [],
        emotions: [],
        isFavorite: undefined,
        isPinned: undefined,
        isArchived: undefined,
        isDeleted: undefined,
        isDraft: undefined,
        isPrivate: undefined,
    });

    const filteredDreams = computed(() => {
        return sleepStore.sleeps.filter((dream) => {
            // 1. Текстовый поиск (title, description)
            if (filters.value.searchQuery.trim()) {
                const query = filters.value.searchQuery.trim().toLowerCase();
                const titleMatch = dream.title?.toLowerCase().includes(query) ?? false;
                const descMatch = dream.description?.toLowerCase().includes(query) ?? false;
                const notesMatch = dream.personalNotes?.toLowerCase().includes(query) ?? false;
                if (!titleMatch && !descMatch && !notesMatch) return false;
            }

            // 2. Дата (диапазон)
            if (filters.value.dateFrom && dream.date < filters.value.dateFrom) return false;
            if (filters.value.dateTo && dream.date > filters.value.dateTo) return false;

            // 3. Категории и их детали
            if (filters.value.categories.length > 0) {
                const hasCategory = filters.value.categories.some((cat) =>
                    dream.categories?.includes(cat),
                );
                if (!hasCategory) return false;
            }
            if (filters.value.minLucidControl !== undefined) {
                const control = dream.categoryDetails?.lucid?.controlLevel ?? 0;
                if (control < filters.value.minLucidControl) return false;
            }
            if (filters.value.maxNightmareFear !== undefined) {
                const fear = dream.categoryDetails?.nightmare?.fearLevel ?? 10;
                if (fear > filters.value.maxNightmareFear) return false;
            }
            if (filters.value.propheticFulfilled !== undefined) {
                const fulfilled = dream.categoryDetails?.prophetic?.isFulfilled ?? false;
                if (fulfilled !== filters.value.propheticFulfilled) return false;
            }

            // 4. Оценки
            if (
                filters.value.minQuality !== undefined &&
                (dream.quality ?? 0) < filters.value.minQuality
            )
                return false;
            if (
                filters.value.minClarity !== undefined &&
                (dream.clarity ?? 0) < filters.value.minClarity
            )
                return false;
            if (
                filters.value.minMoodAfter !== undefined &&
                (dream.moodAfter ?? 0) < filters.value.minMoodAfter
            )
                return false;

            // 5. Свойства сна
            if (
                filters.value.timeOfDay.length > 0 &&
                (!dream.timeOfDay || !filters.value.timeOfDay.includes(dream.timeOfDay))
            )
                return false;
            if (
                filters.value.visualStyle.length > 0 &&
                (!dream.visualStyle || !filters.value.visualStyle.includes(dream.visualStyle))
            )
                return false;
            if (
                filters.value.perspective.length > 0 &&
                (!dream.perspective || !filters.value.perspective.includes(dream.perspective))
            )
                return false;

            if (filters.value.roles.length > 0) {
                const hasRole = filters.value.roles.some((r) => dream.roles?.includes(r));
                if (!hasRole) return false;
            }
            if (filters.value.sensations.length > 0) {
                const hasSens = filters.value.sensations.some((s) => dream.sensations?.includes(s));
                if (!hasSens) return false;
            }

            // 6. Аналитические массивы (characters, locations, objects, emotions)
            if (filters.value.characters.length > 0) {
                const hasChar = filters.value.characters.some((c) => dream.characters?.includes(c));
                if (!hasChar) return false;
            }
            if (filters.value.locations.length > 0) {
                const hasLoc = filters.value.locations.some((l) => dream.locations?.includes(l));
                if (!hasLoc) return false;
            }
            if (filters.value.objects.length > 0) {
                const hasObj = filters.value.objects.some((o) => dream.objects?.includes(o));
                if (!hasObj) return false;
            }
            if (filters.value.emotions.length > 0) {
                const hasEmo = filters.value.emotions.some((e) => dream.emotions?.includes(e));
                if (!hasEmo) return false;
            }

            // 7. Флаги состояния (Boolean)
            if (
                filters.value.isFavorite !== undefined &&
                !!dream.isFavorite !== filters.value.isFavorite
            )
                return false;
            if (filters.value.isPinned !== undefined && !!dream.isPinned !== filters.value.isPinned)
                return false;
            if (
                filters.value.isArchived !== undefined &&
                !!dream.isArchived !== filters.value.isArchived
            )
                return false;
            if (
                filters.value.isDeleted !== undefined &&
                !!dream.isDeleted !== filters.value.isDeleted
            )
                return false;
            if (filters.value.isDraft !== undefined && !!dream.isDraft !== filters.value.isDraft)
                return false;
            if (
                filters.value.isPrivate !== undefined &&
                !!dream.isPrivate !== filters.value.isPrivate
            )
                return false;

            return true;
        });
    });

    const matchingCount = computed(() => filteredDreams.value.length);

    const resetFilters = () => {
        filters.value = {
            searchQuery: '',
            dateFrom: undefined,
            dateTo: undefined,
            categories: [],
            minLucidControl: undefined,
            maxNightmareFear: undefined,
            propheticFulfilled: undefined,
            minQuality: undefined,
            minClarity: undefined,
            minMoodAfter: undefined,
            timeOfDay: [],
            visualStyle: [],
            perspective: [],
            roles: [],
            sensations: [],
            characters: [],
            locations: [],
            objects: [],
            emotions: [],
            isFavorite: undefined,
            isPinned: undefined,
            isArchived: undefined,
            isDeleted: undefined,
            isDraft: undefined,
            isPrivate: undefined,
        };
    };

    const toggleFilter = (id: keyof typeof filters.value, value: string) => {
        const targetArray = filters.value[id];
        if (!Array.isArray(targetArray)) return;

        const index = targetArray.indexOf(value);
        if (index > -1) {
            targetArray.splice(index, 1);
        } else {
            targetArray.push(value);
        }
    };

    const toggleBooleanFilter = (id: keyof typeof filters.value) => {
        if (typeof filters.value[id] === 'boolean' || typeof filters.value[id] === 'undefined') {
            filters.value[id] = !filters.value[id];
        }
    };

    const toggleNumberFilter = (id: keyof typeof filters.value, value: number) => {
        if (
            typeof filters.value[id] === 'number' ||
            filters.value[id] === null ||
            typeof filters.value[id] === 'undefined'
        ) {
            // Повторный клик по тому же числу сбрасывает его в null (или 0)
            filters.value[id] = filters.value[id] === value ? null : value;
        }
    };

    return {
        filters,
        filteredDreams,
        matchingCount,
        resetFilters,
        toggleFilter,
        toggleBooleanFilter,
        toggleNumberFilter,
    };
});
